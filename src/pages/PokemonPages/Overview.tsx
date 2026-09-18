import { PokemonInformation } from "../../components/PokemonInformation";
import { OverviewProps } from "../../types/types";

export function Overview(
    {currentPokemon, setCurrentPokemonTab, addPokemon, removePokemon, usersPokemon} : OverviewProps
){
    return(
        <div className="pokemon-overview">
            <PokemonInformation
                currentPokemon={currentPokemon}
                setCurrentPokemonTab={setCurrentPokemonTab}
                addPokemon={addPokemon}
                removePokemon={removePokemon}
                usersPokemon={usersPokemon}
            />
        </div>
    )
}