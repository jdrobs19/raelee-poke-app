import { PokemonProps } from "../types/types";
import { PokemonCard } from "./PokemonCard";
import "./unregisteredPokemon.css";

export function UnregisteredPokemon({ allPokemon }: PokemonProps) {
  return (
    <div className="unregistered-container">
      <h1>Unregistered Pokemon</h1>
      <div className="pokemon-container">
        {allPokemon.map((pokemon, index) => {
          return <PokemonCard pokemon={pokemon} key={index} />;
        })}
      </div>
    </div>
  );
}
