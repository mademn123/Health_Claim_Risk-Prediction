import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, getAuth } from "firebase/auth";

// create a context to share auth state across the app
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

// provide auth state to child components
export function AuthProvider({ children }) {
  const auth = getAuth();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // listen for auth state changes
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      console.log("Auth state changed. Current user:", user);
      setCurrentUser(user);
      setLoading(false);
    });

    return unsub;
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
