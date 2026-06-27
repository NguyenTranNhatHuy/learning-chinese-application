import { ArrowRight, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

export function TopicTile({ topic }) {
  return (
    <Link
      className="panel group block overflow-hidden transition duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(244,114,182,0.16)]"
      to={`/topics/${topic.id}`}
    >
      <div className="aspect-[16/9] overflow-hidden bg-pink-50">
        <img
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          src={topic.image}
          alt={topic.title}
        />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-gray-950">{topic.title}</h3>
            <p className="mt-1 line-clamp-2 text-sm text-gray-500">
              {topic.description}
            </p>
          </div>
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white shadow-sm"
            style={{
              background: `linear-gradient(135deg, ${topic.accent || "#f472b6"}, #f9a8d4)`,
            }}
          >
            <BookOpen size={18} />
          </span>
        </div>
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="font-semibold text-gray-700">
            {topic.vocabularyCount || 0} từ
          </span>
          <span className="inline-flex items-center gap-1 font-semibold text-primary">
            Mở
            <ArrowRight size={16} />
          </span>
        </div>
      </div>
    </Link>
  );
}
