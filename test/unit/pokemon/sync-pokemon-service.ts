import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { PokemonEntity } from '@/pokemon/entities/PokemonEntity';
import { PokemonService } from '@/pokemon/PokemonService';
import { AppModule } from '@/AppModule';
import { RedisKey } from '@/enums';

describe('PokemonService Integration', () => {
  let pokemonService: PokemonService;
  let pokemonRepo: Repository<PokemonEntity>;
  let cache: Cache;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    pokemonService = module.get<PokemonService>(PokemonService);
    pokemonRepo = module.get<Repository<PokemonEntity>>(getRepositoryToken(PokemonEntity));
    cache = module.get('CACHE_MANAGER');
  });

  it('Should sync real Pokémon data and store in DB & cache', async () => {
    await pokemonService.sync();

    const count = await pokemonRepo.count();
    expect(count).toBeGreaterThan(0);

    const cached = await cache.get(RedisKey.POKEMON_LIST);
    expect(cached).toBeUndefined();
  });

  afterAll(async () => {
    await pokemonRepo.clear();

    await cache.clear();

    await pokemonRepo.manager.connection.close();
  });
});
