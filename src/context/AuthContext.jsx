import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check for stored token first
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
          // Set the token in the Authorization header
          api.defaults.headers.common["Authorization"] =
            `Bearer ${storedToken}`;
        }

        const { data } = await api.get("/auth/profile");
        setUser(data);
        setError(null);
      } catch (_error) {
        console.log("Not authenticated");
        setUser(null);
        localStorage.removeItem("token");
        delete api.defaults.headers.common["Authorization"];
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const url =
        "/auth/login?x-vercel-set-bypass-cookie=true&x-vercel-protection-bypass=" +
        proccess.env.VERCEL_AUTOMATION_BYPASS_SECRET;
      console.log(url);
      const { data } = await api.post(url, { email, password });

      // Store token in localStorage
      if (data.token) {
        localStorage.setItem("token", data.token);
        api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
      }

      setUser(data);
      setError(null);
      return data;
    } catch (err) {
      let errorMsg = "Login failed. Please try again.";

      if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      } else if (err.request && !err.response) {
        errorMsg =
          "Network error: Cannot reach server. Check your internet connection.";
      } else if (err.message) {
        errorMsg = err.message;
      }

      setError(errorMsg);
      throw err;
    }
  };

  const register = async (username, email, password, role) => {
    try {
      const { data } = await api.post("/auth/register", {
        username,
        email,
        password,
        role,
      });

      // Store token in localStorage
      if (data.token) {
        localStorage.setItem("token", data.token);
        api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
      }

      setUser(data);
      setError(null);
      return data;
    } catch (err) {
      let errorMsg = "Registration failed. Please try again.";

      if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      } else if (err.request && !err.response) {
        errorMsg =
          "Network error: Cannot reach server. Check your internet connection.";
      } else if (err.message) {
        errorMsg = err.message;
      }

      setError(errorMsg);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.log("Logout error:", err);
    } finally {
      setUser(null);
      localStorage.removeItem("token");
      delete api.defaults.headers.common["Authorization"];
      setError(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, loading, error, setError }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
