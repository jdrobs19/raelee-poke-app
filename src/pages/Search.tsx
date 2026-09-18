import { MainPage } from "../snippets/MainPage";
import { useEffect, useRef, useState } from "react";
import {
  PokemonApiData,
  IndividualApiPokemon,
  PokemonTypes,
  SearchProps,
} from "../types/types";
import { images, defaultImages } from "../utils/PokemonImages";
import { pokemonTypes } from "../utils/PokemonTypes";
import { PokemonDetailsCard } from "../components/PokemonDetailsCard";
import { Loading } from "../components/Loading";
import "../css/pages/Search.css";
import { PAGE_SIZE_OPTIONS } from "../utils/Constants";

export function Search({
  compareQueue = [],
  onToggleCompare,
  addPokemon,
  removePokemon,
  usersPokemon,
}: SearchProps) {
  const [pokemonData, setPokemonData] = useState<PokemonApiData[]>([]);
  const [individualPokemon, setIndividualPokemon] = useState<
    IndividualApiPokemon[]
  >([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const pokemonDetailsCache = useRef(
    new Map<string, IndividualApiPokemon>(),
  );

  const sortedPokemon = [...pokemonData].sort(
    (a, b) => Number(a.url.split("/").at(-2)) - Number(b.url.split("/").at(-2)),
  );
  const filteredPokemon = sortedPokemon.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchTerm.trim().toLowerCase()),
  );
  const totalPages = Math.max(1, Math.ceil(filteredPokemon.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const firstPokemonIndex = (safeCurrentPage - 1) * pageSize;

  useEffect(() => {
    const debounceTimer = window.setTimeout(() => {
      setSearchTerm(searchInput);
    }, 300);

    return () => window.clearTimeout(debounceTimer);
  }, [searchInput]);

  useEffect(() => {
    setCurrentPage(1);
  }, [pokemonData.length, pageSize, searchTerm]);

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  // Fetch the lightweight name index once; details are loaded only for visible cards.
  useEffect(() => {
    const getPokemonIndex = async () => {
      try {
        const response = await fetch(
          "https://pokeapi.co/api/v2/pokemon?limit=2500",
        );
        if (!response.ok) {
          throw new Error("No response received");
        }

        const data = await response.json();
        setPokemonData(data.results);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };

    void getPokemonIndex();
  }, []);

  useEffect(() => {
    if (pokemonData.length === 0) {
      return;
    }

    const filteredEntries = pokemonData
      .slice()
      .sort(
        (a, b) =>
          Number(a.url.split("/").at(-2)) - Number(b.url.split("/").at(-2)),
      )
      .filter((pokemon) =>
        pokemon.name.toLowerCase().includes(searchTerm.trim().toLowerCase()),
      );
    const visibleEntries = filteredEntries.slice(
      firstPokemonIndex,
      firstPokemonIndex + pageSize,
    );
    const controller = new AbortController();
    const entriesToFetch = visibleEntries.filter(
      (pokemon) => !pokemonDetailsCache.current.has(pokemon.url),
    );

    setIsLoading(entriesToFetch.length > 0);

    const getVisiblePokemonDetails = async () => {
      try {
        await Promise.all(
          entriesToFetch.map(async (pokemon) => {
            const response = await fetch(pokemon.url, {
              signal: controller.signal,
            });
            if (!response.ok) {
              throw new Error(`Failed to fetch Pokémon: ${pokemon.name}`);
            }

            const pokemonDetail = await response.json();
            const individualPokemon: IndividualApiPokemon = {
              id: pokemonDetail.id,
              name: pokemonDetail.name,
              images:
                images[pokemonDetail.id] || defaultImages[pokemonDetail.id] || "",
              types: pokemonDetail.types.map((typeObj: any) => {
                const typeName = typeObj.type.name;
                const typeData: PokemonTypes = {};
                const typeInfo =
                  pokemonTypes[typeName as keyof typeof pokemonTypes];

                if (typeInfo) {
                  typeData[typeName] = {
                    image: typeInfo.image,
                    resistance: typeInfo.resistance,
                    weakness: typeInfo.weakness,
                    strength: typeInfo.strength,
                    vulnerable: typeInfo.vulnerable,
                  };
                }

                return typeData;
              }),
            };

            pokemonDetailsCache.current.set(pokemon.url, individualPokemon);
          }),
        );

        if (!controller.signal.aborted) {
          setIndividualPokemon(
            visibleEntries
              .map((pokemon) => pokemonDetailsCache.current.get(pokemon.url))
              .filter(
                (pokemon): pokemon is IndividualApiPokemon => Boolean(pokemon),
              ),
          );
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("Error fetching Pokémon data:", error);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void getVisiblePokemonDetails();
    return () => controller.abort();
  }, [pokemonData, searchTerm, currentPage, pageSize, firstPokemonIndex]);

  return (
    <div className="search">
      <div className="search-controls">
        <input
          type="text"
          className="search-bar"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="Search Pokémon"
        />
        <div className="pagination" aria-label="Registered Pokemon pages">
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
      {isLoading ? (
        <Loading />
      ) : (
        <PokemonDetailsCard
          pokemon={individualPokemon}
          compareQueue={compareQueue}
          onToggleCompare={onToggleCompare}
          addPokemon={addPokemon}
          removePokemon={removePokemon}
          usersPokemon={usersPokemon}
        />
      )}
    </div>
  );
}

export default MainPage(Search);
