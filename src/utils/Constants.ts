export const pokemonApi = "https://pokeapi.co/api/v2"
export const allPokemon = `${pokemonApi}/pokemon?limit=2500`
export const individualPokemon = `${pokemonApi}/pokemon`
export const pokemonSpecies = `${pokemonApi}/pokemon-species`
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export const pokemonTabs = {
    overview: "overview",
    evolution: "evolution",
    moves: "moves",
    tcgCards: "tcgCard"
} as const;

export type PokemonTab = typeof pokemonTabs[keyof typeof pokemonTabs];