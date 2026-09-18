import { useEffect, useState } from "react";
import { Loading } from "../../components/Loading";
import { PokemonDetailsCard } from "../../components/PokemonDetailsCard";
import {
  EvolutionProps,
  IndividualApiPokemon,
  PokemonTypes,
} from "../../types/types";
import { images, defaultImages } from "../../utils/PokemonImages";
import { pokemonTypes } from "../../utils/PokemonTypes";

export function Evolution({
  currentPokemon,
  compareQueue,
  onToggleCompare,
  addPokemon,
  removePokemon,
  usersPokemon,
}: EvolutionProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [evolutionPokemon, setEvolutionPokemon] = useState<
    IndividualApiPokemon[]
  >([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    const fetchData = async () => {
      setIsLoaded(false);
      setError(null);

      try {
        const pokemons = await Promise.all(
          currentPokemon.evolution.map(async ({ pokemon }) => {
            const response = await fetch(pokemon.url);
            if (!response.ok) {
              throw new Error(`Failed to fetch ${pokemon.name}`);
            }
            const pokemonData = await response.json();

            return {
              id: pokemonData.id,
              name: pokemonData.name,
              images:
                images[pokemonData.id] ||
                defaultImages[pokemonData.id] ||
                pokemonData.sprites.front_default ||
                "",
              types: pokemonData.types.map((typeObj: any) => {
                const typeName = typeObj.type.name;
                const typeData: PokemonTypes = {};
                const typeInfo =
                  pokemonTypes[typeName as keyof typeof pokemonTypes];

                if (typeInfo) {
                  typeData[typeName] = typeInfo;
                }

                return typeData;
              }),
            } satisfies IndividualApiPokemon;
          }),
        );

        if (!isCancelled) {
          setEvolutionPokemon(pokemons);
          setIsLoaded(true);
        }
      } catch (fetchError) {
        if (!isCancelled) {
          setError(
            fetchError instanceof Error
              ? fetchError.message
              : "Failed to fetch evolution data",
          );
          setIsLoaded(true);
        }
      }
    };

    fetchData();

    return () => {
      isCancelled = true;
    };
  }, [currentPokemon]);

  return (
    <div className="subpage">
      {error ? (
        <p>{error}</p>
      ) : isLoaded ? (
        <PokemonDetailsCard
          pokemon={evolutionPokemon}
          compareQueue={compareQueue}
          onToggleCompare={onToggleCompare}
          addPokemon={addPokemon}
          removePokemon={removePokemon}
          usersPokemon={usersPokemon}
        />
      ) : (
        <Loading />
      )}
    </div>
  );
}
