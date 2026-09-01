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
    weakness: string[];
    strongAgainst: string[];
    weakAgainst: string[];
  };
}
