import { useEffect } from "react";
import {
  IndividualApiPokemon,
  MatchupType,
  PokemonInformationProps,
  PokemonStats,
  PokemonTypes,
} from "../types/types";
import { pokemonTypes } from "../utils/PokemonTypes";
import { pokemonTabs } from "../utils/Constants";
import { PokemonImage } from "./PokemonImage";
import "../css/component/InformationDetails.css";
import "../css/component/PokemonStats.css";
import "../css/component/PokemonTyping.css";

export function PokemonInformation({
  currentPokemon,
  setCurrentPokemonTab,
  addPokemon,
  removePokemon,
  usersPokemon,
}: PokemonInformationProps) {
  useEffect(() => {
    const statBars = document.querySelectorAll(".stats-bar progress");
    statBars.forEach((statBar) => {
      const element = statBar as HTMLElement;
      element.style.width = "10rem";
    });
  }, []);

  const statsArray = (types: string[], stat: MatchupType): string[] => {
    const statSet = new Set<string>();

    types.forEach((type) => {
      const typeKey = type as keyof typeof pokemonTypes;
      const matchupTypes = pokemonTypes[typeKey]?.[stat] ?? [];

      matchupTypes.forEach((matchup: string) => {
        const formatted = matchup[0].toUpperCase() + matchup.slice(1);
        if (!statSet.has(formatted)) {
          statSet.add(formatted);
        }
      });
    });

    return Array.from(statSet);
  };

  const matchupLabels: Array<{ label: string; key: MatchupType }> = [
    { label: "Strengths", key: "strength" },
    { label: "Weakness", key: "weakness" },
    { label: "Resistant", key: "resistance" },
    { label: "Vulnerable", key: "vulnerable" },
  ];

  const pokemonToAdd: IndividualApiPokemon = {
    id: currentPokemon.id,
    name: currentPokemon.name,
    images: currentPokemon.image,
    types: currentPokemon.types.map((typeName) => {
      const typeData: PokemonTypes = {};
      const typeInfo = pokemonTypes[typeName as keyof typeof pokemonTypes];

      if (typeInfo) {
        typeData[typeName] = {
          image: typeInfo.image,
          resistance: typeInfo.resistance,
          weakness: typeInfo.weakness,
          strength: typeInfo.strength,
          vulnerable: typeInfo.vulnerable,
        };
      }

      return typeData;
    }),
  };

  const isSaved = usersPokemon.some(
    (savedPokemon) => savedPokemon.id === currentPokemon.id,
  );

  return (
    <>
      <div className="details">
        <h1 className="pokemon-name">{currentPokemon.name}</h1>
        <h3>Type: {currentPokemon?.types.join(" - ")}</h3>
        <h3>Stage: {currentPokemon?.evolutionStage}</h3>
        <button onClick={() => setCurrentPokemonTab(pokemonTabs.evolution)}>
          See evolution tree
        </button>
      </div>
      <PokemonImage image={currentPokemon.image} />
      <div className="stats-bar">
        <ul>
          {currentPokemon.stats.map((stat: PokemonStats) => {
            return (
              <li key={stat.name}>
                {stat.name}: {stat.value}
                <progress max={100} value={stat.value} />
              </li>
            );
          })}
        </ul>
      </div>
      <div className="typing-chart">
        <ul>
          {matchupLabels.map(({ label, key }) => (
            <li key={key}>
              <span>{label}:</span>
              <span>{statsArray(currentPokemon.types, key).join(", ")}</span>
            </li>
          ))}
        </ul>
        <button
          className={isSaved ? "add-pokemon added" : "add-pokemon"}
          onClick={() =>
            isSaved ? removePokemon(currentPokemon.id) : addPokemon(pokemonToAdd)
          }
        >
          {isSaved ? "Added ✓ (click to remove)" : "Add Pokémon"}
        </button>
      </div>
    </>
  );
}
