import { get } from "http";
import React, { createContext, useState, useEffect, useContext } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  username: string | null;
  setIsLoggedIn: (loggedIn: boolean) => void;
  setUsername: (username: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [username, setUsername] = useState<string | null>(null);

  // Persist login state across page reloads using sessionID
  useEffect(() => {
    const storedSessionID = getSessionID();
    // Log the session_id
    console.log("ssid:", storedSessionID);

    if (storedSessionID) {
      // If session_id exists in local storage, validate the session
      validateSession(storedSessionID)
        .then((data) => {
          // If session is valid, update context state
          setIsLoggedIn(true);
          setUsername(getUsername());
        })
        .catch(() => {
          // Session is invalid, clear local storage
          console.log("Invalid session, clearing...");
          clearSession();
        });
    }
  }); // Only run once on component mount

  const validateSession = async (sessionID: string): Promise<{ user: any }> => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/auth/validate-session", {
        method: "GET",
        headers: { Authorization: `${sessionID}` },
      });

      if (!response.ok) {
        throw new Error("Invalid session");
      }

      const userData = await response.json();
      return userData;
    } catch (error) {
      console.error("Session validation failed:", error);
      throw new Error("Invalid session");
    }
  };

  const getSessionID = (): string | null => {
    return localStorage.getItem("session_id");
  };

  const getUsername = (): string | null => {
    return localStorage.getItem("username");
  }

  const clearSession = () => {
    localStorage.removeItem("session_id"); // Clear session ID from local storage
    setIsLoggedIn(false);
    setUsername(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, username, setIsLoggedIn, setUsername }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};