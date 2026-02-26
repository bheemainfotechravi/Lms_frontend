// utils/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://192.168.1.13:5000/api",
  withCredentials: true, // ✅ Required for httpOnly cookies
  headers: {
    "Content-Type": "application/json",
  },
});

/* ===============================
   REQUEST INTERCEPTOR
================================= */
axiosInstance.interceptors.request.use(
  (config) => {

    // Cookies are automatically sent because of withCredentials: true
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

    // 🔐 If session expired or unauthorized
    if (status === 401) {
      console.log("Session expired. Redirecting to admin login...");

      // Optional auto redirect
      if (window.location.pathname.startsWith("/admin")) {
        // window.location.href = "/admin/login";
      }
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