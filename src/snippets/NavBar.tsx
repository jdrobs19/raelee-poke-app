import pokeball from "../assets/pokeball-png-45334.png";
import { GiHamburgerMenu } from "react-icons/gi";
import "../css/snippets/NavBar.css"

export function NavBar() {

  const MenuIcon = GiHamburgerMenu as any;

  return (
    <nav className="nav-bar">
      <div className="nav-item">
        <img src={pokeball} alt="pokeball"/>
      </div>
      <div className="nav-links"></div>
      <div className="nav-item">
        <MenuIcon/>
      </div>
    </nav>
  );
}
