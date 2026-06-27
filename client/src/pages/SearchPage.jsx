import { useMemo, useState } from "react";
import { FilterBar } from "../components/FilterBar.jsx";
import { WordTile } from "../components/WordTile.jsx";

export function SearchPage({ topics, words, learning }) {
  const [search, setSearch] = useState("");
  const [hsk, setHsk] = useState("");
  const [topicId, setTopicId] = useState("");

  const results = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return words.filter((word) => {
      const matchesSearch =
        !keyword ||
        [word.chinese, word.pinyin, word.meaning, word.example, topics.find((topic) => topic.id === word.topicId)?.title]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(keyword));
      const matchesHsk = !hsk || Number(word.hskLevel) === Number(hsk);
      const matchesTopic = !topicId || word.topicId === topicId;
      return matchesSearch && matchesHsk && matchesTopic;
    });
  }, [words, topics, search, hsk, topicId]);

  return (
    <div className="space-y-5">
      <FilterBar search={search} onSearch={setSearch} hsk={hsk} onHsk={setHsk} topicId={topicId} onTopic={setTopicId} topics={topics} />
      <div className="grid gap-4 xl:grid-cols-2">
        {results.map((word) => (
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

