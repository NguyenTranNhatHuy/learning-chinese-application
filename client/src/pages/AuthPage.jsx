import { useState } from "react";
import { Globe, LogIn, UserPlus } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext.jsx";

export function AuthPage() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, register, authError, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  async function submit(event) {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      if (mode === "login") {
        await login(form);
      } else {
        await register(form);
      }
      navigate("/");
    } catch {
      // handled in context
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <section className="panel p-5">
        <div className="flex rounded-xl bg-pink-50 p-1">
          <button
            className={`focus-ring flex-1 rounded-lg px-3 py-2 text-sm font-bold ${mode === "login" ? "bg-white text-primary shadow-sm" : "text-gray-600"}`}
            type="button"
            onClick={() => setMode("login")}
          >
            Đăng nhập
          </button>
          <button
            className={`focus-ring flex-1 rounded-lg px-3 py-2 text-sm font-bold ${mode === "register" ? "bg-white text-primary shadow-sm" : "text-gray-600"}`}
            type="button"
            onClick={() => setMode("register")}
          >
            Đăng ký
          </button>
        </div>

        <form className="mt-5 space-y-3" onSubmit={submit}>
          {mode === "register" && (
            <input
              className="field"
              placeholder="Tên"
              value={form.name}
              onChange={(event) =>
                setForm((value) => ({ ...value, name: event.target.value }))
              }
            />
          )}
          <input
            className="field"
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(event) =>
              setForm((value) => ({ ...value, email: event.target.value }))
            }
          />
          <input
            className="field"
            placeholder="Mật khẩu"
            type="password"
            value={form.password}
            onChange={(event) =>
              setForm((value) => ({ ...value, password: event.target.value }))
            }
          />
          {authError && (
            <p className="text-sm font-semibold text-primary">{authError}</p>
          )}
          <button
            className="solid-button w-full"
            type="submit"
            disabled={isSubmitting}
          >
            {mode === "login" ? <LogIn size={17} /> : <UserPlus size={17} />}
            {mode === "login" ? "Đăng nhập" : "Tạo tài khoản"}
          </button>
          {import.meta.env.VITE_GOOGLE_CLIENT_ID ? (
            <div className="mt-3">
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  if (!credentialResponse?.credential) return;
                  setIsSubmitting(true);
                  try {
                    await loginWithGoogle(credentialResponse.credential);
                    navigate("/");
                  } catch {
                    // handled in auth context
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
                onError={() => {
                  setAuthError("Đăng nhập Google không thành công.");
                }}
              />
            </div>
          ) : (
            <button
              className="outline-button mt-3 w-full"
              type="button"
              disabled
            >
              <Globe size={17} /> Đăng nhập với Google (chưa cấu hình)
            </button>
          )}
        </form>
      </section>
    </div>
  );
}
