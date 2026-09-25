import { useQueries, useQuery } from "@tanstack/react-query";
import { pokemonApiClient } from "../api/client";
import { Loading } from "../components/Loading";
import { PaginationControls } from "../components/PaginationControls";
import { PokemonDetailsCard } from "../components/PokemonDetailsCard";
import "../css/pages/Search.css";
import { useSearchPagination } from "../hooks/useSearchPagination";
import { MainPage } from "../snippets/MainPage";
import { PokemonApiData } from "../types/types";
import { toIndividualPokemon } from "../utils/pokemonMappers";

const byPokemonId = (first: PokemonApiData, second: PokemonApiData) =>
  Number(first.url.split("/").at(-2)) - Number(second.url.split("/").at(-2));
const pokemonName = (pokemon: PokemonApiData) => pokemon.name;

export function Search() {
  const { data: pokemonData = [], isPending, isError } = useQuery({
    queryKey: ["pokemon", "index"],
    queryFn: ({ signal }) => pokemonApiClient.getIndex(signal).then((data) => data.results),
    staleTime: Infinity,
  });
  const pagination = useSearchPagination(pokemonData, { getSearchText: pokemonName, compareItems: byPokemonId });
  const detailQueries = useQueries({
    queries: pagination.visibleItems.map((pokemon) => ({
      queryKey: ["pokemon", pokemon.url],
      queryFn: ({ signal }: { signal: AbortSignal }) => pokemonApiClient.getPokemonByUrl(pokemon.url, signal),
      staleTime: 30 * 60 * 1000,
    })),
  });
  const isLoadingDetails = detailQueries.some((query) => query.isPending);
  const visiblePokemon = detailQueries.flatMap((query) => query.data ? [toIndividualPokemon(query.data)] : []);

  if (isPending) return <Loading />;
  if (isError) return <p>Pokemon data could not be loaded.</p>;

  return (
    <div className="search">
      <div className="search-controls">
        <input type="text" className="search-bar" value={pagination.searchInput} onChange={(event) => pagination.setSearchInput(event.target.value)} placeholder="Search Pokémon" />
        <PaginationControls itemLabel="Pokémon" currentPage={pagination.currentPage} pageSize={pagination.pageSize} totalPages={pagination.totalPages} onPageSizeChange={pagination.setPageSize} onPreviousPage={() => pagination.setCurrentPage((page) => Math.max(1, page - 1))} onNextPage={() => pagination.setCurrentPage((page) => Math.min(pagination.totalPages, page + 1))} />
      </div>
      {isLoadingDetails ? <Loading /> : <PokemonDetailsCard pokemon={visiblePokemon} />}
    </div>
  );
}

export default MainPage(Search);