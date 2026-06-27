import { Search } from "lucide-react";

export function FilterBar({ search, onSearch, hsk, onHsk, topicId, onTopic, topics }) {
  return (
    <div className="grid gap-3 rounded-lg border border-gray-200 bg-white p-3 md:grid-cols-[1fr_150px_200px]">
      <label className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
        <input
          className="field pl-9"
          value={search}
          onChange={(event) => onSearch(event.target.value)}
          placeholder="Tìm tiếng Trung, pinyin, nghĩa"
        />
      </label>
      <select className="field" value={hsk} onChange={(event) => onHsk(event.target.value)}>
        <option value="">HSK</option>
        {[1, 2, 3, 4, 5, 6].map((level) => (
          <option key={level} value={level}>
            HSK {level}
          </option>
        ))}
      </select>
      <select className="field" value={topicId} onChange={(event) => onTopic(event.target.value)}>
        <option value="">Chủ đề</option>
        {topics.map((topic) => (
          <option key={topic.id} value={topic.id}>
            {topic.title}
          </option>
        ))}
      </select>
    </div>
  );
}

