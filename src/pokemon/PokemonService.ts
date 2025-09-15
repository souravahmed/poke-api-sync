import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cache } from 'cache-manager';
import { Inject } from '@nestjs/common';
import { PokemonEntity } from './entities/PokemonEntity';
import { PokemonClientService } from './PokemonClientService';
import { RedisKey } from '@/enums';

@Injectable()
export class PokemonService {
  constructor(
    @InjectRepository(PokemonEntity)
    private readonly pokemonRepo: Repository<PokemonEntity>,

    @Inject('CACHE_MANAGER')
    private readonly cacheManager: Cache,

    private readonly pokemonClientService: PokemonClientService,
  ) {}

  async sync(): Promise<void> {
    try {
      const pokemons = await this.pokemonClientService.getPokemonList();

      const pokemonDetails = await Promise.all(
        pokemons.results.map((pokemon) => this.pokemonClientService.getPokemonDetails(pokemon.url)),
      );

      await this.pokemonRepo.upsert(
        pokemonDetails.map((detail) => ({
          externalId: detail.id,
          name: detail.name,
          height: detail.height,
          weight: detail.weight,
        })),
        ['externalId'],
      );

      await this.cacheManager.del(RedisKey.POKEMON_LIST);
    } catch (error) {
      Logger.error('Error syncing Pokémon data', error);
      throw new Error('Failed to sync Pokémon data');
    }
  }
}
