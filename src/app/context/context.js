"use client"
import { createContext, useState, useContext, useEffect } from "react";

// Create a context for the user
const UserContext = createContext();

// Create a provider component
export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  // Example: simulate fetching user data on mount (replace with actual logic)
  useEffect(() => {
    // You can replace this with your logic to get the user (e.g., from localStorage, cookies, or an API)
    const loggedInUser = JSON.parse(localStorage.getItem("user")); // or use your own authentication method

    if (loggedInUser) {
      setUser(loggedInUser);
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

// Custom hook to use the UserContext
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

// Example helper to get user from context (this is just an example, adjust as needed)
export function getUserFromContext(context) {
  return context?.user || null;
}
