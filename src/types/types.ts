import { Auth } from "firebase/auth";

export {};

export interface Pokemon {
  id: number;
  name: string;
  types: string[];
  abilities: string[];
  img: string;
  user?: string;
}

export interface PokemonProps {
  allPokemon: Pokemon[];
}

export interface PokemonCardProps {
  pokemon: Pokemon;
}

export interface Ability {
  ability: {
    name: string;
  };
}

export interface PokemonTyping {
  type: {
    name: string;
  };
}

export interface AuthProps {
  auth: Auth;
  isRegistered : (isRegistered: boolean) => void
  isLoggedIn : (isLoggedIn: boolean) => void
  setUser: (setUser: string) => void
}
