import { MdLogout } from "react-icons/md";
import { useLocation } from "react-router-dom";
import "../css/snippets/Footer.css";
import { FooterProps } from "../types/types";
import { pokemonTabs } from "../utils/Constants";

export function Footer({
  handleLogout,
  currentPokemonTab,
  setCurrentPokemonTab,
}: FooterProps) {
  const LogoutIcon = MdLogout as any;
  const location = useLocation();

  const myPokemonRoutes = [
    {
      name: pokemonTabs.overview,
      value: "Overview",
    },
    {
      name: pokemonTabs.evolution,
      value: "Evolution",
    },
    {
      name: pokemonTabs.moves,
      value: "Moves",
    },
    {
      name: pokemonTabs.tcgCards,
      value: "TCG Cards",
    },
  ];

  return (
    <footer className="footer">
      <div className="footer-item"></div>
      <div className="footer-nav">
        {location.pathname.includes("/pokemon") && (
          <ul>
            {myPokemonRoutes.map((route) => {
              return (
                <li
                  key={route.name}
                  className={currentPokemonTab === route.name ? "active" : ""}
                  onClick={() => setCurrentPokemonTab(route.name)}
                >
                  {route.value}
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <div className="footer-item">
        <LogoutIcon onClick={handleLogout} />
      </div>
    </footer>
  );
}
