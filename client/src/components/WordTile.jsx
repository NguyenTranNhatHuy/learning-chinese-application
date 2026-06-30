import { Check, Heart, Volume2 } from "lucide-react";
import { LazyImage } from "./LazyImage.jsx";
import { speakChinese } from "../utils/speech.js";

export function WordTile({
  word,
  topic,
  isFavorite,
  isLearned,
  onFavorite,
  onLearned,
}) {
  return (
    <article className="panel overflow-hidden transition duration-200 ease-out hover:-translate-y-0.5">
      <div className="grid gap-0 sm:grid-cols-[150px_1fr]">
        <div className="overflow-hidden bg-pink-50">
          <LazyImage
            className="h-40 w-full object-cover transition duration-300 hover:scale-[1.02] sm:h-full"
            src={word.image}
            alt={word.meaning}
          />
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="hanzi text-4xl font-bold text-gray-950">
                {word.chinese}
              </p>
              <p className="mt-1 text-sm font-semibold text-primary">
                {word.pinyin}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                className="icon-button"
                type="button"
                onClick={() => speakChinese(word.chinese)}
                title="Phát âm"
              >
                <Volume2 size={18} />
              </button>
              <button
                className={`icon-button ${isFavorite ? "border-primary text-primary" : ""}`}
                type="button"
                onClick={() => onFavorite(word.id)}
                title="Yêu thích"
              >
                <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
              </button>
            </div>
          </div>
          <p className="mt-3 text-sm text-gray-500">{word.meaning}</p>
          <p className="mt-3 text-sm text-gray-700">{word.example}</p>
          <p className="text-xs text-gray-500">{word.examplePinyin}</p>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-semibold">
            <span className="rounded-lg bg-pink-50 px-2.5 py-1 text-primary">
              HSK {word.hskLevel}
            </span>
            <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-gray-700">
              {word.type}
            </span>
            <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-gray-700">
              {topic?.title || "Chủ đề"}
            </span>
          </div>
          <button
            className="mt-4 ghost-button"
            type="button"
            onClick={() => onLearned(word.id)}
          >
            <Check size={17} />
            {isLearned ? "Đã học" : "Đánh dấu học"}
          </button>
        </div>
      </div>
    </article>
  );
}
