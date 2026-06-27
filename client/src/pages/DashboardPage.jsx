import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Award, BookMarked, Clock3, Target } from "lucide-react";
import { StatCard } from "../components/StatCard.jsx";
import { studyHistory } from "../data/mockData.js";

export function DashboardPage({ topics, words, learning, user }) {
  const completedTopics = topics.filter((topic) => {
    const topicWords = words.filter((word) => word.topicId === topic.id);
    return topicWords.length > 0 && topicWords.every((word) => learning.learnedIds.includes(word.id));
  }).length;

  const averageScore = studyHistory.length
    ? Math.round(studyHistory.reduce((sum, item) => sum + item.score, 0) / studyHistory.length)
    : 0;

  return (
    <div className="space-y-5">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={BookMarked} label="Tổng từ đã học" value={learning.metrics.learnedCount} tone="red" />
        <StatCard icon={Target} label="Điểm trung bình" value={`${averageScore}%`} tone="green" />
        <StatCard icon={Award} label="Chủ đề hoàn thành" value={completedTopics} tone="blue" />
        <StatCard icon={Clock3} label="Streak" value={`${user?.streak || 0} ngày`} tone="amber" />
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="panel p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-gray-950">Biểu đồ học</h2>
            <span className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-bold text-gray-600">7 ngày</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={studyHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="day" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip />
                <Area type="monotone" dataKey="words" name="Từ" stroke="#E53935" fill="#FEE2E2" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel p-5">
          <h2 className="text-lg font-bold text-gray-950">Quiz</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={studyHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="day" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip />
                <Bar dataKey="score" name="Điểm" fill="#2563EB" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="panel overflow-hidden">
        <div className="grid divide-y divide-gray-200 md:grid-cols-3 md:divide-x md:divide-y-0">
          {topics.slice(0, 3).map((topic) => {
            const total = words.filter((word) => word.topicId === topic.id).length;
            const learned = words.filter((word) => word.topicId === topic.id && learning.learnedIds.includes(word.id)).length;
            const percent = total ? Math.round((learned / total) * 100) : 0;

            return (
              <div key={topic.id} className="p-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-950">{topic.title}</h3>
                  <span className="text-sm font-bold text-primary">{percent}%</span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-gray-200">
                  <div className="h-2 rounded-full" style={{ width: `${percent}%`, background: topic.accent }} />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  {learned}/{total} từ
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

