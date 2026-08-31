import { MdLogout } from "react-icons/md";
import "../css/snippets/Footer.css"

export function Footer() {

    const LogoutIcon = MdLogout as any;

    return (
        <footer className="footer">
            <div className="footer-item"></div>
            <div className="footer-nav"></div>
            <div className="footer-item">
                <LogoutIcon/>
            </div>
        </footer>
    );
}