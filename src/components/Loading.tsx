import pokeball from "../assets/pokeball-png-45334.png";
import "../css/component/Loading.css";

export function Loading() {
    return (
        <div className="loading">
            <img className="loading-pokeball" src={pokeball} alt="Loading" />
        </div>
    );
}