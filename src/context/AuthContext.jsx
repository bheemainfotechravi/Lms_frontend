import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosinstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("authToken") || null);
  
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("userData");
    if (savedUser && savedUser !== "undefined") {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        console.error("AuthContext: Error parsing userData", e);
        return null;
      }
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState(true);
  const role = user?.role?.toLowerCase().trim() || "";

  const isAuthenticated = !!token;
  const isAdmin = role === "admin";
  const isSuperAdmin = role === "super admin" || role === "superadmin";
  // Ab 'role' variable defined hai, toh error nahi aayega
  const isUser = role === "student" || role === "user"; 
  // --- FIX ENDS HERE ---

  useEffect(() => {
    if (token) {
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axiosInstance.defaults.headers.common["Authorization"];
    }
    setIsLoading(false);
  }, [token]);

  const login = (userData, token) => {
    if (!userData || !token) return;

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
        token, 
        isAuthenticated,
        isAdmin,
        isSuperAdmin,
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