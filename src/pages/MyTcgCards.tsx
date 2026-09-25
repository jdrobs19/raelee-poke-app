import { CollectionAuthGate } from "../components/CollectionAuthGate";
import { PaginationControls } from "../components/PaginationControls";
import { TcgCardDetails } from "../components/TcgCardDetails";
import { useAppState } from "../context/AppStateContext";
import "../css/pages/Search.css";
import "../css/pages/TcgCards.css";
import { useSearchPagination } from "../hooks/useSearchPagination";
import { MainPage } from "../snippets/MainPage";

const byCardName = (first: { name: string }, second: { name: string }) => first.name.localeCompare(second.name);
const cardName = (card: { name: string }) => card.name;

export function MyTcgCards() {
  const { usersTcgCards } = useAppState();
  const pagination = useSearchPagination(usersTcgCards, { getSearchText: cardName, compareItems: byCardName });

  return (
    <CollectionAuthGate>
      <div className="my-collection">
        <div className="search-controls my-pokemon-controls">
          <input type="text" className="search-bar" value={pagination.searchInput} onChange={(event) => pagination.setSearchInput(event.target.value)} placeholder="Search My Trading Cards" />
          <PaginationControls itemLabel="Cards" currentPage={pagination.currentPage} pageSize={pagination.pageSize} totalPages={pagination.totalPages} onPageSizeChange={pagination.setPageSize} onPreviousPage={() => pagination.setCurrentPage((page) => Math.max(1, page - 1))} onNextPage={() => pagination.setCurrentPage((page) => Math.min(pagination.totalPages, page + 1))} />
        </div>
        {pagination.visibleItems.length > 0 ? <div className="my-tcg-cards">{pagination.visibleItems.map((card) => <TcgCardDetails key={card.id} card={card} />)}</div> : <div className="tcg-cards-empty"><p>You haven't saved any trading cards yet.</p></div>}
      </div>
    </CollectionAuthGate>
  );
}

export default MainPage(MyTcgCards);