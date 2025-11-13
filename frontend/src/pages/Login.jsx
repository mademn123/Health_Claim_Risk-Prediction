import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signupForm, signinForm } from "../firebaseAuth";
import "./Login.css";

export default function Login() {
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    if (isRegistering) {
      await signupForm(email, password);
    } else {
      try {
        await signinForm(email, password);
        navigate("/landing_page");
      } catch (error) {
        console.error("Sign-in error:", error);
      }
    }

    e.target.reset();
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Welcome Back</h1>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Email Address:</label>
            <input type="email" name="email" required />
          </div>

          <div className="form-group">
            <label>Password:</label>
            <input type="password" name="password" required />
          </div>

          <button type="submit" className="login-button">
            Log In
          </button>

          <div className="signup-link">
            Don't Have An Account? <Link to="/signup">Sign Up Now</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
