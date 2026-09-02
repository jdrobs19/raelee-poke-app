import { MdLogout } from "react-icons/md";
import "../css/snippets/Footer.css"
import { FooterProps } from "../types/types";

export function Footer({handleLogout}: FooterProps) {

    const LogoutIcon = MdLogout as any;

    return (
        <footer className="footer">
            <div className="footer-item"></div>
            <div className="footer-nav"></div>
            <div className="footer-item">
                <LogoutIcon onClick={handleLogout} />
            </div>
        </footer>
    );
}