import { Controller, Post } from '@nestjs/common';
import { PokemonService } from './PokemonService';

@Controller('v1/pokemons')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Post('sync')
  async sync() {
    return this.pokemonService.sync();
  }
}
