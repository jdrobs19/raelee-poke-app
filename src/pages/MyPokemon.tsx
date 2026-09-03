import { useState } from "react";
import { MainPage } from "../snippets/MainPage";
import { Register } from "../auth/Register";
import { Login } from "../auth/Login";
import { MyPokemonPageProps } from "../types/types";
import { PokemonDetailsCard } from "../components/PokemonDetailsCard";

export function MyPokemon({
  auth,
  isLoggedIn,
  isRegistered,
  setIsLoggedIn,
  setUser,
  usersPokemon,
  removePokemon,
}: MyPokemonPageProps) {
  const [showRegister, setShowRegister] = useState(false);
  const sortedUsersPokemon = [...usersPokemon].sort((a, b) => a.id - b.id);

  if (!isLoggedIn) {
    return (
      <div className="my-pokemon">
        {showRegister ? (
          <>
            <Register
              auth={auth}
              isRegistered={isRegistered}
              isLoggedIn={setIsLoggedIn}
              setUser={setUser}
            />
            <button type="button" onClick={() => setShowRegister(false)}>
              Back to login
            </button>
          </>
        ) : (
          <>
            <Login
              auth={auth}
              isRegistered={isRegistered}
              isLoggedIn={setIsLoggedIn}
              setUser={setUser}
            />
            <button type="button" onClick={() => setShowRegister(true)}>
              Need an account? Register
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="my-pokemon">
      <PokemonDetailsCard
        pokemon={sortedUsersPokemon}
        removePokemon={removePokemon}
      />
    </div>
  );
}

export default MainPage(MyPokemon);
