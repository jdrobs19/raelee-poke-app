import { Auth } from "firebase/auth";
import { PokemonTab } from "../utils/Constants";

export {};

export interface AuthProps {
  auth: Auth;
  isRegistered: (isRegistered: boolean) => void;
  isLoggedIn: (isLoggedIn: boolean) => void;
  setUser: (setUser: string) => void;
}

export interface MyPokemonPageProps {
  auth: Auth;
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
  usersPokemon?: UsersPokemon[];
}

export interface SearchProps {
  compareQueue?: IndividualApiPokemon[];
  onToggleCompare?: (pokemon: IndividualApiPokemon) => void;
  addPokemon: (pokemon: IndividualApiPokemon) => void;
  removePokemon: (pokemonId: number) => void;
  usersPokemon: UsersPokemon[];
}

export interface CompareProps {
  compareQueue?: IndividualApiPokemon[];
  onToggleCompare?: (pokemon: IndividualApiPokemon) => void;
  addPokemon: (pokemon: IndividualApiPokemon) => void;
  removePokemon: (pokemonId: number) => void;
  usersPokemon: UsersPokemon[];
}

export interface CompareCardProps {
  pokemon?: IndividualApiPokemon;
  isEmpty?: boolean;
  onToggleCompare?: (pokemon: IndividualApiPokemon) => void;
  addPokemon: (pokemon: IndividualApiPokemon) => void;
  removePokemon?: (pokemonId: number) => void;
  usersPokemon?: UsersPokemon[];
}

export interface FooterProps {
  handleLogout: () => void;
  currentPokemonTab: PokemonTab;
  setCurrentPokemonTab: (tab: PokemonTab) => void;
}

export interface PokemonProps {
  currentPokemonTab: PokemonTab;
  setCurrentPokemonTab: (tab: PokemonTab) => void;
  compareQueue: IndividualApiPokemon[];
  onToggleCompare: (pokemon: IndividualApiPokemon) => void;
  addPokemon: (pokemon: IndividualApiPokemon) => void;
  removePokemon: (pokemonId: number) => void;
  usersPokemon: UsersPokemon[];
  addTcgCard: (card: TcgApiData) => void;
  removeTcgCard: (cardId: string) => void;
  usersTcgCards: UsersTcgCard[];
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

export interface PokemonDisplay {
  id: number;
  name: string;
  types: string[];
  image: string;
  stats: PokemonStats[];
  evolutionStage: number;
  evolution: { stage: number; pokemon: { name: string; url: string } }[];
  abilities: { abilities: string[]; moves: string[] };
}


export interface PokemonStats {
  name: string;
  value: number;
}

export interface UsersPokemon extends IndividualApiPokemon {
  user?: string;
}

export type MatchupType = "resistance" | "weakness" | "strength" | "vulnerable";

export type EvolutionChain = {
  species: {
    name: string;
    url: string;
  };
  evolves_to: EvolutionChain[];
};

export type EvolutionEntry = {
  pokemon: {
    name: string;
    url: string;
  };
  stage: number;
};

export interface EvolutionProps {
  currentPokemon: PokemonDisplay;
  compareQueue: IndividualApiPokemon[];
  onToggleCompare: (pokemon: IndividualApiPokemon) => void;
  addPokemon: (pokemon: IndividualApiPokemon) => void;
  removePokemon: (pokemonId: number) => void;
  usersPokemon: UsersPokemon[];
}

export interface MovesProps {
  currentPokemon: PokemonDisplay;
}

export interface OverviewProps {
  currentPokemon: PokemonDisplay;
  setCurrentPokemonTab: (tab: PokemonTab) => void;
  addPokemon: (pokemon: IndividualApiPokemon) => void;
  removePokemon: (pokemonId: number) => void;
  usersPokemon: UsersPokemon[];
}

export interface PokemonInformationProps {
  currentPokemon: PokemonDisplay;
  setCurrentPokemonTab: (tab: PokemonTab) => void;
  addPokemon: (pokemon: IndividualApiPokemon) => void;
  removePokemon: (pokemonId: number) => void;
  usersPokemon: UsersPokemon[];
}

export interface TcgCardsProps {
  currentPokemon: PokemonDisplay;
  addTcgCard?: (card: TcgApiData) => void;
  removeTcgCard?: (cardId: string) => void;
  usersTcgCards?: UsersTcgCard[];
}

export interface TcgApiData{
  id: string;
  localId: string;
  name: string;
  image?: string;
}

export interface UsersTcgCard extends TcgApiData {
  user?: string;
}

export interface MyTcgCardsPageProps {
  auth: Auth;
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  isRegistered: (isRegistered: boolean) => void;
  setUser: (setUser: string) => void;
  usersTcgCards: UsersTcgCard[];
  removeTcgCard?: (cardId: string) => void;
}

export interface TcgSingleCardData{
  rarity: string;
  set: string;
  variants?: CardVariants[];
  cardPrices?: Record<string,CardPrice>;
  priceUpdated: Date;
}

export interface CardVariants{
  name: string;
  available: boolean;
}

export interface CardPrice {
  directLowPrice: number;
  highPrice: number;
  lowPrice: number;
  marketPrice: number;
  midPrice: number;
}

export interface TcgCardDetailsProps{
  card: TcgApiData;
  addTcgCard?: (card: TcgApiData) => void;
  removeTcgCard?: (cardId: string) => void;
  isSaved?: boolean;
}