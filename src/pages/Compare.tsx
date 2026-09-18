import { CompareCard } from "../components/CompareCard";
import { CompareProps } from "../types/types";
import "../css/pages/Compare.css";

export function Compare({
  compareQueue = [],
  onToggleCompare,
  addPokemon,
  removePokemon,
  usersPokemon,
}: CompareProps) {
  return (
    <div className="compare">
      <CompareCard
        pokemon={compareQueue[0]}
        isEmpty={compareQueue.length < 1}
        onToggleCompare={onToggleCompare}
        addPokemon={addPokemon}
        removePokemon={removePokemon}
        usersPokemon={usersPokemon}
      />
      <CompareCard
        pokemon={compareQueue[1]}
        isEmpty={compareQueue.length < 2}
        onToggleCompare={onToggleCompare}
        addPokemon={addPokemon}
        removePokemon={removePokemon}
        usersPokemon={usersPokemon}
      />
    </div>
  );
}
