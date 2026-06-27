export function StatCard({ icon: Icon, label, value, tone = "red" }) {
  const tones = {
    red: "bg-pink-50 text-primary",
    blue: "bg-sky-50 text-sky-700",
    green: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
  };

  return (
    <div className="panel p-4 transition duration-200 ease-out hover:-translate-y-0.5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="mt-1 text-2xl font-bold text-gray-950">{value}</p>
        </div>
        <span
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${tones[tone]}`}
        >
          <Icon size={21} />
        </span>
      </div>
    </div>
  );
}
