// context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosinstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [adminToken, setAdminToken] = useState(
    localStorage.getItem("adminToken") || null
  );
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("adminUser")) || null
  );
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;
  const isAdmin =
    user?.role === "admin" || user?.role === "superadmin";

  /* ===============================0
     🔐 LOGIN
  ================================= */
  const login = (userData, token) => {
    // Save to state
    setUser(userData);
    setAdminToken(token);

    // Save to localStorage
    localStorage.setItem("adminToken", token);
    localStorage.setItem("admin", JSON.stringify(userData));

    // Attach token globally
    axiosInstance.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${token}`;
  };

  /* ===============================
     🚪 LOGOUT
  ================================= */
  const logout = () => {
    setUser(null);
    setAdminToken(null);

    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");

    delete axiosInstance.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        isLoading,
        login,
        logout,
        adminToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);