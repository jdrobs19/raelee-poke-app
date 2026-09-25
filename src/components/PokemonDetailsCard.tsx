import {
  IndividualApiPokemon,
  PokemonDetailsCardProps,
  PokemonTypes,
} from "../types/types";
import "../css/component/PokemonDetailsCard.css";
import { MdCompareArrows, MdAdd, MdRemoveCircleOutline, MdCheckCircle } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppState } from "../context/AppStateContext";

export function PokemonDetailsCard({
  pokemon,
}: PokemonDetailsCardProps) {
  const { compareQueue, toggleComparePokemon, addPokemon, removePokemon, usersPokemon } = useAppState();
  const CompareIcon = MdCompareArrows as any;
  const AddIcon = MdAdd as any;
  const RemoveIcon = MdRemoveCircleOutline as any;
  const AddedIcon = MdCheckCircle as any;

  const location = useLocation();
  const navigate = useNavigate();
  const isAddContext =
    location.pathname.includes("/search") || location.pathname.includes("/pokemon");

  return (
    <div className="pokemon-details-card">
      <div className="pokemon-details">
        {pokemon &&
          pokemon.length > 0 &&
          pokemon.map((p: IndividualApiPokemon) => {
            const isQueued = compareQueue.some(
              (queuedPokemon) => queuedPokemon.id === p.id,
            );
            const isSaved = usersPokemon.some(
              (savedPokemon) => savedPokemon.id === p.id,
            );

            return (
              <div className="pokemon-card" key={p.id}>
                <div className="pokemon-card-list">
                  {isAddContext ? (
                    isSaved ? (
                      <AddedIcon
                        className="added-icon"
                        title={`${p.name} is in your collection - click to remove`}
                        aria-label={`remove ${p.name} from your collection`}
                        onClick={() => removePokemon?.(p.id)}
                      />
                    ) : (
                      <AddIcon
                        className="add-icon"
                        title={`add ${p.name} to your collection`}
                        aria-label={`add ${p.name} to your collection`}
                        onClick={() => addPokemon?.(p)}
                      />
                    )
                  ) : (
                    <RemoveIcon
                      className="remove-icon"
                      onClick={() => removePokemon?.(p.id)}
                    />
                  )}
                </div>
                <button
                  type="button"
                  className="pokemon-card-compare"
                  aria-label={
                    isQueued
                      ? `remove ${p.name} from compare`
                      : `compare ${p.name}`
                  }
                  onClick={() => toggleComparePokemon(p)}
                >
                  {!isQueued ? (
                    <CompareIcon className="compare-icon" />
                  ) : (
                    <RemoveIcon className="remove-icon" />
                  )}
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
