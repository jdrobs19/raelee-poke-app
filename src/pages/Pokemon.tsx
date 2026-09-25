import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { pokemonApiClient } from "../api/client";
import { Loading } from "../components/Loading";
import { useAppState } from "../context/AppStateContext";
import { MainPage } from "../snippets/MainPage";
import { EvolutionChain, EvolutionEntry, PokemonDisplay } from "../types/types";
import { pokemonTabs } from "../utils/Constants";
import { toIndividualPokemon } from "../utils/pokemonMappers";
import { Evolution } from "./PokemonPages/Evolution";
import { Moves } from "./PokemonPages/Moves";
import { Overview } from "./PokemonPages/Overview";
import { TcgCards } from "./PokemonPages/TcgCards";

const getEvolutionData = (evolutionChain: EvolutionChain, stage = 1): EvolutionEntry[] => [
  {
    pokemon: {
      ...evolutionChain.species,
      url: evolutionChain.species.url.replace("pokemon-species", "pokemon"),
    },
    stage,
  },
  ...evolutionChain.evolves_to.flatMap((evolution) => getEvolutionData(evolution, stage + 1)),
];

export function Pokemon() {
  const { id } = useParams<{ id: string }>();
  const { currentPokemonTab, setCurrentPokemonTab, addPokemon, removePokemon, usersPokemon } = useAppState();
  const { data: currentPokemon, isPending, isError } = useQuery({
    queryKey: ["pokemon", "detail", id],
    enabled: Boolean(id),
    queryFn: async ({ signal }): Promise<PokemonDisplay> => {
      const pokemonData = await pokemonApiClient.getPokemon(id!, signal);
      const pokemon = toIndividualPokemon(pokemonData);
      let evolution: EvolutionEntry[] = [{ pokemon: { name: pokemon.name, url: `https://pokeapi.co/api/v2/pokemon/${pokemon.id}` }, stage: 1 }];
      let evolutionStage = 1;

      try {
        const species = await pokemonApiClient.getSpecies(pokemon.id, signal);
        if (species.evolution_chain?.url) {
          evolution = getEvolutionData((await pokemonApiClient.getEvolutionChain(species.evolution_chain.url, signal)).chain);
          evolutionStage = evolution.find(({ pokemon: entry }) => entry.name === pokemon.name)?.stage ?? 1;
        }
      } catch {}

      return {
        id: pokemon.id,
        name: pokemon.name,
        types: pokemonData.types.map(({ type }) => type.name),
        image: pokemon.images,
        stats: pokemonData.stats.map(({ base_stat, stat }) => ({ name: stat.name, value: base_stat })),
        evolutionStage,
        evolution,
        abilities: {
          abilities: pokemonData.abilities.map(({ ability }) => ability.name),
          moves: pokemonData.moves.map(({ move }) => move.name),
        },
      };
    },
  });

  if (isPending) return <Loading />;
  if (isError || !currentPokemon) return <p>Pokemon data could not be loaded.</p>;

  return (
    <>
      {currentPokemonTab === pokemonTabs.overview && <Overview currentPokemon={currentPokemon} setCurrentPokemonTab={setCurrentPokemonTab} addPokemon={addPokemon} removePokemon={removePokemon} usersPokemon={usersPokemon} />}
      {currentPokemonTab === pokemonTabs.evolution && <Evolution currentPokemon={currentPokemon} />}
      {currentPokemonTab === pokemonTabs.moves && <Moves currentPokemon={currentPokemon} />}
      {currentPokemonTab === pokemonTabs.tcgCards && <TcgCards currentPokemon={currentPokemon} />}
    </>
  );
}

export default MainPage(Pokemon);