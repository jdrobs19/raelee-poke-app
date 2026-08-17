export { };

export interface Pokemon {
    id: number;
    name: string;
    types: string[];
    abilities: string[];
    img: string;
    user?: string;
}

export interface PokemonProps {
    allPokemon: Pokemon[]
}

export interface PokemonCardProps {
    pokemon: Pokemon
}

export interface Ability{
    ability:{
        name: string;
    }
}

export interface PokemonTyping{
    type:{
        name: string;
    }
}