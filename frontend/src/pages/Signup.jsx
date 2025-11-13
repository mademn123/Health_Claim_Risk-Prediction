import { Link, useNavigate } from "react-router-dom";
import "./Signup.css";
import { signupForm } from "../firebaseAuth";

export default function Signup() {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      await signupForm(email, password);
      // clear form after submitting
      e.target.reset();
      navigate("/login");
    } catch (error) {
      console.error("Error during signup:", error);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h1>
          Sign Up to
          <br />
          Take Survey!
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Enter Your Email Address:</label>
            <input type="email" name="email" required />
          </div>

          <div className="form-group">
            <label>Enter a Password:</label>
            <input type="password" name="password" required />
            <span className="password-hint">
              Password must be at least 6 characters long.
            </span>
          </div>

          <button type="submit" className="signup-button">
            Sign Up
          </button>

          <div className="login-link">
            Already Have An Account? <Link to="/login">Log In Now</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
