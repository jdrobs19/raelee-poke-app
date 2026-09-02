import { Auth } from "firebase/auth";

export {};

// export interface Pokemon {
//   id: number;
//   name: string;
//   types: string[];
//   abilities: string[];
//   img: string;
//   user: string;
// }

// export interface PokemonProps {
//   allPokemon: Pokemon[];
//   user: string;
//   removePokemon?: Function;
//   addPokemon?: Function;
//   registeredPokemonIds?: number[];
// }

// export interface PokemonCardProps {
//   pokemon: Pokemon;
//   page: string;
//   onRemove?: Function;
//   onAdd?: Function;
// }

// export interface Ability {
//   ability: {
//     name: string;
//   };
// }

// export interface PokemonTyping {
//   type: {
//     name: string;
//   };
// }

// export interface NavBarProps {
//   handleLogout: () => void;
//   isLoggedIn: boolean;
// }

export interface AuthProps {
  auth: Auth;
  isRegistered: (isRegistered: boolean) => void;
  isLoggedIn: (isLoggedIn: boolean) => void;
  setUser: (setUser: string) => void;
}

export interface MyPokemonPageProps {
  auth: Auth;
  user: string;
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  isRegistered: (isRegistered: boolean) => void;
  setUser: (setUser: string) => void;
  usersPokemon: UsersPokemon[];
  removePokemon?: (pokemonId: number) => void;
}

export interface PokemonDetailsCardProps {
  pokemon: IndividualApiPokemon[];
  compareQueue?: IndividualApiPokemon[];
  onToggleCompare?: (pokemon: IndividualApiPokemon) => void;
  addPokemon?: (pokemon: IndividualApiPokemon) => void;
  removePokemon?: (pokemonId: number) => void;
}

export interface SearchProps {
  compareQueue?: IndividualApiPokemon[];
  onToggleCompare?: (pokemon: IndividualApiPokemon) => void;
  addPokemon: (pokemon: IndividualApiPokemon) => void;
}

export interface CompareProps {
  compareQueue?: IndividualApiPokemon[];
  onToggleCompare?: (pokemon: IndividualApiPokemon) => void;
  addPokemon: (pokemon: IndividualApiPokemon) => void;
}

export interface CompareCardProps {
  pokemon?: IndividualApiPokemon;
  isEmpty?: boolean;
  onToggleCompare?: (pokemon: IndividualApiPokemon) => void;
  addPokemon: (pokemon: IndividualApiPokemon) => void;
}

export interface FooterProps {
  handleLogout: () => void;
}

export interface User {
  user: string;
}

export interface PokemonApiData {
  name: string;
  url: string;
}

export interface IndividualApiPokemon {
  id: number;
  name: string;
  images: string;
  types: PokemonTypes[];
}

export interface PokemonTypes {
  [key: string]: {
    image: string;
    resistance: string[];
    strength: string[];
    weakness: string[];
    vulnerable: string[];
  };
}

export interface UsersPokemon extends IndividualApiPokemon {
  user?: string;
}

export type MatchupType = "resistance" | "weakness" | "strength" | "vulnerable";
