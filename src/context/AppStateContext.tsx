import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, doc, onSnapshot, setDoc, deleteDoc, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";
import { IndividualApiPokemon, TcgApiData, UsersPokemon, UsersTcgCard } from "../types/types";
import { PokemonTab, pokemonTabs } from "../utils/Constants";
import { hydratePokemon, serializePokemon } from "../utils/PokemonStorage";
import {
  addPokemonFailureNotification,
  addTcgCardFailureNotification,
  compareQueueNotification,
  logoutErrorNotification,
  logoutSuccessNotification,
  pokemonAddNotification,
  pokemonAlreadyExistsNotification,
  pokemonRemoveNotification,
  tcgCardAddNotification,
  tcgCardAlreadyExistsNotification,
  tcgCardRemoveNotification,
} from "../utils/notifications";

type AppState = {
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  setUser: (user: string) => void;
  usersPokemon: UsersPokemon[];
  usersTcgCards: UsersTcgCard[];
  compareQueue: IndividualApiPokemon[];
  currentPokemonTab: PokemonTab;
  setCurrentPokemonTab: (tab: PokemonTab) => void;
  addPokemon: (pokemon: IndividualApiPokemon) => Promise<void>;
  removePokemon: (pokemonId: number) => Promise<void>;
  addTcgCard: (card: TcgApiData) => Promise<void>;
  removeTcgCard: (cardId: string) => Promise<void>;
  toggleComparePokemon: (pokemon: IndividualApiPokemon) => void;
  handleLogout: () => Promise<void>;
};

const AppStateContext = createContext<AppState | null>(null);
const documentId = (userId: string, itemId: string | number) =>
  `${userId}_${encodeURIComponent(String(itemId))}`;

export function AppStateProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [usersPokemon, setUsersPokemon] = useState<UsersPokemon[]>([]);
  const [usersTcgCards, setUsersTcgCards] = useState<UsersTcgCard[]>([]);
  const [compareQueue, setCompareQueue] = useState<IndividualApiPokemon[]>([]);
  const [currentPokemonTab, setCurrentPokemonTab] = useState<PokemonTab>(pokemonTabs.overview);

  useEffect(() => onAuthStateChanged(auth, (firebaseUser) => {
    setUser(firebaseUser?.uid ?? "");
    setIsLoggedIn(Boolean(firebaseUser));
  }), []);

  useEffect(() => {
    if (!user) {
      setUsersPokemon([]);
      setUsersTcgCards([]);
      return;
    }

    const pokemonQuery = query(collection(db, "pokemon"), where("user", "==", user));
    const tcgCardsQuery = query(collection(db, "tcgCards"), where("user", "==", user));
    const unsubscribePokemon = onSnapshot(pokemonQuery, (snapshot) => {
      setUsersPokemon(snapshot.docs.map((snapshotDoc) => hydratePokemon(snapshotDoc.data() as Parameters<typeof hydratePokemon>[0])));
    });
    const unsubscribeTcgCards = onSnapshot(tcgCardsQuery, (snapshot) => {
      setUsersTcgCards(snapshot.docs.map((snapshotDoc) => snapshotDoc.data() as UsersTcgCard));
    });

    return () => {
      unsubscribePokemon();
      unsubscribeTcgCards();
    };
  }, [user]);

  const addPokemon = async (pokemon: IndividualApiPokemon) => {
    if (!user) {
      addPokemonFailureNotification();
      return;
    }
    if (usersPokemon.some((savedPokemon) => savedPokemon.id === pokemon.id)) {
      pokemonAlreadyExistsNotification(pokemon.name);
      return;
    }

    await setDoc(doc(db, "pokemon", documentId(user, pokemon.id)), serializePokemon({ ...pokemon, user }));
    pokemonAddNotification(pokemon.name);
  };

  const removePokemon = async (pokemonId: number) => {
    if (!user) return;
    await deleteDoc(doc(db, "pokemon", documentId(user, pokemonId)));
    const legacyDocuments = await getDocs(query(collection(db, "pokemon"), where("user", "==", user), where("id", "==", pokemonId)));
    await Promise.all(legacyDocuments.docs.map((legacyDocument) => deleteDoc(legacyDocument.ref)));
    pokemonRemoveNotification("Pokemon removed");
  };

  const addTcgCard = async (card: TcgApiData) => {
    if (!user) {
      addTcgCardFailureNotification();
      return;
    }
    if (usersTcgCards.some((savedCard) => savedCard.id === card.id)) {
      tcgCardAlreadyExistsNotification(card.name);
      return;
    }

    await setDoc(doc(db, "tcgCards", documentId(user, card.id)), { ...card, user });
    tcgCardAddNotification(card.name);
  };

  const removeTcgCard = async (cardId: string) => {
    if (!user) return;
    await deleteDoc(doc(db, "tcgCards", documentId(user, cardId)));
    const legacyDocuments = await getDocs(query(collection(db, "tcgCards"), where("user", "==", user), where("id", "==", cardId)));
    await Promise.all(legacyDocuments.docs.map((legacyDocument) => deleteDoc(legacyDocument.ref)));
    tcgCardRemoveNotification("Trading card removed");
  };

  const toggleComparePokemon = (pokemon: IndividualApiPokemon) => {
    if (compareQueue.some((queuedPokemon) => queuedPokemon.id === pokemon.id)) {
      setCompareQueue((current) => current.filter((queuedPokemon) => queuedPokemon.id !== pokemon.id));
      compareQueueNotification(pokemon.name, "remove");
      return;
    }

    setCompareQueue((current) => current.length >= 2 ? [...current.slice(1), pokemon] : [...current, pokemon]);
    compareQueueNotification(pokemon.name, "add");
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      logoutSuccessNotification();
    } catch (error) {
      logoutErrorNotification(error as Error);
    }
  };

  return (
    <AppStateContext.Provider value={{ isLoggedIn, setIsLoggedIn, setUser, usersPokemon, usersTcgCards, compareQueue, currentPokemonTab, setCurrentPokemonTab, addPokemon, removePokemon, addTcgCard, removeTcgCard, toggleComparePokemon, handleLogout }}>
      {children}
    </AppStateContext.Provider>
  );
}

export const useAppState = () => {
  const value = useContext(AppStateContext);
  if (!value) throw new Error("useAppState must be used within AppStateProvider");
  return value;
};