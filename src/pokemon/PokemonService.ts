import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cache } from 'cache-manager';
import { Inject } from '@nestjs/common';
import { PokemonEntity } from './entities/PokemonEntity';
import { PokemonClientService } from './PokemonClientService';
import { RedisKey } from '@/enums';
import { IPokemonDetailResponse } from './interfaces';
import { Cron } from '@nestjs/schedule';
import { ExtendedCronExpression } from '@/constants';

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

      Logger.log('Pokémon data synced successfully');
    } catch (error) {
      Logger.error('Error syncing Pokémon data', error);
      throw new Error('Failed to sync Pokémon data');
    }
  }

  async getItems(): Promise<IPokemonDetailResponse[]> {
    try {
      const cachedData = await this.cacheManager.get<IPokemonDetailResponse[]>(RedisKey.POKEMON_LIST);

      if (cachedData) return cachedData;

      const items = await this.pokemonRepo.find();
      await this.cacheManager.set(RedisKey.POKEMON_LIST, items);

      return items;
    } catch (error) {
      Logger.error('Error fetching Pokémon list', error);
      throw new Error('Failed to fetch Pokémon list');
    }
  }

  @Cron(ExtendedCronExpression.EVERY_15_MINUTES)
  async handleCron() {
    Logger.log('Running scheduled Pokémon sync...');
    await this.sync();
  }
}
