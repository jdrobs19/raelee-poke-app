import { CollectionAuthGate } from "../components/CollectionAuthGate";
import { PaginationControls } from "../components/PaginationControls";
import { PokemonDetailsCard } from "../components/PokemonDetailsCard";
import { useAppState } from "../context/AppStateContext";
import "../css/pages/Search.css";
import { useSearchPagination } from "../hooks/useSearchPagination";
import { MainPage } from "../snippets/MainPage";

const byPokemonId = (first: { id: number }, second: { id: number }) => first.id - second.id;
const pokemonName = (pokemon: { name: string }) => pokemon.name;

export function MyPokemon() {
  const { usersPokemon } = useAppState();
  const pagination = useSearchPagination(usersPokemon, { getSearchText: pokemonName, compareItems: byPokemonId });

  return (
    <CollectionAuthGate>
      <div className="my-collection">
        <div className="search-controls my-pokemon-controls">
          <input type="text" className="search-bar" value={pagination.searchInput} onChange={(event) => pagination.setSearchInput(event.target.value)} placeholder="Search My Pokémon" />
          <PaginationControls itemLabel="Pokémon" currentPage={pagination.currentPage} pageSize={pagination.pageSize} totalPages={pagination.totalPages} onPageSizeChange={pagination.setPageSize} onPreviousPage={() => pagination.setCurrentPage((page) => Math.max(1, page - 1))} onNextPage={() => pagination.setCurrentPage((page) => Math.min(pagination.totalPages, page + 1))} />
        </div>
        <PokemonDetailsCard pokemon={pagination.visibleItems} />
      </div>
    </CollectionAuthGate>
  );
}

export default MainPage(MyPokemon);