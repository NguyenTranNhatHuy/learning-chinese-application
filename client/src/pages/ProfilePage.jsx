import { CalendarDays, Mail, UserRound } from "lucide-react";
import { useAuth } from "../state/AuthContext.jsx";

export function ProfilePage({ topics, learning }) {
  const { user, switchRole } = useAuth();

  if (!user) {
    return (
      <div className="panel p-8 text-center">
        <h2 className="text-xl font-bold text-gray-950">Bạn chưa đăng nhập</h2>
      </div>
    );
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[360px_1fr]">
      <section className="panel p-5">
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-red-50 text-primary">
            <UserRound size={34} />
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-950">{user.name}</h2>
            <p className="text-sm font-semibold text-primary">{user.role}</p>
          </div>
        </div>
        <div className="mt-6 space-y-3 text-sm">
          <p className="flex items-center gap-2 text-gray-600">
            <Mail size={17} />
            {user.email}
          </p>
          <p className="flex items-center gap-2 text-gray-600">
            <CalendarDays size={17} />
            {user.joinedAt || user.createdAt || "Demo account"}
          </p>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-2">
          <button className="ghost-button" type="button" onClick={() => switchRole("user")}>
            User
          </button>
          <button className="ghost-button" type="button" onClick={() => switchRole("admin")}>
            Admin
          </button>
        </div>
      </section>

      <section className="panel overflow-hidden">
        <div className="grid divide-y divide-gray-200 md:grid-cols-4 md:divide-x md:divide-y-0">
          <ProfileStat label="Từ đã học" value={learning.metrics.learnedCount} />
          <ProfileStat label="Chủ đề" value={topics.length} />
          <ProfileStat label="Quiz" value={12} />
          <ProfileStat label="Streak" value={user.streak || 0} />
        </div>
        <div className="border-t border-gray-200 p-5">
          <h3 className="font-bold text-gray-950">Hồ sơ học tập</h3>
          <div className="mt-4 h-2 rounded-full bg-gray-200">
            <div className="h-2 rounded-full bg-primary" style={{ width: `${learning.metrics.progress}%` }} />
          </div>
          <p className="mt-3 text-sm text-gray-500">Tiến độ hiện tại: {learning.metrics.progress}%.</p>
        </div>
      </section>
    </div>
  );
}

function ProfileStat({ label, value }) {
  return (
    <div className="p-5">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="mt-2 text-2xl font-black text-gray-950">{value}</p>
    </div>
  );
}

