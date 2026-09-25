import { CompareCard } from "../components/CompareCard";
import { useAppState } from "../context/AppStateContext";
import "../css/pages/Compare.css";

export function Compare() {
  const { compareQueue } = useAppState();

  return (
    <div className="compare">
      <CompareCard pokemon={compareQueue[0]} isEmpty={compareQueue.length < 1} />
      <CompareCard pokemon={compareQueue[1]} isEmpty={compareQueue.length < 2} />
    </div>
  );
}