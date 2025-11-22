import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";

export default function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();
  // if a user is not logged in, then go to login page
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
