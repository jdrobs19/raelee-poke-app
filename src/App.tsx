import { useEffect, useState } from "react";
import "./App.css";
import { Register } from "./auth/Register";
import { Login } from "./auth/Login";
import { UnregisteredPokemon } from "./pokemon/UnregisteredPokemon";
import { Pokemon, PokemonTyping, Ability } from "./types/types";
import { getAuth, signOut } from "firebase/auth";
import { Routes, Route, Link, BrowserRouter as Router } from "react-router-dom";
import pokeball from "./img/pokeball-png-45334.png";

function App() {
  const auth = getAuth();
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<string>("");
  const [unregisteredPokemon, setUnregisteredPokemon] = useState<Pokemon[]>([]);

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

            return { ...pokemon, types, abilities, img };
          }),
        );
        setUnregisteredPokemon(getIndividualPokemon);
      } catch (err) {
        console.error("Error fetching from PokeAPI: ", err);
      }
    };
    getAllPokemonData();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsLoggedIn(false);
      setUser("");
    } catch (error) {
      console.error(error)
    }
  };

  const HomeScreen = () => (
    <div>
      <UnregisteredPokemon allPokemon={unregisteredPokemon} />
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

  return (
    <div className="App">
      <Router>
        <div className="nav-container">
          <img src={pokeball} alt="pokeball" />
          <h1 className="logo-text">Raelee's Pokedex</h1>
          <nav>
            <ul>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li onClick={handleLogout}>
                <Link to="/logout">Logout</Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
              </li>
              <div>
                <li>
                  <Link to="/collection">Collection</Link>
                </li>
                <li>
                  <Link to="/">Home</Link>
                </li>
              </div>
            </ul>
          </nav>
        </div>
        <Routes>
          <Route path="/login" element={LoginScreen} />
          <Route path="/register" element={RegisterScreen} />
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
