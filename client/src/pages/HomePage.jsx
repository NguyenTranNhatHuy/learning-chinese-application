import { BarChart3, BookOpen, Flame, Heart, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { StatCard } from "../components/StatCard.jsx";
import { TopicTile } from "../components/TopicTile.jsx";
import { WordTile } from "../components/WordTile.jsx";

export function HomePage({ topics, words, learning, user }) {
  const todayWord = words[0];
  const todayTopic = topics.find((topic) => topic.id === todayWord?.topicId);

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={BookOpen} label="Từ đã học" value={learning.metrics.learnedCount} tone="red" />
        <StatCard icon={Trophy} label="Tiến độ" value={`${learning.metrics.progress}%`} tone="green" />
        <StatCard icon={Heart} label="Yêu thích" value={learning.metrics.favoriteCount} tone="blue" />
        <StatCard icon={Flame} label="Streak" value={`${user?.streak || 0} ngày`} tone="amber" />
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.1fr)_380px]">
        <div className="panel overflow-hidden">
          <div className="grid min-h-[320px] gap-0 md:grid-cols-[1fr_260px]">
            <div className="p-5 md:p-7">
              <div className="flex flex-wrap gap-2 text-xs font-semibold">
                <span className="rounded-lg bg-red-50 px-3 py-1.5 text-primary">HSK mỗi ngày</span>
                <span className="rounded-lg bg-emerald-50 px-3 py-1.5 text-emerald-700">Spaced repetition</span>
              </div>
              <h2 className="mt-5 max-w-2xl text-3xl font-black leading-tight text-gray-950 md:text-5xl">
                {todayWord?.chinese}
              </h2>
              <p className="mt-3 text-lg font-semibold text-primary">{todayWord?.pinyin}</p>
              <p className="mt-2 max-w-xl text-base text-gray-600">{todayWord?.meaning}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link className="solid-button" to="/learn">
                  <BookOpen size={18} />
                  Học từ này
                </Link>
                <Link className="ghost-button" to="/quiz">
                  <BarChart3 size={18} />
                  Làm quiz
                </Link>
              </div>
            </div>
            <img className="h-64 w-full object-cover md:h-full" src={todayWord?.image} alt={todayWord?.meaning} />
          </div>
        </div>

        <div className="panel p-5">
          <h2 className="text-lg font-bold text-gray-950">Từ học nhiều</h2>
          <div className="mt-4 space-y-3">
            {words.slice(1, 5).map((word) => (
              <div key={word.id} className="flex items-center gap-3 rounded-lg border border-gray-100 p-3">
                <span className="hanzi flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 text-2xl font-bold text-gray-950">
                  {word.chinese}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-gray-950">{word.meaning}</p>
                  <p className="text-sm text-gray-500">{word.pinyin}</p>
                </div>
                <span className="rounded-lg bg-red-50 px-2.5 py-1 text-xs font-bold text-primary">HSK {word.hskLevel}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-gray-950">Chủ đề nổi bật</h2>
          <Link className="text-sm font-bold text-primary" to="/topics">
            Xem tất cả
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {topics.slice(0, 4).map((topic) => (
            <TopicTile key={topic.id} topic={topic} />
          ))}
        </div>
      </section>

      {todayWord && (
        <section>
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-gray-950">Từ mới hôm nay</h2>
            <span className="text-sm font-semibold text-gray-500">{todayTopic?.title}</span>
          </div>
          <WordTile
            word={todayWord}
            topic={todayTopic}
            isFavorite={learning.favoriteIds.includes(todayWord.id)}
            isLearned={learning.learnedIds.includes(todayWord.id)}
            onFavorite={learning.toggleFavorite}
            onLearned={learning.markLearned}
          />
        </section>
      )}
    </div>
  );
}

