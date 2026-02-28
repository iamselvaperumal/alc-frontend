import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  withCredentials: true, // Send cookies
  timeout: 30000, // 30 second timeout
});

// Request interceptor to add token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error) {
      console.error("Unknown error occurred");
      return Promise.reject(error);
    }

    if (error?.response?.status === 401) {
      // clear any stored token on unauthorized
      localStorage.removeItem("token");

      // avoid redirect loops caused by the profile check
      const requestUrl = error?.config?.url || "";

      // do not redirect when the failed request was the profile endpoint
      // and avoid reloading if we're already on the login page
      if (
        requestUrl &&
        !requestUrl.includes("/auth/login") &&
        !requestUrl.includes("/auth/register") &&
        !requestUrl.includes("/auth/profile") &&
        window.location.pathname !== "/login"
      ) {
        // use location change sparingly; the router/ctx can also react
        window.location.href = "/login";
      }
    } else if (error?.request && !error?.response) {
      console.error("Network error:", error.request);
    } else {
      console.error("Request error:", error?.message);
    }

    return Promise.reject(error);
  },
);

export default api;
