import { MainPage } from "../snippets/MainPage";
import { useCallback, useEffect, useState } from "react";
import {
  PokemonApiData,
  IndividualApiPokemon,
  PokemonTypes,
} from "../types/types";
import { images, defaultImages } from "../utils/PokemonImages";
import { pokemonTypes } from "../utils/PokemonTypes";
import { PokemonDetailsCard } from "../components/PokemonDetailsCard";
import "../css/pages/Search.css";
import { PAGE_SIZE_OPTIONS } from "../utils/Constants";

export function Search({
  compareQueue = [],
  onToggleCompare,
}: {
  compareQueue?: IndividualApiPokemon[];
  onToggleCompare?: (pokemon: IndividualApiPokemon) => void;
}) {
  const [pokemonData, setPokemonData] = useState<PokemonApiData[]>([]);
  const [individualPokemon, setIndividualPokemon] = useState<
    IndividualApiPokemon[]
  >([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);
  const [searchTerm, setSearchTerm] = useState("");

  const sortedPokemon = [...individualPokemon].sort((a, b) => a.id - b.id);
  const filteredPokemon = sortedPokemon.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchTerm.trim().toLowerCase()),
  );
  const totalPages = Math.max(1, Math.ceil(filteredPokemon.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const firstPokemonIndex = (safeCurrentPage - 1) * pageSize;
  const visiblePokemon = filteredPokemon.slice(
    firstPokemonIndex,
    firstPokemonIndex + pageSize,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [individualPokemon.length, pageSize, searchTerm]);

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  //Fetch all Pokemon data
  const getAllPokemonData = async () => {
    const apiUrl: string = "https://pokeapi.co/api/v2/";
    const limit: number = 2500;
    const url: string = `${apiUrl}pokemon?limit=${limit}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("No response received");
      }

      const data = await response.json();
      setPokemonData(data.results);
    } catch (error) {
      console.error(error);
    }
  };

  const getIndividualPokemonData = useCallback(async () => {
    if (pokemonData.length === 0) {
      console.log("Pokémon data not loaded yet");
      return [];
    }

    const allPokemonDetails: IndividualApiPokemon[] = [];

    try {
      // Fetch all Pokémon data
      for (const pokemon of pokemonData) {
        try {
          const response = await fetch(pokemon.url);
          if (!response.ok) {
            throw new Error(`Failed to fetch Pokémon: ${pokemon.name}`);
          }
          const pokemonDetail = await response.json();

          //Map the data to the IndividualApiPokemon interface
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

          allPokemonDetails.push(individualPokemon);
        } catch (error) {
          console.error(`Error fetching Pokémon: ${pokemon.name}`, error);
        }
      }

      // Sort by ID
      allPokemonDetails.sort((a, b) => a.id - b.id);

      // Update state
      setIndividualPokemon(allPokemonDetails);
    } catch (error) {
      console.error("Error fetching Pokémon data:", error);
    }
  }, [pokemonData]);

  useEffect(() => {
    getAllPokemonData();
  }, []);

  useEffect(() => {
    if (pokemonData.length > 0) {
      void getIndividualPokemonData();
    }
  }, [pokemonData.length, getIndividualPokemonData]);

  return (
    <>
      <div className="search">
        <div className="search-controls">
          <input
            type="text"
            className="search-bar"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
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
        <PokemonDetailsCard
          pokemon={visiblePokemon}
          compareQueue={compareQueue}
          onToggleCompare={onToggleCompare}
        />
      </div>
    </>
  );
}

export default MainPage(Search);
