import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { MdAdd, MdRemoveCircleOutline, MdCheckCircle } from "react-icons/md";
import { TcgCardDetailsProps, TcgSingleCardData } from "../types/types";
import { getSingleCardBase } from "../utils/Constants";

const formatPriceLabel = (label: string) =>
  label.replace(/([A-Z])/g, " $1").toLowerCase();

export function TcgCardDetails({ card, addTcgCard, removeTcgCard, isSaved }: TcgCardDetailsProps) {
  const [singleCardData, setSingleCardData] = useState<TcgSingleCardData>();
  const AddIcon = MdAdd as any;
  const RemoveIcon = MdRemoveCircleOutline as any;
  const AddedIcon = MdCheckCircle as any;
  const location = useLocation();
  const isAddContext = location.pathname.includes("/pokemon");

  useEffect(() => {
    const getSingleCardData = async () => {
      try {
        const response = await fetch(`${getSingleCardBase}/${card.id}`);
        if (!response.ok) {
          throw new Error("No single card response received");
        }

        const data = await response.json();
        const singleCard: TcgSingleCardData = {
          rarity: data.rarity,
          set: data.set.name,
          variants: Object.entries(data.variants ?? {}).map(([name, available]) => ({
            name,
            available: Boolean(available),
          })),
          cardPrices: data.pricing?.tcgplayer,
          priceUpdated: new Date(data.pricing?.tcgplayer?.updated ?? Date.now()),
        };

        console.log(singleCard);

        setSingleCardData(singleCard);
      } catch (error) {
        console.error(error);
      }
    };
    getSingleCardData();
  }, [card.id]);

  return (
    <article className="tcg-card">
      {card.image ? (
        <img
          className="tcg-card-image"
          src={card.image}
          alt={`${card.name} ${singleCardData?.rarity ?? ""} trading card`}
        />
      ) : (
        <div
          className="tcg-card-image-unavailable"
          role="img"
          aria-label={`${card.name} image unavailable`}
        >
          Image unavailable
        </div>
      )}
      <div className="tcg-card-details">
        <div className="tcg-card-header-row">
          <div className="tcg-card-heading">
            <strong className="tcg-card-name">{card.name}</strong>
            {singleCardData && (
              <>
                <strong className="tcg-card-rarity">{singleCardData.rarity}</strong>
                <span className="tcg-card-set">{singleCardData.set}</span>
              </>
            )}
          </div>
          {(addTcgCard || removeTcgCard) && (
            <div className="tcg-card-list">
              {isAddContext ? (
                isSaved ? (
                  <AddedIcon
                    className="added-icon"
                    title={`${card.name} is in your collection - click to remove`}
                    aria-label={`remove ${card.name} from your collection`}
                    onClick={() => removeTcgCard?.(card.id)}
                  />
                ) : (
                  <AddIcon
                    className="add-icon"
                    title={`add ${card.name} to your collection`}
                    aria-label={`add ${card.name} to your collection`}
                    onClick={() => addTcgCard?.(card)}
                  />
                )
              ) : (
                <RemoveIcon
                  className="remove-icon"
                  onClick={() => removeTcgCard?.(card.id)}
                />
              )}
            </div>
          )}
        </div>
        {singleCardData && (
          <>
          <div className="tcg-card-variants">
            {singleCardData.variants
              ?.filter((variant) => variant.available)
              .map((variant) => (
                <span className="tcg-card-variant" key={variant.name}>
                  {variant.name.toUpperCase()}
                </span>
              ))}
          </div>
          <div className="tcg-card-prices">
            {singleCardData.cardPrices ? (
              Object.entries(singleCardData.cardPrices)
                .filter(
                  ([key, prices]) =>
                    key !== "unit" &&
                    key !== "updated" &&
                    typeof prices === "object" &&
                    prices !== null,
                )
                .map(([key, prices]) => (
                  <div className="tcg-card-price-group" key={key}>
                    <strong>{key.toUpperCase()}</strong>
                    {Object.entries(prices)
                      .filter(([label]) => label !== "productId")
                      .map(([label, amount]) => (
                        <div className="tcg-card-price-row" key={label}>
                          <span>{formatPriceLabel(label)}</span>
                          <span>
                            {typeof amount === "number"
                              ? `$${amount.toFixed(2)}`
                              : "-"}
                          </span>
                        </div>
                      ))}
                  </div>
                ))
            ) : (
              <div>Price information unavailable</div>
            )}
          </div>
          <small className="tcg-card-price-updated">
            Updated {singleCardData.priceUpdated.toLocaleDateString()}
          </small>
          </>
        )}
      </div>
    </article>
  );
}
