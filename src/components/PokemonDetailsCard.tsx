import { IndividualApiPokemon, PokemonTypes } from "../types/types";
import "../css/component/PokemonDetailsCard.css";
import { MdCompareArrows, MdAdd, MdRemoveCircleOutline } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";

export function PokemonDetailsCard({
  pokemon,
  compareQueue = [],
  onToggleCompare,
}: {
  pokemon: IndividualApiPokemon[];
  compareQueue?: IndividualApiPokemon[];
  onToggleCompare?: (pokemon: IndividualApiPokemon) => void;
}) {
  const CompareIcon = MdCompareArrows as any;
  const AddIcon = MdAdd as any;
  const RemoveIcon = MdRemoveCircleOutline as any;

  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="pokemon-details-card">
      <div className="pokemon-details">
        {pokemon &&
          pokemon.length > 0 &&
          pokemon.map((p: IndividualApiPokemon) => {
            const isQueued = compareQueue.some(
              (queuedPokemon) => queuedPokemon.id === p.id,
            );

            return (
              <div className="pokemon-card" key={p.id}>
                <div className="pokemon-card-list">
                  {location.pathname.includes("/search") ||
                  location.pathname.includes("/pokemon") ? (
                    <AddIcon className="add-icon" />
                  ) : (
                    <RemoveIcon className="remove-icon" />
                  )}
                </div>
                <button
                  type="button"
                  className="pokemon-card-compare"
                  aria-label={
                    isQueued ? `remove ${p.name} from compare` : `compare ${p.name}`
                  }
                  onClick={() => onToggleCompare?.(p)}
                >
                {
                   !isQueued ? (<CompareIcon className="compare-icon" /> ) :
                   ( <RemoveIcon className="remove-icon" /> )
                }
                </button>
                <h3 className="pokemon-card-name">{p.name}</h3>
                <img
                  className="pokemon-card-image"
                  src={p.images}
                  alt={p.name}
                  onClick={() => navigate(`/pokemon/${p.id}`)}
                />
                <div className="pokemon-card-types">
                  {p.types.map((type: PokemonTypes, index: number) => {
                    const keys = Object.keys(type);
                    return (
                      <div className="pokemon-type" key={index}>
                        <img
                          className="pokemon-type-image"
                          src={type[keys[0]].image}
                          alt={keys[0]}
                        />
                        <div className="pokemon-type-name">{keys[0]}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
