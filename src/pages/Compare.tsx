import { CompareCard } from "../components/CompareCard";
import { IndividualApiPokemon } from "../types/types";
import "../css/pages/Compare.css";

export function Compare({
  compareQueue = [],
  onToggleCompare,
}: {
  compareQueue?: IndividualApiPokemon[];
  onToggleCompare?: (pokemon: IndividualApiPokemon) => void;
}) {
  return (
    <div className="compare">
      <CompareCard
        pokemon={compareQueue[0]}
        isEmpty={compareQueue.length < 1}
        onToggleCompare={onToggleCompare}
      />
      <CompareCard
        pokemon={compareQueue[1]}
        isEmpty={compareQueue.length < 2}
        onToggleCompare={onToggleCompare}
      />
    </div>
  );
}
