import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <header className="site-navbar" data-name="Header 1">
      <div className="navbar-inner">
        <div className="brand">
          <Link to="/">HEALTH CLAIM ML PREDICTOR</Link>
        </div>
        <nav className="nav-links">
          = <Link to="/login">Log In</Link>
        </nav>
      </div>
    </header>
  );
}
