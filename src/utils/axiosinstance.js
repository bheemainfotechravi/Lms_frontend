// utils/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://192.168.1.5:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ===============================
   REQUEST INTERCEPTOR
================================= */
axiosInstance.interceptors.request.use(
  (config) => {

    // ✅ Get token from localStorage
    const token = localStorage.getItem("adminToken");

    // ✅ Attach Authorization header if token exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

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

    if (status === 401) {
      console.log("Session expired. Logging out...");

      // ✅ Remove stored auth data
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");

      // ✅ Redirect to login (only if in admin route)
      if (window.location.pathname.startsWith("/admin")) {
        window.location.href = "/admin/login";
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