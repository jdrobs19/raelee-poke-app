import { error } from 'console';
import { useEffect, useState } from 'react'
import './App.css';
import { UnregisteredPokemon } from './pokemon/UnregisteredPokemon';
import { Pokemon, PokemonTyping, Ability } from './types/types';

function App() {

  const [unregisteredPokemon, setUnregisteredPokemon] = useState<Pokemon[]>([])

  useEffect(() => {
    const getAllPokemonData = async () => {
      const apiUrl: string = "https://pokeapi.co/api/v2/"
      const limit: number = 25;
      const offset: number = 0;
      const url: string = `${apiUrl}/pokemon?limit=${limit}&offset=${offset}`

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("No reponse received")
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
              throw new Error(`Could not fetch ${pokemon.name}`)
            }

            const pokemonData = await response.json();
            const types = pokemonData.types.map(({ type }: PokemonTyping) => type.name)
            const abilities = pokemonData.abilities.map(({ ability }: Ability) => ability.name)
            const {sprites} = pokemonData;
            const img = sprites.front_shiny;

            return {...pokemon, types, abilities, img}
          }
        )
      )
      setUnregisteredPokemon(getIndividualPokemon);
    } catch (err) {
        console.error("Error fetching from PokeAPI: ", err);
      }
    }
    getAllPokemonData();

  }, [])

  return (
    <div className="App">
      <UnregisteredPokemon allPokemon={unregisteredPokemon} />
    </div>
  );
}

export default App;
