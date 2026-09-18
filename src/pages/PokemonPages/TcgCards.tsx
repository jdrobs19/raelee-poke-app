import { useEffect, useState } from "react"
import { Link } from "react-router-dom";
import { TcgApiData, TcgCardsProps } from "../../types/types";
import { tcgApi } from "../../utils/Constants";
import "../../css/pages/TcgCards.css"
import { TcgCardDetails } from "../../components/TcgCardDetails";

export function TcgCards({currentPokemon, addTcgCard, removeTcgCard, usersTcgCards = []} : TcgCardsProps){

    const [tcgCardData, setTcgCardData] = useState<TcgApiData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const tcgPokemonName = currentPokemon.name.endsWith("-mega")
        ? `mega ${currentPokemon.name.slice(0, -"-mega".length)}`
        : currentPokemon.name;
    
    useEffect(() => {
        const getTcgCards = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(
                    `${tcgApi}/cards?name=like:${encodeURIComponent(tcgPokemonName)}`,
                );
                if(!response.ok){
                    throw new Error("Error retrieving card data for pokemon")
                }

                const data = await response.json();
                const cards: TcgApiData[] = data.map((card: TcgApiData) => ({
                    id: card.id,
                    localId: card.localId,
                    name: card.name,
                    image: card.image ? `${card.image}/high.png` : undefined,
                }));

                setTcgCardData(cards);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        getTcgCards();
    }, [tcgPokemonName])

    const basePokemon = currentPokemon.evolution[0];
    const basePokemonId = basePokemon?.pokemon.url.split("/").filter(Boolean).pop();
    const hasBasePokemon =
        basePokemon &&
        basePokemon.pokemon.name !== currentPokemon.name &&
        basePokemonId;

    return(
        <div className="my-tcg-cards">
            {!isLoading && tcgCardData.length === 0 ? (
                <div className="tcg-cards-empty">
                    <p>No trading cards are available for {currentPokemon.name}.</p>
                    {hasBasePokemon && (
                        <p>
                            Try looking at the base Pokémon, {basePokemon.pokemon.name},{" "}
                            <Link to={`/pokemon/${basePokemonId}`}>to see its cards.</Link>
                        </p>
                    )}
                </div>
            ) : tcgCardData.map((card) => (
                <TcgCardDetails
                    key={card.id}
                    card={card}
                    addTcgCard={addTcgCard}
                    removeTcgCard={removeTcgCard}
                    isSaved={usersTcgCards.some((savedCard) => savedCard.id === card.id)}
                />
            ))}
        </div>
    )
}
