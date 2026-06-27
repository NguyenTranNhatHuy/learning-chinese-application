import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { http } from "../api/http.js";

const AuthContext = createContext(null);

const storageKey = "learning_chinese_user";
const accessTokenKey = "learning_chinese_access_token";
const refreshTokenKey = "learning_chinese_refresh_token";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(storageKey);
    return stored ? JSON.parse(stored) : null;
  });
  const [authError, setAuthError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem(accessTokenKey);

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const { data } = await http.get("/auth/profile");
        localStorage.setItem(storageKey, JSON.stringify(data.user));
        setUser(data.user);
      } catch {
        clearAuthStorage();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    void restoreSession();
  }, []);

  async function login({ email, password }) {
    setAuthError("");

    try {
      const { data } = await http.post("/auth/login", { email, password });
      persistAuth(data);
      setUser(data.user);
      toast.success("Đăng nhập thành công");
      return data.user;
    } catch (error) {
      const message = error.response?.data?.message || "Không đăng nhập được.";
      setAuthError(message);
      toast.error(message);
      throw error;
    }
  }

  async function register({ name, email, password }) {
    setAuthError("");

    try {
      const { data } = await http.post("/auth/register", {
        name,
        email,
        password,
      });
      persistAuth(data);
      setUser(data.user);
      toast.success("Tạo tài khoản thành công");
      return data.user;
    } catch (error) {
      const message =
        error.response?.data?.message || "Không tạo được tài khoản.";
      setAuthError(message);
      toast.error(message);
      throw error;
    }
  }

  async function logout() {
    try {
      await http.post("/auth/logout");
    } catch {
      // ignore
    } finally {
      clearAuthStorage();
      setUser(null);
      toast.info("Đã đăng xuất");
    }
  }

  const value = useMemo(
    () => ({
      user,
      authError,
      isLoading,
      login,
      register,
      logout,
      isAdmin: user?.role === "admin",
    }),
    [user, authError, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function persistAuth(data) {
  localStorage.setItem(accessTokenKey, data.accessToken);
  localStorage.setItem(refreshTokenKey, data.refreshToken);
  localStorage.setItem(storageKey, JSON.stringify(data.user));
}

function clearAuthStorage() {
  localStorage.removeItem(accessTokenKey);
  localStorage.removeItem(refreshTokenKey);
  localStorage.removeItem(storageKey);
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}
