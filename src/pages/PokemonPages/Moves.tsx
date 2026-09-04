import { MovesProps } from "../../types/types";
import "../../css/pages/Moves.css"

export function Moves({ currentPokemon }: MovesProps) {
  return(
    <div className="pokemon-moves-abilities">
        <h1 className="moves-title">Abilities</h1>
        <ul className="pokemon-move-list">
            {currentPokemon?.abilities.abilities.map((ability: string) => (
                <li key={ability} className="move-ability">
                    {ability}
                </li>
            ))}
        </ul>
        <h1 className="moves-title">Moves</h1>
        <ul className="pokemon-move-list">
            {currentPokemon?.abilities.moves.map((move: string) => (
                <li key={move} className="move-ability">
                    {move}
                </li>
            ))}
        </ul>
            </div>
  );
}
