import { createContext, useContext, useMemo, useState } from "react";
import { http } from "../api/http.js";
import { demoUsers } from "../data/mockData.js";

const AuthContext = createContext(null);

const storageKey = "learning_chinese_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(storageKey);
    return stored ? JSON.parse(stored) : demoUsers[0];
  });
  const [authError, setAuthError] = useState("");

  async function login({ email, password }) {
    setAuthError("");

    try {
      const { data } = await http.post("/auth/login", { email, password });
      localStorage.setItem("learning_chinese_access_token", data.accessToken);
      localStorage.setItem("learning_chinese_refresh_token", data.refreshToken);
      localStorage.setItem(storageKey, JSON.stringify(data.user));
      setUser(data.user);
      return data.user;
    } catch (error) {
      const demo = demoUsers.find((item) => item.email === email);

      if (!demo) {
        setAuthError(error.response?.data?.message || "Không đăng nhập được.");
        throw error;
      }

      localStorage.setItem(storageKey, JSON.stringify(demo));
      localStorage.setItem("learning_chinese_access_token", "demo-token");
      setUser(demo);
      return demo;
    }
  }

  async function register({ name, email, password }) {
    setAuthError("");

    try {
      const { data } = await http.post("/auth/register", { name, email, password });
      localStorage.setItem("learning_chinese_access_token", data.accessToken);
      localStorage.setItem("learning_chinese_refresh_token", data.refreshToken);
      localStorage.setItem(storageKey, JSON.stringify(data.user));
      setUser(data.user);
      return data.user;
    } catch (error) {
      const demo = { id: crypto.randomUUID(), name, email, role: "user", streak: 1, avatar: "" };
      localStorage.setItem(storageKey, JSON.stringify(demo));
      localStorage.setItem("learning_chinese_access_token", "demo-token");
      setUser(demo);
      return demo;
    }
  }

  function logout() {
    localStorage.removeItem("learning_chinese_access_token");
    localStorage.removeItem("learning_chinese_refresh_token");
    localStorage.removeItem(storageKey);
    setUser(null);
  }

  function switchRole(role) {
    const nextUser = role === "admin" ? demoUsers[1] : demoUsers[0];
    localStorage.setItem(storageKey, JSON.stringify(nextUser));
    setUser(nextUser);
  }

  const value = useMemo(
    () => ({ user, authError, login, register, logout, switchRole, isAdmin: user?.role === "admin" }),
    [user, authError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}

