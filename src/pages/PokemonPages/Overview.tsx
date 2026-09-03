import { PokemonImage } from "../../components/PokemonImage";
import { PokemonInformation } from "../../components/PokemonInformation";
import { OverviewProps } from "../../types/types";

export function Overview(
    {currentPokemon, setCurrentPokemonTab, addPokemon} : OverviewProps
){
    return(
        <>
            <PokemonInformation
                currentPokemon={currentPokemon}
                setCurrentPokemonTab={setCurrentPokemonTab}
                addPokemon={addPokemon}
            />
            {currentPokemon && <PokemonImage image={currentPokemon.image}/>}
        </>
    )
}