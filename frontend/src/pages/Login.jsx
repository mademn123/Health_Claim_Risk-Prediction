import { useState } from "react";
import { signupForm, signinForm } from "../firebaseAuth";

function Login() {
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    if (isRegistering) {
      await signupForm(email, password);
    } else {
      await signinForm(email, password);
    }

    e.target.reset(); // optional: clears the form after submit
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>{isRegistering ? "Sign Up" : "Login"}</h2>

      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Email" required />
        <br />
        <br />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
        />
        <br />
        <br />
        <button type="submit">
          {isRegistering ? "Create Account" : "Login"}
        </button>
      </form>

      <p style={{ marginTop: "20px" }}>
        {isRegistering ? "Already have an account?" : "Don’t have an account?"}{" "}
        <button
          type="button"
          onClick={() => setIsRegistering(!isRegistering)}
          style={{
            background: "none",
            color: "blue",
            border: "none",
            cursor: "pointer",
          }}
        >
          {isRegistering ? "Login" : "Sign Up"}
        </button>
      </p>
    </div>
  );
}

export default Login;
