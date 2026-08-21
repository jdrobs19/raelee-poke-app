import { Auth } from "firebase/auth";

export {};

export interface Pokemon {
  id: number;
  name: string;
  types: string[];
  abilities: string[];
  img: string;
  user: string;
}

export interface PokemonProps {
  allPokemon: Pokemon[];
  user: string;
  removePokemon?: Function;
  addPokemon?: Function;
  registeredPokemonIds?: number[];
}

export interface PokemonCardProps {
  pokemon: Pokemon;
  page: string;
  onRemove?: Function;
  onAdd?: Function;
  isRegistered?: boolean;
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

export interface NavBarProps {
  handleLogout: () => void;
  isLoggedIn: boolean;
}
