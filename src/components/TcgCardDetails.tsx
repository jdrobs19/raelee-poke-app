import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { MdAdd, MdRemoveCircleOutline, MdCheckCircle } from "react-icons/md";
import { tcgApiClient } from "../api/client";
import { useAppState } from "../context/AppStateContext";
import { TcgCardDetailsProps } from "../types/types";

const formatPriceLabel = (label: string) => label.replace(/([A-Z])/g, " $1").toLowerCase();

export function TcgCardDetails({ card }: TcgCardDetailsProps) {
  const { addTcgCard, removeTcgCard, usersTcgCards } = useAppState();
  const AddIcon = MdAdd as any;
  const RemoveIcon = MdRemoveCircleOutline as any;
  const AddedIcon = MdCheckCircle as any;
  const isAddContext = useLocation().pathname.includes("/pokemon");
  const { data } = useQuery({ queryKey: ["tcg", "card", card.id], queryFn: ({ signal }) => tcgApiClient.getCard(card.id, signal), staleTime: 30 * 60 * 1000 });
  const isSaved = usersTcgCards.some((savedCard) => savedCard.id === card.id);
  const variants = Object.entries(data?.variants ?? {}).filter(([, available]) => available);
  const prices = data?.pricing?.tcgplayer;

  return (
    <article className="tcg-card">
      {card.image ? <img className="tcg-card-image" src={card.image} alt={`${card.name} ${data?.rarity ?? ""} trading card`} /> : <div className="tcg-card-image-unavailable" role="img" aria-label={`${card.name} image unavailable`}>Image unavailable</div>}
      <div className="tcg-card-details">
        <div className="tcg-card-header-row">
          <div className="tcg-card-heading"><strong className="tcg-card-name">{card.name}</strong>{data && <><strong className="tcg-card-rarity">{data.rarity}</strong><span className="tcg-card-set">{data.set.name}</span></>}</div>
          <div className="tcg-card-list">{isAddContext ? isSaved ? <AddedIcon className="added-icon" title={`${card.name} is in your collection - click to remove`} aria-label={`remove ${card.name} from your collection`} onClick={() => removeTcgCard(card.id)} /> : <AddIcon className="add-icon" title={`add ${card.name} to your collection`} aria-label={`add ${card.name} to your collection`} onClick={() => addTcgCard(card)} /> : <RemoveIcon className="remove-icon" onClick={() => removeTcgCard(card.id)} />}</div>
        </div>
        {data && <><div className="tcg-card-variants">{variants.map(([name]) => <span className="tcg-card-variant" key={name}>{name.toUpperCase()}</span>)}</div><div className="tcg-card-prices">{prices ? Object.entries(prices).filter(([key, price]) => key !== "updated" && typeof price === "object" && price !== null).map(([key, price]) => <div className="tcg-card-price-group" key={key}><strong>{key.toUpperCase()}</strong>{Object.entries(price).filter(([label]) => label !== "productId").map(([label, amount]) => <div className="tcg-card-price-row" key={label}><span>{formatPriceLabel(label)}</span><span>{typeof amount === "number" ? `$${amount.toFixed(2)}` : "-"}</span></div>)}</div>) : <div>Price information unavailable</div>}</div><small className="tcg-card-price-updated">Updated {new Date(prices?.updated ?? Date.now()).toLocaleDateString()}</small></>}
      </div>
    </article>
  );
}