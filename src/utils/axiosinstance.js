// utils/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://192.168.1.13:5000/api",
  withCredentials: true, // Required for httpOnly cookies
  timeout: 10000, // 10s timeout protection
  headers: {
    "Content-Type": "application/json",
  },
});

/* ===============================
   REQUEST INTERCEPTOR
================================= */
axiosInstance.interceptors.request.use(
  (config) => {
    // If later you move to Bearer tokens, this is ready:
    // const token = localStorage.getItem("token");
    // if (token) config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  (error) => Promise.reject(error)
);

/* ===============================
   RESPONSE INTERCEPTOR
================================= */
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    // 🔐 Auto logout if unauthorized
    if (status === 401) {
      console.warn("Session expired. Redirecting to login...");
      window.location.href = "/login";
    }

    // 🧾 Cleaner logging
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