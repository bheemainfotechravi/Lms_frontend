// utils/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://10.15.181.145:5000/api",
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});


axiosInstance.interceptors.request.use(
  (config) => {


    return config;
  },
  (error) => Promise.reject(error)
);


axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      console.warn("Session expired. Redirecting to login...");
      window.location.href = "/login";
    }

    
    console.error("API Error:", {
      url: error.config?.url,
      method: error.config?.method,
      status,
      message: error.response?.data?.message || error.message,
    });

    return Promise.reject(error);
  }
);

export default axiosInstance;