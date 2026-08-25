import { useEffect, useState } from "react";
import { PokemonProps } from "../types/types";
import { PokemonCard } from "./PokemonCard";
import "./unregisteredPokemon.css";

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export function UnregisteredPokemon({
  allPokemon,
  removePokemon,
  addPokemon,
  registeredPokemonIds = [],
}: PokemonProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const filteredPokemon = allPokemon.filter(
    (pokemon) =>
      !registeredPokemonIds.includes(pokemon.id) &&
      pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const totalPages = Math.max(1, Math.ceil(filteredPokemon.length / pageSize));
  const firstPokemonIndex = (currentPage - 1) * pageSize;
  const visiblePokemon = filteredPokemon.slice(
    firstPokemonIndex,
    firstPokemonIndex + pageSize,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [allPokemon.length, registeredPokemonIds.length, pageSize, searchTerm]);

  return (
    <div className="unregistered-container">
      <h1>Available Pokemon</h1>
      <div className="search-container">
        <label htmlFor="unregistered-pokemon-search">Search by name</label>
        <input
          id="unregistered-pokemon-search"
          type="search"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search Pokemon"
        />
      </div>
      <div className="pokemon-container">
        {visiblePokemon.map((pokemon) => {
          return (
            <PokemonCard
              pokemon={pokemon}
              key={pokemon.id}
              page="unregistered"
              onAdd={addPokemon}
              onRemove={removePokemon}
            />
          );
        })}
      </div>
      {filteredPokemon.length === 0 && (
        <p className="no-results">No Pokemon found.</p>
      )}
      <div className="pagination" aria-label="Unregistered Pokemon pages">
        <label>
          Pokemon per page:
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
          onClick={() => setCurrentPage((page) => page - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          type="button"
          onClick={() => setCurrentPage((page) => page + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
