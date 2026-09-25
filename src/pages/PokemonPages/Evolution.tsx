import { useQueries } from "@tanstack/react-query";
import { pokemonApiClient } from "../../api/client";
import { Loading } from "../../components/Loading";
import { PokemonDetailsCard } from "../../components/PokemonDetailsCard";
import { EvolutionProps } from "../../types/types";
import { toIndividualPokemon } from "../../utils/pokemonMappers";

export function Evolution({ currentPokemon }: Pick<EvolutionProps, "currentPokemon">) {
  const queries = useQueries({
    queries: currentPokemon.evolution.map(({ pokemon }) => ({
      queryKey: ["pokemon", pokemon.url],
      queryFn: ({ signal }: { signal: AbortSignal }) => pokemonApiClient.getPokemonByUrl(pokemon.url, signal),
      staleTime: 30 * 60 * 1000,
    })),
  });
  const pokemon = queries.flatMap((query) => query.data ? [toIndividualPokemon(query.data)] : []);

  if (queries.some((query) => query.isPending)) return <Loading />;
  if (queries.some((query) => query.isError)) return <p>Evolution data could not be loaded.</p>;

  return <div className="subpage"><PokemonDetailsCard pokemon={pokemon} /></div>;
}