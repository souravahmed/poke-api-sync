import { Controller, Get, Post } from '@nestjs/common';
import { PokemonService } from './PokemonService';

@Controller('v1/pokemons')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Post('sync')
  async sync() {
    return this.pokemonService.sync();
  }

  @Get('items')
  async getItems() {
    return this.pokemonService.getItems();
  }
}
