// utils/axiosinstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://192.168.1.13:5000/api",
  withCredentials: true, // 🔥 VERY IMPORTANT for httpOnly cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Global error logging
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default axiosInstance;
