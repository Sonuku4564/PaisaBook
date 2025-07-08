import { createContext, useState, useContext } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_URL = "http://localhost:3000/api/auth";

  // Ensure we safely parse localStorage items if they exist
  const getStoredUser = () => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (err) {
      console.error("Error parsing stored user:", err);
      return null;
    }
  };

  const getStoredToken = () => {
    try {
      const storedToken = localStorage.getItem("token");
      return storedToken || null;
    } catch (err) {
      console.error("Error parsing stored token:", err);
      return null;
    }
  };

  const signup = async ({ email, name, password }) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/signup`, { email, password, name }, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const { token, user } = res.data;
      setUser(user);
      setToken(token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
    } catch (error) {
      console.error("Registration error:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/login`, { email, password });
      const { token, user } = res.data;
      setUser(user);
      setToken(token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Login failed!");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  const getCurrentUser = async () => {
    setLoading(true);
    try {
      const storedToken = getStoredToken();

      if (!storedToken) {
        console.warn("No token found in localStorage");
        setUser(null);
        return null;
      }

      const res = await axios.get(`${API_URL}/me`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      setUser(res.data);
      return res.data;
    } catch (err) {
      console.error("Error fetching current user:", err.response?.data || err.message);
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout, getCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
