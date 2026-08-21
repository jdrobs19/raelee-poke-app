import { useEffect, useState } from "react";
import "./App.css";
import { Register } from "./auth/Register";
import { Login } from "./auth/Login";
import { UnregisteredPokemon } from "./pokemon/UnregisteredPokemon";
import { Pokemon, PokemonTyping, Ability } from "./types/types";
import { getAuth, signOut } from "firebase/auth";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import { RegisteredPokemon } from "./pokemon/RegisteredPokemon";
import { db } from "./firebase/firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { NavBar } from "./navBar";

function App() {
  const auth = getAuth();
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<string>("");
  const [unregisteredPokemon, setUnregisteredPokemon] = useState<Pokemon[]>([]);
  const [usersPokemon, setUsersPokemon] = useState<Pokemon[]>([]);

  useEffect(() => {
    const getAllPokemonData = async () => {
      const apiUrl: string = "https://pokeapi.co/api/v2/";
      const limit: number = 25;
      const offset: number = 0;
      const url: string = `${apiUrl}pokemon?limit=${limit}&offset=${offset}`;

      try {
        const response = await fetch(url);
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
            const response = await fetch(pokemon.url);
            if (!response.ok) {
              throw new Error(`Could not fetch ${pokemon.name}`);
            }

            const pokemonData = await response.json();
            const types = pokemonData.types.map(
              ({ type }: PokemonTyping) => type.name,
            );
            const abilities = pokemonData.abilities.map(
              ({ ability }: Ability) => ability.name,
            );
            const { sprites } = pokemonData;
            const img = sprites.front_shiny;

            return { ...pokemon, types, abilities, img, user };
          }),
        );
        setUnregisteredPokemon(getIndividualPokemon);
      } catch (err) {
        console.error("Error fetching from PokeAPI: ", err);
      }
    };
    getAllPokemonData();
  }, [user]);

  useEffect(() => {
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
  }, [user, db]);

  const addPokemon = (pokemon: Pokemon) : void => {
    const updatedPokemon = [...usersPokemon, pokemon];
    setUsersPokemon(updatedPokemon);
  };

  const removePokemon = (pokemonName: string): void => {
    const updatedPokemon = usersPokemon.filter(({ name }) => name !== pokemonName);
    setUsersPokemon(updatedPokemon);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsLoggedIn(false);
      setUser("");
    } catch (error) {
      console.error(error);
    }
  };

  const HomeScreen = () => (
    <div>
      <UnregisteredPokemon
        allPokemon={unregisteredPokemon}
        user={user}
        addPokemon={addPokemon}
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

  return (
    <div className="App">
      <Router>
          <NavBar handleLogout={handleLogout} isLoggedIn={isLoggedIn} />
        <Routes>
          <Route path="/login" element={LoginScreen} />
          <Route path="/register" element={RegisterScreen} />
          <Route path="/collection" element={CollectionScreen} />
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
