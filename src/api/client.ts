import { EvolutionChain, PokemonApiData, TcgApiData, TcgCardDetailResponse } from "../types/types";
import { allPokemon, individualPokemon, pokemonSpecies, tcgApi } from "../utils/Constants";
import { PokemonApiDetail } from "../utils/pokemonMappers";

const fetchJson = async <T>(url: string, signal?: AbortSignal): Promise<T> => {
  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
};

export const pokemonApiClient = {
  getIndex: (signal?: AbortSignal) =>
    fetchJson<{ results: PokemonApiData[] }>(allPokemon, signal),
  getPokemon: (id: string | number, signal?: AbortSignal) =>
    fetchJson<PokemonApiDetail>(`${individualPokemon}/${id}`, signal),
  getPokemonByUrl: (url: string, signal?: AbortSignal) =>
    fetchJson<PokemonApiDetail>(url, signal),
  getSpecies: (id: string | number, signal?: AbortSignal) =>
    fetchJson<{ evolution_chain?: { url?: string } }>(`${pokemonSpecies}/${id}`, signal),
  getEvolutionChain: (url: string, signal?: AbortSignal) =>
    fetchJson<{ chain: EvolutionChain }>(url, signal),
};

export const tcgApiClient = {
  getCards: (pokemonName: string, signal?: AbortSignal) =>
    fetchJson<TcgApiData[]>(
      `${tcgApi}/cards?name=like:${encodeURIComponent(pokemonName)}`,
      signal,
    ),
  getCard: (cardId: string, signal?: AbortSignal) =>
    fetchJson<TcgCardDetailResponse>(`${tcgApi}/cards/${encodeURIComponent(cardId)}`, signal),
};