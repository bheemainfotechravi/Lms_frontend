// utils/axiosInstance.js
import axios from "axios";
export const image_URl = "http://10.15.181.145:5000"
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://10.15.181.145:5000/api",
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
    // If later you move to Bearer tokens, this is ready:
    // const token = localStorage.getItem("token");
    // if (token) config.headers.Authorization = `Bearer ${token}`;

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