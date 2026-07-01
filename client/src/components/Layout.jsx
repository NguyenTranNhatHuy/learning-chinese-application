import {
  BarChart3,
  BookOpen,
  Brain,
  GraduationCap,
  Heart,
  Home,
  LayoutDashboard,
  LogIn,
  LogOut,
  PenTool,
  Search,
  Shield,
  User,
  RotateCcw,
} from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext.jsx";

const navItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/topics", label: "Chủ đề", icon: BookOpen },
  { to: "/learn", label: "Học từ", icon: GraduationCap },
  { to: "/quiz", label: "Quiz", icon: Brain },
  { to: "/review", label: "Ôn tập", icon: RotateCcw },
  { to: "/write", label: "Viết chữ", icon: PenTool },
  { to: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { to: "/favorites", label: "Yêu thích", icon: Heart },
  { to: "/profile", label: "Hồ sơ", icon: User },
];

export function Layout({ metrics, children }) {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-transparent text-ink">
      <div className="mx-auto flex min-h-screen w-full max-w-[1440px] flex-col lg:flex-row">
        <aside className="border-b border-pink-100 bg-white/80 px-4 py-4 backdrop-blur lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:border-b-0 lg:border-r lg:px-5">
          <div className="flex items-center justify-between gap-3 lg:block">
            <NavLink to="/" className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-pink-300 text-lg font-black text-white shadow-lg shadow-pink-200">
                中
              </span>
              <span>
                <span className="block text-base font-bold text-gray-950">
                  Learning Chinese
                </span>
                <span className="block text-xs font-medium text-gray-500">
                  Daily HSK Vocabulary
                </span>
              </span>
            </NavLink>
            <NavLink
              className="icon-button lg:hidden"
              to="/search"
              title="Tìm kiếm"
            >
              <Search size={18} />
            </NavLink>
          </div>

          <nav className="mt-5 flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
            {navItems.map((item) => (
              <NavItem key={item.to} item={item} />
            ))}
            {isAdmin && (
              <NavItem item={{ to: "/admin", label: "Admin", icon: Shield }} />
            )}
          </nav>

          <div className="mt-5 hidden rounded-2xl border border-pink-100 bg-pink-50/70 p-4 lg:block">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-gray-700">Streak</span>
              <span className="font-bold text-primary">
                {user?.streak || 0} ngày
              </span>
            </div>
            <div className="mt-3 h-2 rounded-full bg-pink-100">
              <div
                className="h-2 rounded-full bg-primary"
                style={{ width: `${Math.min(metrics.progress, 100)}%` }}
              />
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs text-gray-500">
              <span>
                <b className="block text-sm text-gray-900">
                  {metrics.learnedCount}
                </b>
                Đã học
              </span>
              <span>
                <b className="block text-sm text-gray-900">
                  {metrics.reviewCount}
                </b>
                Ôn
              </span>
              <span>
                <b className="block text-sm text-gray-900">
                  {metrics.favoriteCount}
                </b>
                Lưu
              </span>
            </div>
          </div>

          <div className="mt-5 hidden lg:block">
            {user ? (
              <button
                className="ghost-button w-full"
                type="button"
                onClick={handleLogout}
              >
                <LogOut size={17} />
                Đăng xuất
              </button>
            ) : (
              <NavLink className="solid-button w-full" to="/login">
                <LogIn size={17} />
                Đăng nhập
              </NavLink>
            )}
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-pink-100 bg-white/80 px-4 py-3 backdrop-blur-xl md:px-8">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-primary">
                  Học mỗi ngày
                </p>
                <h1 className="truncate text-lg font-bold text-gray-950 md:text-2xl">
                  Từ vựng, flashcard, quiz
                </h1>
              </div>
              <div className="flex items-center gap-2">
                <NavLink
                  className="icon-button hidden sm:inline-flex"
                  to="/search"
                  title="Tìm kiếm"
                >
                  <Search size={18} />
                </NavLink>
                <NavLink
                  className="ghost-button hidden sm:inline-flex"
                  to="/learn"
                >
                  <GraduationCap size={17} />
                  Học ngay
                </NavLink>
                {user ? (
                  <button
                    className="icon-button lg:hidden"
                    type="button"
                    onClick={handleLogout}
                    title="Đăng xuất"
                  >
                    <LogOut size={18} />
                  </button>
                ) : (
                  <NavLink
                    className="icon-button lg:hidden"
                    to="/login"
                    title="Đăng nhập"
                  >
                    <LogIn size={18} />
                  </NavLink>
                )}
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-5 md:px-8 md:py-8">
            {children || <Outlet />}
          </main>
        </div>
      </div>
    </div>
  );
}

function NavItem({ item }) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.to}
      className={({ isActive }) =>
        [
          "focus-ring inline-flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition duration-200 ease-out",
          isActive
            ? "bg-pink-50 text-primary"
            : "text-gray-600 hover:bg-pink-50 hover:text-gray-950",
        ].join(" ")
      }
    >
      <Icon size={18} />
      <span>{item.label}</span>
    </NavLink>
  );
}
