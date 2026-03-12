import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosinstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("authToken") || null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("userData")) || null);
  const [isLoading, setIsLoading] = useState(true);

  // AUTH STATES
  const isAuthenticated = !!token;
  const isAdmin = user?.role === "admin" || user?.role === "superadmin";
  const isUser = user?.role === "user"; // Helpful for your user routes

  useEffect(() => {
    if (token) {
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    setIsLoading(false);
  }, [token]);

  const login = (userData, token) => {
    setUser(userData);
    setToken(token);

    localStorage.setItem("userData", JSON.stringify(userData));
    localStorage.setItem("authToken", token);

    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("userData");
    localStorage.removeItem("authToken");
    delete axiosInstance.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token, // Unified name
        isAuthenticated,
        isAdmin,
        isUser,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);