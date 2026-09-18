import { useEffect, useState } from "react";
import { MainPage } from "../snippets/MainPage";
import { Register } from "../auth/Register";
import { Login } from "../auth/Login";
import { MyTcgCardsPageProps } from "../types/types";
import { TcgCardDetails } from "../components/TcgCardDetails";
import { PAGE_SIZE_OPTIONS } from "../utils/Constants";
import "../css/pages/Search.css";
import "../css/pages/TcgCards.css";

export function MyTcgCards({
  auth,
  isLoggedIn,
  isRegistered,
  setIsLoggedIn,
  setUser,
  usersTcgCards,
  removeTcgCard,
}: MyTcgCardsPageProps) {
  const [showRegister, setShowRegister] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const sortedTcgCards = [...usersTcgCards].sort((a, b) =>
    a.name.localeCompare(b.name),
  );
  const filteredTcgCards = sortedTcgCards.filter((card) =>
    card.name.toLowerCase().includes(searchTerm.trim().toLowerCase()),
  );
  const totalPages = Math.max(1, Math.ceil(filteredTcgCards.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const visibleTcgCards = filteredTcgCards.slice(
    (safeCurrentPage - 1) * pageSize,
    safeCurrentPage * pageSize,
  );

  useEffect(() => {
    const debounceTimer = window.setTimeout(() => {
      setSearchTerm(searchInput);
    }, 300);

    return () => window.clearTimeout(debounceTimer);
  }, [searchInput]);

  useEffect(() => {
    setCurrentPage(1);
  }, [usersTcgCards.length, pageSize, searchTerm]);

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  if (!isLoggedIn) {
    return (
      <div className="my-pokemon">
        {showRegister ? (
          <>
            <Register
              auth={auth}
              isRegistered={isRegistered}
              isLoggedIn={setIsLoggedIn}
              setUser={setUser}
            />
            <button type="button" onClick={() => setShowRegister(false)}>
              Back to login
            </button>
          </>
        ) : (
          <>
            <Login
              auth={auth}
              isRegistered={isRegistered}
              isLoggedIn={setIsLoggedIn}
              setUser={setUser}
            />
            <button type="button" onClick={() => setShowRegister(true)}>
              Need an account? Register
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="my-collection">
      <div className="search-controls my-pokemon-controls">
        <input
          type="text"
          className="search-bar"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="Search My Trading Cards"
        />
        <div className="pagination" aria-label="My Trading Cards pages">
          <label>
            Cards per page:
            <select
              value={pageSize}
              onChange={(event) => setPageSize(Number(event.target.value))}
            >
              {PAGE_SIZE_OPTIONS.map((option) => (
                <option value={option} key={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            disabled={safeCurrentPage === 1}
          >
            Previous
          </button>
          <span>
            Page {safeCurrentPage} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() =>
              setCurrentPage((page) => Math.min(totalPages, page + 1))
            }
            disabled={safeCurrentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
      {visibleTcgCards.length > 0 ? (
        <div className="my-tcg-cards">
          {visibleTcgCards.map((card) => (
            <TcgCardDetails
              key={card.id}
              card={card}
              removeTcgCard={removeTcgCard}
            />
          ))}
        </div>
      ) : (
        <div className="tcg-cards-empty">
          <p>You haven't saved any trading cards yet.</p>
        </div>
      )}
    </div>
  );
}

export default MainPage(MyTcgCards);
