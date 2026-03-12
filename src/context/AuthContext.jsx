import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosinstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("authToken") || null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("userData")) || null);
  const [isLoading, setIsLoading] = useState(true);

  /* ===============================
     🔹 AUTH STATES
  ================================= */
  const isAuthenticated = !!adminToken;
  const isAdmin =
    user?.role === "admin" || user?.role === "superadmin";

useEffect(() => {
  setIsLoading(false);
}, []);

 const login = (userData, token) => {
  setUser(userData);
  setAdminToken(token);

  localStorage.setItem("userToken", JSON.stringify(userData));
  localStorage.setItem("adminToken", token);

  axiosInstance.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${token}`;
};
     const logout = () => {
  setUser(null);
  setAdminToken(null);
  localStorage.removeItem("adminUser");
  localStorage.removeItem("adminToken");
  delete axiosInstance.defaults.headers.common["Authorization"];
};

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