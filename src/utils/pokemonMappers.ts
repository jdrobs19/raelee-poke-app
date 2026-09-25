import { IndividualApiPokemon, PokemonTypes } from "../types/types";
import { defaultImages, images } from "./PokemonImages";
import { pokemonTypes } from "./PokemonTypes";

export type PokemonApiDetail = {
  id: number;
  name: string;
  sprites?: { front_default?: string | null };
  types: Array<{ type: { name: string } }>;
  stats: Array<{ base_stat: number; stat: { name: string } }>;
  abilities: Array<{ ability: { name: string } }>;
  moves: Array<{ move: { name: string } }>;
};

export const toPokemonTypes = (types: PokemonApiDetail["types"]): PokemonTypes[] =>
  types.flatMap(({ type }) => {
    const typeInfo = pokemonTypes[type.name as keyof typeof pokemonTypes];
    return typeInfo ? [{ [type.name]: typeInfo }] : [];
  });

export const toIndividualPokemon = (pokemon: PokemonApiDetail): IndividualApiPokemon => ({
  id: pokemon.id,
  name: pokemon.name,
  images: images[pokemon.id] || defaultImages[pokemon.id] || pokemon.sprites?.front_default || "",
  types: toPokemonTypes(pokemon.types),
});