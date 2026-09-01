import { MainPage } from "../snippets/MainPage";
import { useEffect, useState } from "react";
import {
  PokemonApiData,
  IndividualApiPokemon,
  PokemonTypes,
} from "../types/types";
import { images, defaultImages } from "../PokemonImages";
import { pokemonTypes } from "../PokemonTypes";

export function Search() {
  const [pokemonData, setPokemonData] = useState<PokemonApiData[]>([]);
  const [individualPokemon, setIndividualPokemon] = useState<
    IndividualApiPokemon[]
  >([]);

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

  const getIndividualPokemonData = async () => {
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
                  strongAgainst: typeInfo.strength,
                  weakAgainst: typeInfo.vulnerable,
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
  };

  useEffect(() => {
    getAllPokemonData();
  }, []);

  useEffect(() => {
    if (pokemonData.length > 0) {
      getIndividualPokemonData();
    }
  }, [pokemonData]);

  return <div className="search"></div>;
}

export default MainPage(Search);
