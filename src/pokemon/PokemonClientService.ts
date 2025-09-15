/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/unbound-method */
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import axiosRetry from 'axios-retry';
import { firstValueFrom } from 'rxjs';
import { DEFAULT_PAGE_LIMIT, MAXIMUM_RETRIES } from '@/constants';
import { IPaginationResponse, IPokemonDetailResponse } from './interfaces';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PokemonClientService {
  private readonly baseUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly http: HttpService,
  ) {
    const baseUrl = this.configService.get<string>('POKEAPI_BASE_URL');
    if (!baseUrl) {
      throw new Error('POKEAPI_BASE_URL is not defined in environment variables');
    }
    this.baseUrl = baseUrl;

    axiosRetry(this.http.axiosRef, { retries: MAXIMUM_RETRIES, retryDelay: axiosRetry.exponentialDelay });
  }

  async getPokemonList(limit = DEFAULT_PAGE_LIMIT): Promise<IPaginationResponse> {
    try {
      const response = await firstValueFrom(this.http.get<IPaginationResponse>(`${this.baseUrl}?limit=${limit}`));

      return response.data;
    } catch (err) {
      Logger.error(`Error fetching Pokémon list: ${err.message}`);
      throw err;
    }
  }

  async getPokemonDetails(url: string): Promise<IPokemonDetailResponse> {
    try {
      const response = await firstValueFrom(this.http.get<IPokemonDetailResponse>(url));
      return response.data;
    } catch (err) {
      throw new Error(`Failed to fetch Pokémon details: ${err.message}`);
    }
  }
}
