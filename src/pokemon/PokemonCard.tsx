import { PokemonCardProps } from "../types/types";
import "./PokemonCard.css";

export function PokemonCard({ pokemon }: PokemonCardProps) {
  return (
    <div className="pokemon-card">
      <div className="pokemon-details">
        <img src={pokemon.img} alt={pokemon.name} className="pokemon-image" />
        <h3>{pokemon.name}</h3>
        <p>
          <span>Types: </span>
          {pokemon.types.join(", ")}
        </p>
        <p>
          <span>Abilities: </span>
          {pokemon.abilities.join(", ")}
        </p>
      </div>
    </div>
  );
}
