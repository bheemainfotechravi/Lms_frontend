// context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosinstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;
  const isAdmin = user?.role === "admin" || user?.role === "superadmin";

<<<<<<< HEAD
  // 🔄 Check auth on refresh
=======
 
>>>>>>> fbb914d66952ba6ba0b45e5b1aac0e54aa4c686f
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
