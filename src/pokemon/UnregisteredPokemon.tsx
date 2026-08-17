import { PokemonProps } from '../types/types'
import { PokemonCard } from './PokemonCard';
import './unregistedPokemon.css';

export function UnregisteredPokemon({ allPokemon }: PokemonProps) {
    return (
        <div className="unregistered-container">
            <h1>Unregistered Pokemon</h1>
            {
                allPokemon.map((pokemon, index) => {
                    return (
                        <PokemonCard pokemon={pokemon} key= {index}/>
                    )
                })
            }
        </div>
    )
}