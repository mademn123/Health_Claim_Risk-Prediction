import imgImage1 from "../assets/background.png";
import { Link } from "react-router-dom";
import "./Home.css";
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="home-container">
        <div className="home-card">
          <h1 className="home-title">Sign Up to Fill Out Survey</h1>

          <p className="home-text">
            Explore your{" "}
            <span className="bold">estimated health claim risk level</span> and{" "}
            <span className="bold">expected annual healthcare costs</span> based
            on your demographic and health information.
          </p>

          <p className="home-text">
            Use this tool to{" "}
            <span className="bold">
              understand your potential healthcare expenses
            </span>{" "}
            and make more informed insurance or preventive health decisions.
          </p>

          <Link
            to="/signup"
            className="home-button"
            style={{ display: "inline-block", textDecoration: "none" }}
          >
            Sign Up Now!
          </Link>
        </div>
      </div>
    </>
  );
}
