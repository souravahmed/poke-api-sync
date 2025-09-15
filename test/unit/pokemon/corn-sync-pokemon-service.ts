import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { PokemonEntity } from '@/pokemon/entities/PokemonEntity';
import { PokemonService } from '@/pokemon/PokemonService';
import { AppModule } from '@/AppModule';
import { RedisKey } from '@/enums';
import { IPokemonDetailResponse } from '@/pokemon/interfaces';

describe('PokemonService handleCron', () => {
  let pokemonService: PokemonService;
  let pokemonRepo: Repository<PokemonEntity>;
  let cache: Cache;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    pokemonService = module.get<PokemonService>(PokemonService);
    pokemonRepo = module.get<Repository<PokemonEntity>>(getRepositoryToken(PokemonEntity));
    cache = module.get<Cache>('CACHE_MANAGER');

    await pokemonRepo.clear();
    await cache.clear();
  });

  it('Should sync data and invalidate cache', async () => {
    const cacheBefore = await cache.get(RedisKey.POKEMON_LIST);
    expect(cacheBefore).toBeUndefined();

    await pokemonService.handleCron();

    const count = await pokemonRepo.count();
    expect(count).toBeGreaterThan(0);

    const cached = await cache.get(RedisKey.POKEMON_LIST);
    expect(cached).toBeUndefined();
  });

  it('GetItems should populate cache on first call and hit cache on second', async () => {
    // First call -> cache miss, populates cache
    const itemsFirst = await pokemonService.getItems();
    expect(itemsFirst.length).toBeGreaterThan(0);

    const cachedAfterFirst = await cache.get<IPokemonDetailResponse[]>(RedisKey.POKEMON_LIST);
    expect(cachedAfterFirst).toBeDefined();
    expect(cachedAfterFirst!.length).toBe(itemsFirst.length);

    // Second call -> should hit cache
    const itemsSecond = await pokemonService.getItems();
    expect(itemsSecond).toEqual(itemsFirst); // same data
  });

  afterAll(async () => {
    await pokemonRepo.clear();

    await cache.clear();

    await pokemonRepo.manager.connection.close();
  });
});
