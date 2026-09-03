import {
  CompareCardProps,
  MatchupType,
  PokemonTypes,
} from "../types/types";
import { MdAdd } from "react-icons/md";
import { useMemo } from "react";
import "../css/component/CompareCard.css";
import { pokemonTypes } from "../utils/PokemonTypes";
import { useNavigate } from "react-router-dom";

const matchupTypes: MatchupType[] = [
  "strength",
  "weakness",
  "resistance",
  "vulnerable",
];

export function CompareCard({
  pokemon,
  isEmpty = false,
  onToggleCompare,
  addPokemon,
}: CompareCardProps) {
  const AddIcon = MdAdd as any;
  const navigate = useNavigate();

  const typeMatchupArray = (
    types: PokemonTypes[],
    matchupType: MatchupType,
  ) => {
    const typeArray: { name: string; image: string }[] = [];
    const typeSet = new Set<string>();

    types.forEach((type: PokemonTypes) => {
      const key = Object.keys(type)[0] as keyof typeof pokemonTypes;
      const matchupValues = type[key][matchupType] ?? [];

      matchupValues.forEach((matchupTypeName: string) => {
        if (!typeSet.has(matchupTypeName)) {
          const matchupInfo =
            pokemonTypes[matchupTypeName as keyof typeof pokemonTypes];

          if (matchupInfo) {
            typeArray.push({
              name: matchupTypeName,
              image: matchupInfo.image,
            });
          }

          typeSet.add(matchupTypeName);
        }
      });
    });
    return typeArray;
  };

  const matchupLabels = {
    strength: "Strength",
    weakness: "Weakness",
    resistance: "Resistance",
    vulnerable: "Vulnerable",
  };

  const memoizedMatchups = useMemo(() => {
    if (!pokemon?.types)
      return {} as Record<MatchupType, { name: string; image: string }[]>;
    return matchupTypes.reduce(
      (acc, matchupType) => {
        acc[matchupType] = typeMatchupArray(pokemon.types, matchupType);
        return acc;
      },
      {} as Record<MatchupType, { name: string; image: string }[]>,
    );
  }, [pokemon?.types]) as Record<
    MatchupType,
    { name: string; image: string }[]
  >;

  const getTypeMatchup = () => {
    return (
      <>
        {matchupTypes.map((matchupType) => (
          <div key={matchupType} className="compare-card-types">
            <h4 className="pokemon-type-title">{matchupLabels[matchupType]}</h4>
            <div className="type-icons">
              {memoizedMatchups[matchupType]?.map(
                (type: { name: string; image: string }) => (
                  <div key={type.name} className="type-icon">
                    <img
                      src={type.image}
                      alt={`${type.name} type`}
                      className="type-image"
                    />
                  </div>
                ),
              )}
            </div>
          </div>
        ))}
      </>
    );
  };

  return (
    <div className="compare-card">
      {isEmpty && (
        <div className="compare-card-empty">
          <button onClick={() => navigate("/search")}>
            <AddIcon />
          </button>
          <h3>Add A Pokémon</h3>
        </div>
      )}
      {!isEmpty && pokemon && (
        <div className="compare-card-content">
          <div className="compare-card-info">
            <div className="compare-card-details">
              <h3 className="compare-card-name">{pokemon.name}</h3>
              <img
                src={pokemon.images}
                alt={pokemon.name}
                className="compare-card-image"
              />
            </div>
            <div className="compare-card-types-container">
              <div className="compare-card-types">
                <h4 className="pokemon-type-title">Type</h4>
                <div className="type-icons">
                  {pokemon.types.map((type: PokemonTypes, index: number) => {
                    const keys = Object.keys(type);
                    return (
                      <div key={index} className="type-icon">
                        <img
                          className="type-image"
                          src={type[keys[0]].image}
                          alt={keys[0]}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
              {getTypeMatchup()}
            </div>
          </div>
          <div className="compare-card-buttons">
            <button
              className="compare-add-button"
              onClick={() => addPokemon(pokemon)}
            >
              Add
            </button>
            <button
              className="compare-view-button"
              onClick={() => navigate(`/pokemon/${pokemon.id}`)}
            >
              View
            </button>
            <button
              className="compare-remove-button"
              onClick={() => onToggleCompare?.(pokemon)}
            >
              Remove
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
