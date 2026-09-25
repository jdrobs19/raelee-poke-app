import "./css/app/App.css";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useAppState } from "./context/AppStateContext";
import { Compare } from "./pages/Compare";
import { MyPokemon } from "./pages/MyPokemon";
import { MyTcgCards } from "./pages/MyTcgCards";
import { Pokemon } from "./pages/Pokemon";
import { Search } from "./pages/Search";
import { Footer } from "./snippets/Footer";
import { NavBar } from "./snippets/NavBar";

function AppContent() {
  const { currentPokemonTab, setCurrentPokemonTab, handleLogout } = useAppState();

  return (
    <div className="app-container">
      <ToastContainer className="mobile-toast-container" />
      <div className="App">
        <NavBar />
        <Routes>
          <Route path="/search" element={<Search />} />
          <Route path="/list" element={<MyPokemon />} />
          <Route path="/pokemon/:id" element={<Pokemon />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/tcgcards" element={<MyTcgCards />} />
          <Route path="*" element={<Navigate to="/pokemon/1" replace />} />
        </Routes>
        <Footer handleLogout={handleLogout} currentPokemonTab={currentPokemonTab} setCurrentPokemonTab={setCurrentPokemonTab} />
      </div>
    </div>
  );
}

function App() {
  return <Router><AppContent /></Router>;
}

export default App;