import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PokemonEntity } from './entities/PokemonEntity';
import { HttpModule } from '@nestjs/axios';
import { PokemonClientService } from './PokemonClientService';
import { MAXIMUM_TIMEOUT_IN_MS } from '@/constants';
import { PokemonService } from './PokemonService';

@Module({
  imports: [
    HttpModule.register({
      timeout: MAXIMUM_TIMEOUT_IN_MS, // 5s timeout
    }),
    TypeOrmModule.forFeature([PokemonEntity]),
  ],
  providers: [PokemonClientService, PokemonService],
})
export class PokemonModule {}
