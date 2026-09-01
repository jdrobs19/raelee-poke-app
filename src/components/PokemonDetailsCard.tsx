import { PokemonTypes, UsersPokemon } from "../types/types";
import "../css/component/PokemonDetailsCard.css";

export function PokemonDetailsCard({ pokemon }: { pokemon: UsersPokemon[] }) {
  return (
    <div className="pokemon-details-card">
      <div className="pokemon-details">
        {pokemon &&
          pokemon.length > 0 &&
          pokemon.map((p: UsersPokemon) => {
            return (
              <div className="pokemon-card" key={p.id}>
                <div className="pokemon-card-list"></div>
                <div className="pokemon-card-compare"></div>
                <h3 className="pokemon-card-name">{p.name}</h3>
                <img
                  className="pokemon-card-image"
                  src={p.images}
                  alt={p.name}
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
