import { PokemonProps } from "../types/types";
import { PokemonCard } from "./PokemonCard";
import "./unregisteredPokemon.css";

export function RegisteredPokemon({
  allPokemon,
  removePokemon
}: PokemonProps) {
  return (
    <div className="unregistered-container">
      <h1>Registered Pokemon</h1>
      <div className="pokemon-container">
        {allPokemon.map((pokemon, index) => {
          return (
            <PokemonCard
              pokemon={pokemon}
              key={index}
              page="registered"
              onRemove={removePokemon}
            />
          );
        })}
      </div>
    </div>
  );
}
