import { RotateCcw, ThumbsDown, ThumbsUp } from "lucide-react";
import { WordTile } from "../components/WordTile.jsx";

export function ReviewPage({ topics, words, learning }) {
  const reviewWords = words.filter(
    (word) => learning.wrongIds.includes(word.id) || (!learning.learnedIds.includes(word.id) && word.hskLevel <= 2)
  );

  return (
    <div className="space-y-5">
      <section className="panel p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-black text-gray-950">Ôn tập</h2>
            <p className="mt-1 text-sm text-gray-500">Ưu tiên từ sai nhiều, từ chưa học và HSK thấp.</p>
          </div>
          <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-50 text-primary">
            <RotateCcw size={22} />
          </span>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <ReviewBucket icon={ThumbsDown} label="Sai nhiều" value={learning.wrongIds.length} tone="red" />
        <ReviewBucket icon={RotateCcw} label="Đã quên" value={reviewWords.length} tone="blue" />
        <ReviewBucket icon={ThumbsUp} label="Sẵn sàng" value={learning.learnedIds.length} tone="green" />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {reviewWords.map((word) => (
          <WordTile
            key={word.id}
            word={word}
            topic={topics.find((topic) => topic.id === word.topicId)}
            isFavorite={learning.favoriteIds.includes(word.id)}
            isLearned={learning.learnedIds.includes(word.id)}
            onFavorite={learning.toggleFavorite}
            onLearned={learning.markLearned}
          />
        ))}
      </div>
    </div>
  );
}

function ReviewBucket({ icon: Icon, label, value, tone }) {
  const colors = {
    red: "bg-red-50 text-primary",
    blue: "bg-blue-50 text-blue-700",
    green: "bg-emerald-50 text-emerald-700"
  };

  return (
    <div className="panel p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="mt-1 text-2xl font-bold text-gray-950">{value}</p>
        </div>
        <span className={`flex h-11 w-11 items-center justify-center rounded-lg ${colors[tone]}`}>
          <Icon size={20} />
        </span>
      </div>
    </div>
  );
}

