import { Link, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { useAuth } from "../AuthContext.jsx";
import "./Navbar.css";

export default function Navbar() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    navigate("/login");
  };

  return (
    <header className="site-navbar" data-name="Header 1">
      <div className="navbar-inner">
        <div className="brand">
          <Link to="/">HEALTH CLAIM ML PREDICTOR</Link>
        </div>

        <nav className="nav-links">
          {/* if not logged in, show login */}
          {!currentUser && <Link to="/login">Log In</Link>}

          {/* if logged in, show logout */}
          {currentUser && (
            <span className="nav-link logout-link" onClick={handleLogout}>
              Log Out
            </span>
          )}
        </nav>
      </div>
    </header>
  );
}
