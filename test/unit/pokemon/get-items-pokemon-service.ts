import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { PokemonEntity } from '@/pokemon/entities/PokemonEntity';
import { PokemonService } from '@/pokemon/PokemonService';
import { AppModule } from '@/AppModule';
import { RedisKey } from '@/enums';

describe('PokemonService getItems', () => {
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

  it('Should get real Pokémon data from DB', async () => {
    await pokemonService.sync();

    const items = await pokemonService.getItems();

    expect(items.length).toBeGreaterThan(0);

    const cached = await cache.get(RedisKey.POKEMON_LIST);

    expect(cached).toBeDefined();
    expect((cached as unknown[]).length).toBe(items.length);
  });

  it('Should get real Pokémon data from Cache', async () => {
    await pokemonRepo.clear();

    const items = await pokemonService.getItems();

    expect(items.length).toBeGreaterThan(0);

    const cached = await cache.get(RedisKey.POKEMON_LIST);

    expect(cached).toBeDefined();
    expect((cached as unknown[]).length).toBe(items.length);
  });

  afterAll(async () => {
    await pokemonRepo.clear();

    await cache.clear();

    await pokemonRepo.manager.connection.close();
  });
});
