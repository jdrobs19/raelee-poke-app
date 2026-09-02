import pokeball from "../assets/pokeball-png-45334.png";
import { GiHamburgerMenu } from "react-icons/gi";
import NavRoutes from "../utils/NavRoutes"
import "../css/snippets/NavBar.css"
import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";

export function NavBar() {

  const MenuIcon = GiHamburgerMenu as any;
  const location = useLocation();
  const underlineRef = useRef<HTMLSpanElement | null>(null);
  const linkRefs = useRef<Array<HTMLAnchorElement | null>>([]);

  useEffect(() => {
    const activeIndex = NavRoutes.findIndex(({ route }) => route === location.pathname);
    const activeLink = linkRefs.current[activeIndex];
    const underline = underlineRef.current;

    if (!activeLink || !underline) return;

    underline.style.width = `${activeLink.offsetWidth}px`;
    underline.style.transform = `translateX(${activeLink.offsetLeft}px)`;
  }, [location.pathname]);

  return (
    <nav className="nav-bar">
      <div className="nav-item">
        <img src={pokeball} alt="pokeball"/>
      </div>
      <div className="nav-links">
        <ul>
          <span className="nav-underline" ref={underlineRef} />
          {NavRoutes.map(({ name, route }, index) => {
            return (
              <NavLink
                to={route}
                key={route}
                ref={(el) => {
                  linkRefs.current[index] = el;
                }}
                className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
              >
                <li>{name}</li>
              </NavLink>
            );
          })}
        </ul>
      </div>
      <div className="nav-item">
        <MenuIcon/>
      </div>
    </nav>
  );
}
