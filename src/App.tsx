import { useEffect, useState } from "react";
import "./css/app/App.css";
import {
  Routes,
  Route,
  BrowserRouter as Router,
  Navigate,
} from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "./firebase/firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import { NavBar } from "./snippets/NavBar";
import { Footer } from "./snippets/Footer";
import { ToastContainer } from "react-toastify";
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
} from "./utils/notifications";
import { Search } from "./pages/Search";
import { MyPokemon } from "./pages/MyPokemon";
import { Pokemon } from "./pages/Pokemon";
import { Compare } from "./pages/Compare";
import { MyTcgCards } from "./pages/MyTcgCards";
import {
  IndividualApiPokemon,
  TcgApiData,
  UsersPokemon,
  UsersTcgCard,
} from "./types/types";
import { PokemonTab, pokemonTabs } from "./utils/Constants";
import { hydratePokemon, serializePokemon } from "./utils/PokemonStorage";

function App() {
  const [comparePokemon, setComparePokemon] = useState<IndividualApiPokemon[]>(
    [],
  );
  const [, setIsRegistered] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<string>("");
  const [usersPokemon, setUsersPokemon] = useState<UsersPokemon[]>([]);
  const [usersTcgCards, setUsersTcgCards] = useState<UsersTcgCard[]>([]);
  const [currentPokemonTab, setCurrentPokemonTab] = useState<PokemonTab>(
    pokemonTabs.overview,
  );

  useEffect(() => {
    return onAuthStateChanged(auth, (firebaseUser) => {
      const userId = firebaseUser?.uid ?? "";
      const loggedIn = Boolean(firebaseUser);

      setUser(userId);
      setIsLoggedIn(loggedIn);
      setIsRegistered(loggedIn);
    });
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      logoutSuccessNotification();
    } catch (error) {
      logoutErrorNotification(error as Error);
    }
  };

  const addPokemon = async (pokemon: IndividualApiPokemon) => {
    if (!user) {
      addPokemonFailureNotification();
      return;
    }

    const alreadyExists = usersPokemon.some(
      (savedPokemon) => savedPokemon.id === pokemon.id,
    );

    if (alreadyExists) {
      pokemonAlreadyExistsNotification(pokemon.name);
      return;
    }

    const pokemonForUser = { ...pokemon, user };

    try {
      await addDoc(collection(db, "pokemon"), serializePokemon(pokemonForUser));
      setUsersPokemon((current) => [...current, pokemonForUser]);
      pokemonAddNotification(pokemon.name);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const removePokemon = async (pokemonId: number) => {
    if (!user) return;

    try {
      const q = query(
        collection(db, "pokemon"),
        where("user", "==", user),
        where("id", "==", pokemonId),
      );

      const snapshot = await getDocs(q);

      if (snapshot.empty) return;

      await deleteDoc(snapshot.docs[0].ref);

      setUsersPokemon((current) =>
        current.filter((pokemon) => pokemon.id !== pokemonId),
      );
      pokemonRemoveNotification("Pokemon removed");
    } catch (error) {
      console.error("Error removing document: ", error);
    }
  };

  const addTcgCard = async (card: TcgApiData) => {
    if (!user) {
      addTcgCardFailureNotification();
      return;
    }

    const alreadyExists = usersTcgCards.some(
      (savedCard) => savedCard.id === card.id,
    );

    if (alreadyExists) {
      tcgCardAlreadyExistsNotification(card.name);
      return;
    }

    const cardForUser = { ...card, user };

    try {
      await addDoc(collection(db, "tcgCards"), cardForUser);
      setUsersTcgCards((current) => [...current, cardForUser]);
      tcgCardAddNotification(card.name);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const removeTcgCard = async (cardId: string) => {
    if (!user) return;

    try {
      const q = query(
        collection(db, "tcgCards"),
        where("user", "==", user),
        where("id", "==", cardId),
      );

      const snapshot = await getDocs(q);

      if (snapshot.empty) return;

      await deleteDoc(snapshot.docs[0].ref);

      setUsersTcgCards((current) =>
        current.filter((card) => card.id !== cardId),
      );
      tcgCardRemoveNotification("Trading card removed");
    } catch (error) {
      console.error("Error removing document: ", error);
    }
  };

  useEffect(() => {
    if (!user) {
      setUsersPokemon([]);
      setUsersTcgCards([]);
      return;
    }

    const getUsersPokemon = async () => {
      try {
        const userPokemonQuery = query(
          collection(db, "pokemon"),
          where("user", "==", user),
        );
        const querySnapshot = await getDocs(userPokemonQuery);
        const userPokemonData: UsersPokemon[] = [];

        querySnapshot.forEach((doc) => {
          userPokemonData.push(hydratePokemon(doc.data() as any));
        });

        setUsersPokemon(userPokemonData);
      } catch (err) {
        console.error("Error fetching user's pokemon: ", err);
      }
    };

    const getUsersTcgCards = async () => {
      try {
        const userTcgCardsQuery = query(
          collection(db, "tcgCards"),
          where("user", "==", user),
        );
        const querySnapshot = await getDocs(userTcgCardsQuery);
        const userTcgCardsData: UsersTcgCard[] = [];

        querySnapshot.forEach((doc) => {
          userTcgCardsData.push(doc.data() as UsersTcgCard);
        });

        setUsersTcgCards(userTcgCardsData);
      } catch (err) {
        console.error("Error fetching user's trading cards: ", err);
      }
    };

    void getUsersPokemon();
    void getUsersTcgCards();
  }, [user]);

  const toggleComparePokemon = (pokemon: IndividualApiPokemon) => {
    const isAlreadyInCompare = comparePokemon.some((p) => p.id === pokemon.id);

    if (isAlreadyInCompare) {
      setComparePokemon((current) =>
        current.filter((p) => p.id !== pokemon.id),
      );
      compareQueueNotification(pokemon.name, "remove");
      return;
    }

    if (comparePokemon.length >= 2) {
      setComparePokemon((current) => [...current.slice(1), pokemon]);
      compareQueueNotification(pokemon.name, "add");
      return;
    }

    setComparePokemon((current) => [...current, pokemon]);
    compareQueueNotification(pokemon.name, "add");
  };

  return (
    <div className="app-container">
      <ToastContainer className="mobile-toast-container" />
      <div className="App">
        <Router>
          <NavBar />
          <Routes>
            <Route
              path="/search"
              element={
                <Search
                  compareQueue={comparePokemon}
                  onToggleCompare={toggleComparePokemon}
                  addPokemon={addPokemon}
                  removePokemon={removePokemon}
                  usersPokemon={usersPokemon}
                />
              }
            />
            <Route
              path="/list"
              element={
                <MyPokemon
                  auth={auth}
                  isLoggedIn={isLoggedIn}
                  setIsLoggedIn={setIsLoggedIn}
                  isRegistered={setIsRegistered}
                  setUser={setUser}
                  usersPokemon={usersPokemon}
                  removePokemon={removePokemon}
                />
              }
            />
            <Route
              path="/pokemon/:id"
              element={
                <Pokemon
                  currentPokemonTab={currentPokemonTab}
                  setCurrentPokemonTab={setCurrentPokemonTab}
                  compareQueue={comparePokemon}
                  onToggleCompare={toggleComparePokemon}
                  addPokemon={addPokemon}
                  removePokemon={removePokemon}
                  usersPokemon={usersPokemon}
                  addTcgCard={addTcgCard}
                  removeTcgCard={removeTcgCard}
                  usersTcgCards={usersTcgCards}
                />
              }
            />
            <Route
              path="/compare"
              element={
                <Compare
                  compareQueue={comparePokemon}
                  onToggleCompare={toggleComparePokemon}
                  addPokemon={addPokemon}
                  removePokemon={removePokemon}
                  usersPokemon={usersPokemon}
                />
              }
            />
            <Route
              path="/tcgcards"
              element={
                <MyTcgCards
                  auth={auth}
                  isLoggedIn={isLoggedIn}
                  setIsLoggedIn={setIsLoggedIn}
                  isRegistered={setIsRegistered}
                  setUser={setUser}
                  usersTcgCards={usersTcgCards}
                  removeTcgCard={removeTcgCard}
                />
              }
            />
            <Route path="*" element={<Navigate to="/pokemon/1" replace />} />
          </Routes>
          <Footer
            handleLogout={handleLogout}
            currentPokemonTab={currentPokemonTab}
            setCurrentPokemonTab={setCurrentPokemonTab}
          />
        </Router>
      </div>
    </div>
  );
}

export default App;
