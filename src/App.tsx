import './App.css';
import { UnregisteredPokemon } from './pokemon/UnregisteredPokemon';

const allPokemon = [
  {
    id: 132,
    name: "Ditto",
    types: [
      "Normal"
    ],
    abilities: ["Copy"],
    img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/132.png",
    user: "test"
  }
]

function App() {
  return (
    <div className="App">
      <UnregisteredPokemon allPokemon={allPokemon}/>
    </div>
  );
}

export default App;
