import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { TopicTile } from "../components/TopicTile.jsx";
import { WordTile } from "../components/WordTile.jsx";

export function TopicsPage({ topics }) {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-gray-950">Chủ đề</h2>
          <p className="mt-1 text-sm text-gray-500">Gia đình, trường học, du lịch, công việc và nhiều nhóm từ HSK.</p>
        </div>
        <Link className="solid-button" to="/learn">
          Học theo bộ lọc
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {topics.map((topic) => (
          <TopicTile key={topic.id} topic={topic} />
        ))}
      </div>
    </div>
  );
}

export function TopicDetailPage({ topics, words, learning }) {
  const { topicId } = useParams();
  const topic = topics.find((item) => item.id === topicId);
  const topicWords = useMemo(() => words.filter((word) => word.topicId === topicId), [words, topicId]);

  if (!topic) {
    return (
      <div className="panel p-8 text-center">
        <h2 className="text-xl font-bold text-gray-950">Không tìm thấy chủ đề</h2>
        <Link className="mt-4 inline-flex text-sm font-bold text-primary" to="/topics">
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <Link className="inline-flex items-center gap-2 text-sm font-bold text-primary" to="/topics">
        <ArrowLeft size={17} />
        Chủ đề
      </Link>
      <section className="panel overflow-hidden">
        <div className="grid gap-0 md:grid-cols-[1fr_340px]">
          <div className="p-6">
            <span className="rounded-lg px-3 py-1.5 text-xs font-bold text-white" style={{ background: topic.accent }}>
              {topic.vocabularyCount || topicWords.length} từ
            </span>
            <h2 className="mt-5 text-3xl font-black text-gray-950">{topic.title}</h2>
            <p className="mt-2 max-w-2xl text-gray-600">{topic.description}</p>
          </div>
          <img className="h-64 w-full object-cover md:h-full" src={topic.image} alt={topic.title} />
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-2">
        {topicWords.map((word) => (
          <WordTile
            key={word.id}
            word={word}
            topic={topic}
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

