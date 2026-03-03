
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



useEffect(() => {
  setIsLoading(false);
}, []);

  const login = (userData) => {
    if(userData){
      setIsLoading(false)
    }
    setUser(userData);
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
