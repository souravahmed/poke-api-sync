export interface IPaginationResponse {
  count: number;
  next: string;
  previous: string;
  results: IPokemonListResponse[];
}

export interface IPokemonListResponse {
  name: string;
  url: string;
}
