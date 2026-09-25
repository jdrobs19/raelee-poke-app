import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { tcgApiClient } from "../../api/client";
import { Loading } from "../../components/Loading";
import { TcgCardDetails } from "../../components/TcgCardDetails";
import "../../css/pages/TcgCards.css";
import { TcgCardsProps } from "../../types/types";

export function TcgCards({ currentPokemon }: Pick<TcgCardsProps, "currentPokemon">) {
  const tcgPokemonName = currentPokemon.name.endsWith("-mega") ? `mega ${currentPokemon.name.slice(0, -"-mega".length)}` : currentPokemon.name;
  const { data: cards = [], isPending, isError } = useQuery({
    queryKey: ["tcg", "cards", tcgPokemonName],
    queryFn: ({ signal }) => tcgApiClient.getCards(tcgPokemonName, signal),
    staleTime: 15 * 60 * 1000,
  });
  const basePokemon = currentPokemon.evolution[0];
  const basePokemonId = basePokemon?.pokemon.url.split("/").filter(Boolean).pop();
  const hasBasePokemon = basePokemon && basePokemon.pokemon.name !== currentPokemon.name && basePokemonId;

  if (isPending) return <Loading />;
  if (isError) return <p>Trading card data could not be loaded.</p>;

  return (
    <div className="my-tcg-cards">
      {cards.length === 0 ? <div className="tcg-cards-empty"><p>No trading cards are available for {currentPokemon.name}.</p>{hasBasePokemon && <p>Try looking at the base Pokémon, {basePokemon.pokemon.name}, <Link to={`/pokemon/${basePokemonId}`}>to see its cards.</Link></p>}</div> : cards.map((card) => <TcgCardDetails key={card.id} card={{ ...card, image: card.image ? `${card.image}/high.png` : undefined }} />)}
    </div>
  );
}