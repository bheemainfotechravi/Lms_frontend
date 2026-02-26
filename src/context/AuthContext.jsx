// context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosinstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [adminToken, setAdminToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;
  const isAdmin =
    user?.role === "admin" || user?.role === "superadmin";

  // 🔄 Check auth on refresh
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axiosInstance.get("/");
        setUser(res.data.user);
      } catch (err) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // 🔥 UPDATED LOGIN
  const login = (userData, token) => {
    setUser(userData);
    setAdminToken(token); // store token
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    setAdminToken(null);
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