import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { WordTile } from "../components/WordTile.jsx";

export function FavoritesPage({ topics, words, learning }) {
  const favorites = words.filter((word) => learning.favoriteIds.includes(word.id));

  if (!favorites.length) {
    return (
      <div className="panel p-8 text-center">
        <Heart className="mx-auto text-primary" size={34} />
        <h2 className="mt-3 text-xl font-bold text-gray-950">Chưa có từ yêu thích</h2>
        <Link className="mt-4 inline-flex text-sm font-bold text-primary" to="/learn">
          Chọn từ để lưu
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-black text-gray-950">Từ yêu thích</h2>
        <p className="mt-1 text-sm text-gray-500">{favorites.length} từ đang được lưu.</p>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        {favorites.map((word) => (
          <WordTile
            key={word.id}
            word={word}
            topic={topics.find((topic) => topic.id === word.topicId)}
            isFavorite
            isLearned={learning.learnedIds.includes(word.id)}
            onFavorite={learning.toggleFavorite}
            onLearned={learning.markLearned}
          />
        ))}
      </div>
    </div>
  );
}

