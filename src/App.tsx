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
import { collection, query, where, getDocs, addDoc, deleteDoc } from "firebase/firestore";

import { NavBar } from "./snippets/NavBar";
import { Footer } from "./snippets/Footer";

import { ToastContainer } from "react-toastify";
import {
  addPokemonFailureNotification,
  compareQueueNotification,
  logoutErrorNotification,
  logoutSuccessNotification,
  pokemonAddNotification,
  pokemonAlreadyExistsNotification,
  pokemonRemoveNotification,
} from "./notifications";
import { Search } from "./pages/Search";
import { MyPokemon } from "./pages/MyPokemon";
import { Pokemon } from "./pages/Pokemon";
import { Compare } from "./pages/Compare";
import { TcgCards } from "./pages/TcgCards";
import { IndividualApiPokemon, UsersPokemon } from "./types/types";

// import { NavBar } from "./navBar";
// import { UnregisteredPokemon } from "./pokemon/UnregisteredPokemon";
//import { Pokemon, PokemonTyping, Ability } from "./types/types";
//import { RegisteredPokemon } from "./pokemon/RegisteredPokemon";

function App() {
  // const auth = getAuth();
  // const [isRegistered, setIsRegistered] = useState<boolean>(false);
  // const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  // const [user, setUser] = useState<string>("");
  // const [authLoading, setAuthLoading] = useState<boolean>(true);

  // const [unregisteredPokemon, setUnregisteredPokemon] = useState<Pokemon[]>([]);
  // const [usersPokemon, setUsersPokemon] = useState<Pokemon[]>([]);

  // useEffect(() => {
  //   return onAuthStateChanged(auth, (firebaseUser) => {
  //     const userId = firebaseUser?.uid ?? "";
  //     const loggedIn = Boolean(firebaseUser);

  //     setUser(userId);
  //     setIsLoggedIn(loggedIn);
  //     setIsRegistered(loggedIn);
  //     setAuthLoading(false);
  //   });
  // }, [auth]);

  // useEffect(() => {
  //   const getAllPokemonData = async () => {
  //     const apiUrl: string = "https://pokeapi.co/api/v2/";
  //     const limit: number = 2500;
  //     const url: string = `${apiUrl}pokemon?limit=${limit}`;

  //     try {
  //       const response = await fetch(url);
  //       if (!response.ok) {
  //         throw new Error("No response received");
  //       }

  //       const data = await response.json();
  //       console.log(data);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  //   console.log(getAllPokemonData)
  //   getAllPokemonData();
  // }, []);

  // useEffect(() => {
  //   const abortController = new AbortController();

  //     try {
  //       const response = await fetch(url, { signal: abortController.signal });
  //       if (!response.ok) {
  //         throw new Error("No reponse received");
  //       }

  //       const data = await response.json();
  //       const list: {
  //         id: number;
  //         name: string;
  //         url: string;
  //         types: string[];
  //       }[] = data.results;

  //       const getIndividualPokemon = await Promise.all(
  //         list.map(async (pokemon) => {
  //           const response = await fetch(pokemon.url, {
  //             signal: abortController.signal,
  //           });
  //           if (!response.ok) {
  //             throw new Error(`Could not fetch ${pokemon.name}`);
  //           }

  //           const pokemonData = await response.json();
  //           const id = pokemonData.id;
  //           const types = pokemonData.types.map(
  //             ({ type }: PokemonTyping) => type.name,
  //           );
  //           const abilities = pokemonData.abilities.map(
  //             ({ ability }: Ability) => ability.name,
  //           );
  //           const { sprites } = pokemonData;
  //           const img = sprites.front_shiny;

  //           return { ...pokemon, id, types, abilities, img, user: "" };
  //         }),
  //       );
  //       if (!abortController.signal.aborted) {
  //         setUnregisteredPokemon(getIndividualPokemon);
  //       }
  //     } catch (err) {
  //       if (!abortController.signal.aborted) {
  //         console.error("Error fetching from PokeAPI: ", err);
  //       }
  //     }
  //   };
  //   getAllPokemonData();

  //   return () => abortController.abort();
  // }, []);

  // useEffect(() => {
  //   if (!user) {
  //     setUsersPokemon([]);
  //     return;
  //   }

  //   const getUsersPokemon = async () => {
  //     try {
  //       const userPokemonQuery = query(
  //         collection(db, "pokemon"),
  //         where("user", "==", user),
  //       );
  //       const querySnapshot = await getDocs(userPokemonQuery);
  //       const userPokemonData: Pokemon[] = [];
  //       querySnapshot.forEach((doc) => {
  //         userPokemonData.push(doc.data() as Pokemon);
  //       });
  //       setUsersPokemon(userPokemonData);
  //     } catch (err) {
  //       console.error("Error fetching user's pokemon: ", err);
  //     }
  //   };
  //   getUsersPokemon();
  // }, [user]);

  // const addPokemon = (pokemon: Pokemon): void => {
  //   const pokemonForUser = { ...pokemon, user };
  //   setUsersPokemon((currentPokemon) => [...currentPokemon, pokemonForUser]);
  // };

  // const removePokemon = (pokemonName: string): void => {
  //   const updatedPokemon = usersPokemon.filter(({ name }) => name !== pokemonName);
  //   setUsersPokemon(updatedPokemon);
  // };

  // const handleLogout = async () => {
  //   try {
  //     await signOut(auth);
  //     logoutSuccessNotification();
  //   } catch (error) {
  //     logoutErrorNotification(error as Error);
  //   }
  // };

  // const LoginScreen = (
  //   <Login
  //     auth={auth}
  //     isRegistered={setIsRegistered}
  //     isLoggedIn={setIsLoggedIn}
  //     setUser={setUser}
  //   />
  // );

  // const RegisterScreen = (
  //   <Register
  //     auth={auth}
  //     isRegistered={setIsRegistered}
  //     isLoggedIn={setIsLoggedIn}
  //     setUser={setUser}
  //   />
  // );

  // const CollectionScreen = (
  //   <RegisteredPokemon
  //     user={user}
  //     allPokemon={usersPokemon}
  //     removePokemon={removePokemon}
  //   />
  // );

  // if (authLoading) {
  //   return <div className="App">Loading...</div>;
  // }

  const [comparePokemon, setComparePokemon] = useState<IndividualApiPokemon[]>(
    [],
  );
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<string>("");
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [usersPokemon, setUsersPokemon] = useState<UsersPokemon[]>([]);

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

  if(alreadyExists){
    pokemonAlreadyExistsNotification(pokemon.name)
    return
  }

  const pokemonForUser = { ...pokemon, user };

  try {
    await addDoc(collection(db, "pokemon"), pokemonForUser);
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
        const userPokemonData: UsersPokemon[] = [];

        querySnapshot.forEach((doc) => {
          userPokemonData.push(doc.data() as UsersPokemon);
        });

        setUsersPokemon(userPokemonData);
      } catch (err) {
        console.error("Error fetching user's pokemon: ", err);
      }
    };

    void getUsersPokemon();
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
      <ToastContainer />
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
                />
              }
            />
            <Route
              path="/list"
              element={
                <MyPokemon
                  auth={auth}
                  user={user}
                  isLoggedIn={isLoggedIn}
                  setIsLoggedIn={setIsLoggedIn}
                  isRegistered={setIsRegistered}
                  setUser={setUser}
                  usersPokemon={usersPokemon}
                  removePokemon={removePokemon}
                />
              }
            />
            <Route path="/pokemon/:id" element={<Pokemon />} />
            <Route
              path="/compare"
              element={
                <Compare
                  compareQueue={comparePokemon}
                  onToggleCompare={toggleComparePokemon}
                  addPokemon={addPokemon}
                />
              }
            />
            <Route path="/tcgcards" element={<TcgCards />} />
            <Route path="*" element={<Navigate to="pokemon/1" replace />} />
          </Routes>
          <Footer handleLogout={handleLogout} />
        </Router>
      </div>
    </div>

    // <div className="App">
    //   <ToastContainer/>
    //   <Router>
    //       <NavBar handleLogout={handleLogout} isLoggedIn={isLoggedIn} />
    //     <Routes>
    //       <Route path="/login" element={LoginScreen} />
    //       <Route path="/register" element={RegisterScreen} />
    //       <Route
    //         path="/collection"
    //         element={isLoggedIn ? CollectionScreen : <Navigate to="/login" replace />}
    //       />
    //       <Route
    //         path="/"
    //         element={
    //           isRegistered ? (
    //             isLoggedIn ? (
    //               <UnregisteredPokemon
    //                 allPokemon={unregisteredPokemon}
    //                 user={user}
    //                 addPokemon={addPokemon}
    //                 registeredPokemonIds={usersPokemon.map(({ id }) => id)}
    //               />
    //             ) : (
    //               LoginScreen
    //             )
    //           ) : (
    //             RegisterScreen
    //           )
    //         }
    //       />
    //     </Routes>
    //   </Router>
    // </div>
  );
}

export default App;
