import { useState } from "react";
import { LogIn, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext.jsx";

export function AuthPage() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "user@learningchinese.dev", password: "User123!" });
  const [error, setError] = useState("");
  const { login, register } = useAuth();
  const navigate = useNavigate();

  async function submit(event) {
    event.preventDefault();
    setError("");

    try {
      if (mode === "login") await login(form);
      else await register(form);
      navigate("/");
    } catch {
      setError("Không thể xử lý đăng nhập.");
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <section className="panel p-5">
        <div className="flex rounded-lg bg-gray-100 p-1">
          <button
            className={`focus-ring flex-1 rounded-md px-3 py-2 text-sm font-bold ${mode === "login" ? "bg-white text-primary shadow-sm" : "text-gray-600"}`}
            type="button"
            onClick={() => setMode("login")}
          >
            Đăng nhập
          </button>
          <button
            className={`focus-ring flex-1 rounded-md px-3 py-2 text-sm font-bold ${mode === "register" ? "bg-white text-primary shadow-sm" : "text-gray-600"}`}
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
              onChange={(event) => setForm((value) => ({ ...value, name: event.target.value }))}
            />
          )}
          <input
            className="field"
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(event) => setForm((value) => ({ ...value, email: event.target.value }))}
          />
          <input
            className="field"
            placeholder="Mật khẩu"
            type="password"
            value={form.password}
            onChange={(event) => setForm((value) => ({ ...value, password: event.target.value }))}
          />
          {error && <p className="text-sm font-semibold text-primary">{error}</p>}
          <button className="solid-button w-full" type="submit">
            {mode === "login" ? <LogIn size={17} /> : <UserPlus size={17} />}
            {mode === "login" ? "Đăng nhập" : "Tạo tài khoản"}
          </button>
        </form>
      </section>
    </div>
  );
}

