// context/AuthContext.jsx

import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosinstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  /* ===============================
     🔹 INITIAL STATE
  ================================= */
  const [adminToken, setAdminToken] = useState(
    localStorage.getItem("adminToken") || null
  );

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("adminUser")) || null
  );

  const [isLoading, setIsLoading] = useState(true);

  /* ===============================
     🔹 AUTH STATES
  ================================= */
  const isAuthenticated = !!adminToken;
  const isAdmin =
    user?.role === "admin" || user?.role === "superadmin";

  /* ===============================
     🔐 LOGIN
  ================================= */
  const login = (userData, token) => {
    // Save to state
    setUser(userData);
    setAdminToken(token);

    // Save to localStorage
    localStorage.setItem("adminToken", token);
    localStorage.setItem("adminUser", JSON.stringify(userData));

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
    localStorage.removeItem("adminUser");

    delete axiosInstance.defaults.headers.common["Authorization"];
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

  const login = (userData) => {
    if(userData){
      setIsLoading(false)
    }
    setUser(userData);
>>>>>>> master
  };

  /* ===============================
     🔄 APP LOAD HANDLING
  ================================= */
  useEffect(() => {
    if (adminToken) {
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${adminToken}`;
    }

    setIsLoading(false);
  }, [adminToken]);

  return (
    <AuthContext.Provider
      value={{
        user,
        adminToken,
        isAuthenticated,
        isAdmin,
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
