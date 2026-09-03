import "../css/component/PokemonImage.css"

export function PokemonImage(
    {image} : {image: string}
){
    return(
        <div className="pokemon-image">
            <img src={image} alt="pokemon"/>
        </div>
    )
}   