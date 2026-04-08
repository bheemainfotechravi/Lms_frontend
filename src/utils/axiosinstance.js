import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://192.168.29.233:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // We use localStorage directly to avoid importing the Redux store
    // This prevents circular dependency and initialization errors.
    const token = localStorage.getItem("authToken"); 
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      console.warn("Unauthorized: Clearing session and redirecting...");

      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");

      const path = window.location.pathname;
      let loginPath = "/login";

      if (path.startsWith("/admin")) loginPath = "/login";
      else if (path.startsWith("/teacher")) loginPath = "/teacher/login";
      else if (path.startsWith("/company")) loginPath = "/company/login";

      // Hard redirect wipes Redux state and handles the logout safely
      window.location.href = loginPath;
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;