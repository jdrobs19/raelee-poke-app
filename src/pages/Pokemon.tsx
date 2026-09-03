import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { extractColors } from "extract-colors";
import { Loading } from "../components/Loading";
import { MainPage } from "../snippets/MainPage";
import {
  PokemonDisplay,
  PokemonStats,
  EvolutionChain,
  EvolutionEntry,
  PokemonProps,
} from "../types/types";
import {
  pokemonTabs,
  individualPokemon,
  pokemonSpecies,
} from "../utils/Constants";
import { defaultImages, images } from "../utils/PokemonImages";
import { Overview } from "./PokemonPages/Overview";
import { Evolution } from "./PokemonPages/Evolution";
import { Moves } from "./PokemonPages/Moves";
import { TcgCards } from "./PokemonPages/TcgCards";

export function Pokemon({
  currentPokemonTab,
  setCurrentPokemonTab,
  compareQueue,
  onToggleCompare,
  addPokemon,
}: PokemonProps) {
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [currentPokemon, setCurrentPokemon] = useState<PokemonDisplay | null>(
    null,
  );
  const getEvolutionChain = useCallback(
    (
      evolutionChain: EvolutionChain,
      stage: number,
      evolutionData: EvolutionEntry[],
    ): EvolutionEntry[] => {
      if (!evolutionChain.evolves_to.length) {
        evolutionData.push({
          pokemon: {
            ...evolutionChain.species,
            url: evolutionChain.species.url.replace(
              "pokemon-species",
              "pokemon",
            ),
          },
          stage,
        });

        return evolutionData;
      }

      evolutionData.push({
        pokemon: {
          ...evolutionChain.species,
          url: evolutionChain.species.url.replace("pokemon-species", "pokemon"),
        },
        stage,
      });

      return getEvolutionChain(
        evolutionChain.evolves_to[0],
        stage + 1,
        evolutionData,
      );
    },
    [],
  );

  const getEvolutionData = useCallback(
    (evolutionChain: EvolutionChain) => {
      const evolutionData: EvolutionEntry[] = [];
      getEvolutionChain(evolutionChain, 1, evolutionData);
      return evolutionData;
    },
    [getEvolutionChain],
  );

  const getPokemonInfo = useCallback(
    async (image: string) => {
      try {
        const pokemonResponse = await fetch(`${individualPokemon}/${id}`);
        if (!pokemonResponse.ok) {
          throw new Error(`Failed to fetch Pokémon: ${id}`);
        }

        const pokemonData = await pokemonResponse.json();

        const speciesResponse = await fetch(
          `${pokemonSpecies}/${pokemonData.id}`,
        );
        if (!speciesResponse.ok) {
          throw new Error(`Failed to fetch Pokémon species: ${pokemonData.id}`);
        }

        const species = await speciesResponse.json();
        const evolutionUrl = species.evolution_chain.url;
        const evolutionResponse = await fetch(evolutionUrl);
        if (!evolutionResponse.ok) {
          throw new Error(`Failed to fetch Pokémon evolution info`);
        }
        const evolutionResponseData = await evolutionResponse.json();
        const evolution = getEvolutionData(evolutionResponseData.chain);
        const evolutionStage =
          evolution.find(({ pokemon }) => pokemon.name === pokemonData.name)
            ?.stage ?? 1;

        const pokemonStats: PokemonStats[] = pokemonData.stats.map(
          ({ base_stat, stat }: { base_stat: number; stat: { name: string } }) => ({
            name: stat.name,
            value: base_stat,
          }),
        );

        const pokemonAbilities = {
          abilities: pokemonData.abilities.map(
            ({ ability }: { ability: { name: string } }) => ability.name,
          ),
          moves: pokemonData.moves.map(
            ({ move }: { move: { name: string } }) => move.name,
          ),
        };

        setCurrentPokemon({
          id: pokemonData.id,
          name: pokemonData.name,
          types: pokemonData.types.map(
            ({ type }: { type: { name: string } }) => type.name,
          ),
          image,
          stats: pokemonStats,
          evolutionStage,
          evolution,
          abilities: pokemonAbilities,
        });

        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    },
    [id, getEvolutionData],
  );

  useEffect(() => {
    if (!id) return;

    setCurrentPokemonTab(pokemonTabs.overview);

    const pokemonImage = document.createElement("img");
    pokemonImage.src = images[id];

    const options = {
      pixels: 10000,
      distance: 1,
      splitPower: 10,
      colorValidator: (red: number, green: number, blue: number, alpha = 255) =>
        alpha > 250,
      saturationDistance: 0.2,
      lightnessDistance: 0.2,
      hueDistance: 0.083333333,
    };

    const getColor = async () => {
      const color = await extractColors(pokemonImage.src, options);
      const root = document.documentElement;
      root.style.setProperty("--accent-color", color[0].hex.split('"')[0]);
    };
    getColor();
    let image = images[id];
    if (!image) {
      image = defaultImages[id];
    }

    getPokemonInfo(image);
  }, [id, getPokemonInfo, setCurrentPokemonTab]);


  return (
    <>
      {!isLoading && currentPokemon ? (
        <>
          {currentPokemonTab === pokemonTabs.overview && (
            <Overview
              currentPokemon={currentPokemon}
              setCurrentPokemonTab={setCurrentPokemonTab}
              addPokemon ={addPokemon}
            />
          )}
          {currentPokemonTab === pokemonTabs.evolution && (
            <Evolution
              currentPokemon={currentPokemon}
              compareQueue={compareQueue}
              onToggleCompare={onToggleCompare}
              addPokemon={addPokemon}
            />
          )}
          {currentPokemonTab === pokemonTabs.moves && (
            <Moves currentPokemon={currentPokemon} />
          )}
          {currentPokemonTab === pokemonTabs.tcgCards && <TcgCards />}
        </>
      ) : (
        <Loading />
      )}
    </>
  );
}

export default MainPage(Pokemon);
