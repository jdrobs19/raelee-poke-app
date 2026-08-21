import { useEffect, useState } from "react";
import "./App.css";
import { Register } from "./auth/Register";
import { Login } from "./auth/Login";
import { UnregisteredPokemon } from "./pokemon/UnregisteredPokemon";
import { Pokemon, PokemonTyping, Ability } from "./types/types";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { Routes, Route, BrowserRouter as Router, Navigate } from "react-router-dom";
import { RegisteredPokemon } from "./pokemon/RegisteredPokemon";
import { db } from "./firebase/firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { NavBar } from "./navBar";
import { ToastContainer } from "react-toastify";
import { logoutErrorNotification, logoutSuccessNotification } from "./notifications";

function App() {
  const auth = getAuth();
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<string>("");
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [unregisteredPokemon, setUnregisteredPokemon] = useState<Pokemon[]>([]);
  const [usersPokemon, setUsersPokemon] = useState<Pokemon[]>([]);

  useEffect(() => {
    return onAuthStateChanged(auth, (firebaseUser) => {
      const userId = firebaseUser?.uid ?? "";
      const loggedIn = Boolean(firebaseUser);

      setUser(userId);
      setIsLoggedIn(loggedIn);
      setIsRegistered(loggedIn);
      setAuthLoading(false);
    });
  }, [auth]);

  useEffect(() => {
    const abortController = new AbortController();

    const getAllPokemonData = async () => {
      const apiUrl: string = "https://pokeapi.co/api/v2/";
      const limit: number = 10000;
      const offset: number = 0;
      const url: string = `${apiUrl}pokemon?limit=${limit}&offset=${offset}`;

      try {
        const response = await fetch(url, { signal: abortController.signal });
        if (!response.ok) {
          throw new Error("No reponse received");
        }

        const data = await response.json();
        const list: {
          id: number;
          name: string;
          url: string;
          types: string[];
        }[] = data.results;

        const getIndividualPokemon = await Promise.all(
          list.map(async (pokemon) => {
            const response = await fetch(pokemon.url, {
              signal: abortController.signal,
            });
            if (!response.ok) {
              throw new Error(`Could not fetch ${pokemon.name}`);
            }

            const pokemonData = await response.json();
            const id = pokemonData.id;
            const types = pokemonData.types.map(
              ({ type }: PokemonTyping) => type.name,
            );
            const abilities = pokemonData.abilities.map(
              ({ ability }: Ability) => ability.name,
            );
            const { sprites } = pokemonData;
            const img = sprites.front_shiny;

            return { ...pokemon, id, types, abilities, img, user: "" };
          }),
        );
        if (!abortController.signal.aborted) {
          setUnregisteredPokemon(getIndividualPokemon);
        }
      } catch (err) {
        if (!abortController.signal.aborted) {
          console.error("Error fetching from PokeAPI: ", err);
        }
      }
    };
    getAllPokemonData();

    return () => abortController.abort();
  }, []);

  useEffect(() => {
    if (!user) {
      setUsersPokemon([]);
      return;
    }

    const getUsersPokemon = async () => {
      try {
        const userPokemonQuery = query(
          collection(db, "pokemon"),
          where("user", "==", user),
        );
        const querySnapshot = await getDocs(userPokemonQuery);
        const userPokemonData: Pokemon[] = [];
        querySnapshot.forEach((doc) => {
          userPokemonData.push(doc.data() as Pokemon);
        });
        setUsersPokemon(userPokemonData);
      } catch (err) {
        console.error("Error fetching user's pokemon: ", err);
      }
    };
    getUsersPokemon();
  }, [user]);

  const addPokemon = (pokemon: Pokemon) : void => {
    const pokemonForUser = { ...pokemon, user };
    const updatedPokemon = [...usersPokemon, pokemonForUser];
    setUsersPokemon(updatedPokemon);
  };

  const removePokemon = (pokemonName: string): void => {
    const updatedPokemon = usersPokemon.filter(({ name }) => name !== pokemonName);
    setUsersPokemon(updatedPokemon);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      logoutSuccessNotification();
    } catch (error) {
      logoutErrorNotification(error as Error);
    }
  };

  const HomeScreen = () => (
    <div>
      <UnregisteredPokemon
        allPokemon={unregisteredPokemon}
        user={user}
        addPokemon={addPokemon}
        registeredPokemonIds={usersPokemon.map(({ id }) => id)}
      />
    </div>
  );

  const LoginScreen = (
    <Login
      auth={auth}
      isRegistered={setIsRegistered}
      isLoggedIn={setIsLoggedIn}
      setUser={setUser}
    />
  );

  const RegisterScreen = (
    <Register
      auth={auth}
      isRegistered={setIsRegistered}
      isLoggedIn={setIsLoggedIn}
      setUser={setUser}
    />
  );

  const CollectionScreen = (
    <RegisteredPokemon
      user={user}
      allPokemon={usersPokemon}
      removePokemon={removePokemon}
    />
  );

  if (authLoading) {
    return <div className="App">Loading...</div>;
  }

  return (
    <div className="App">
      <ToastContainer/>
      <Router>
          <NavBar handleLogout={handleLogout} isLoggedIn={isLoggedIn} />
        <Routes>
          <Route path="/login" element={LoginScreen} />
          <Route path="/register" element={RegisterScreen} />
          <Route
            path="/collection"
            element={isLoggedIn ? CollectionScreen : <Navigate to="/login" replace />}
          />
          <Route
            path="/"
            element={
              isRegistered ? (
                isLoggedIn ? (
                  <HomeScreen />
                ) : (
                  LoginScreen
                )
              ) : (
                RegisterScreen
              )
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
