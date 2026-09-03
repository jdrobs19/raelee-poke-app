import TCGdex, {Query} from "@tcgdex/sdk";

const tcgdex = new TCGdex("en");

export const pokemonCardQuery = async (pokemon: string) =>
  await tcgdex.card.list(Query.create().equal("name", pokemon));
