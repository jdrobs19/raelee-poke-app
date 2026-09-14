import {
  IndividualApiPokemon,
  PokemonTypes,
  UsersPokemon,
} from "../types/types";
import { defaultImages, images } from "./PokemonImages";
import { pokemonTypes } from "./PokemonTypes";

type StoredPokemon = Omit<UsersPokemon, "types" | "images"> & {
  types: Array<string | PokemonTypes>;
  images?: string;
};

const getTypeName = (type: string | PokemonTypes): string =>
  typeof type === "string" ? type : Object.keys(type)[0];

export const serializePokemon = (
  pokemon: IndividualApiPokemon & { user?: string },
): StoredPokemon => {
  const { images: _images, types, ...pokemonData } = pokemon;

  return {
    ...pokemonData,
    types: types.map(getTypeName),
  };
};

export const hydratePokemon = (pokemon: StoredPokemon): UsersPokemon => ({
  ...pokemon,
  images: images[pokemon.id] || defaultImages[pokemon.id] || pokemon.images || "",
  types: pokemon.types.reduce<PokemonTypes[]>((types, type) => {
    const typeName = getTypeName(type);
    const typeInfo = pokemonTypes[typeName as keyof typeof pokemonTypes];

    if (typeInfo) {
      types.push({ [typeName]: typeInfo });
    }

    return types;
  }, []),
});