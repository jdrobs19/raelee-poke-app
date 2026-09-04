import { useEffect, useState } from "react";
import { MainPage } from "../snippets/MainPage";
import { Register } from "../auth/Register";
import { Login } from "../auth/Login";
import { MyPokemonPageProps } from "../types/types";
import { PokemonDetailsCard } from "../components/PokemonDetailsCard";
import { PAGE_SIZE_OPTIONS } from "../utils/Constants";
import "../css/pages/Search.css";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const sortedUsersPokemon = [...usersPokemon].sort((a, b) => a.id - b.id);
  const filteredPokemon = sortedUsersPokemon.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchTerm.trim().toLowerCase()),
  );
  const totalPages = Math.max(1, Math.ceil(filteredPokemon.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const visiblePokemon = filteredPokemon.slice(
    (safeCurrentPage - 1) * pageSize,
    safeCurrentPage * pageSize,
  );

  useEffect(() => {
    const debounceTimer = window.setTimeout(() => {
      setSearchTerm(searchInput);
    }, 300);

    return () => window.clearTimeout(debounceTimer);
  }, [searchInput]);

  useEffect(() => {
    setCurrentPage(1);
  }, [usersPokemon.length, pageSize, searchTerm]);

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

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
      <div className="search-controls my-pokemon-controls">
        <input
          type="text"
          className="search-bar"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="Search My Pokémon"
        />
        <div className="pagination" aria-label="My Pokemon pages">
          <label>
            Pokémon per page:
            <select
              value={pageSize}
              onChange={(event) => setPageSize(Number(event.target.value))}
            >
              {PAGE_SIZE_OPTIONS.map((option) => (
                <option value={option} key={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            disabled={safeCurrentPage === 1}
          >
            Previous
          </button>
          <span>
            Page {safeCurrentPage} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() =>
              setCurrentPage((page) => Math.min(totalPages, page + 1))
            }
            disabled={safeCurrentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
      <PokemonDetailsCard
        pokemon={visiblePokemon}
        removePokemon={removePokemon}
      />
    </div>
  );
}

export default MainPage(MyPokemon);
