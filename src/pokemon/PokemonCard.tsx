import { PokemonCardProps } from "../types/types";
import "./PokemonCard.css";
import { collection, addDoc, query, where, getDocs, deleteDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Pokemon } from "../types/types";
import { db } from "../firebase/firebaseConfig";
import { pokemonAddNotification, pokemonRemoveNotification } from "../notifications";

export function PokemonCard({
  pokemon,
  page,
  onRemove,
  onAdd,
  isRegistered = false,
}: PokemonCardProps) {
  const addButtonText = isRegistered ? "Registered" : "Add";
  const isRegisteredPage: boolean = page === "registered";
  const isUnregisteredPage: boolean = page === "unregistered";

  const handleAddPokemon = (pokemon: Pokemon): void => {
    const pokemonForUser = {
      ...pokemon,
      user: getAuth().currentUser?.uid ?? "",
    };

    addDoc(collection(db, "pokemon"), pokemonForUser)
      .then(() => {
        onAdd?.(pokemonForUser);
        pokemonAddNotification(pokemon.name);
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
  };

  const handleRemovePokemon = async(pokemonName: string): Promise<void> => {
    try {
      const q = query(
        collection(db, "pokemon"),
        where("name", "==", pokemonName),
        where("user", "==", getAuth().currentUser?.uid)
      );
      const querySnapshot = await getDocs(q);
      if(querySnapshot.docs.length === 0) {
        console.error("No document found to remove for pokemon: ", pokemonName);
        return;
      }
      const doc = querySnapshot.docs[0];
      
      await deleteDoc(doc.ref);

      onRemove?.(pokemonName);
      pokemonRemoveNotification(pokemonName);

    }catch (error) {
      console.error("Error removing document: ", error);
    }
  };

  return (
    <div className="pokemon-card">
      <div className="pokemon-details">
        <img src={pokemon.img} alt={pokemon.name} className="pokemon-image" />
        <h3>{pokemon.name}</h3>
        <p>
          <span>Types: </span>
          {pokemon.types.join(", ")}
        </p>
        <p>
          <span>Abilities: </span>
          {pokemon.abilities.join(", ")}
        </p>
        {isUnregisteredPage && (
          <button
            className="add-button"
            onClick={() => handleAddPokemon(pokemon)}
            disabled={isRegistered}
          >
            {addButtonText}
          </button>
        )}
        {isRegisteredPage && (
          <button
            className="remove-button"
            onClick={() => handleRemovePokemon(pokemon.name)}
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
}
