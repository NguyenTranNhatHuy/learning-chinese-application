import { ArrowRight, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

export function TopicTile({ topic }) {
  return (
    <Link className="panel group block overflow-hidden transition hover:-translate-y-0.5 hover:shadow-lg" to={`/topics/${topic.id}`}>
      <div className="aspect-[16/9] overflow-hidden bg-gray-100">
        <img className="h-full w-full object-cover transition duration-300 group-hover:scale-105" src={topic.image} alt={topic.title} />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-gray-950">{topic.title}</h3>
            <p className="mt-1 line-clamp-2 text-sm text-gray-500">{topic.description}</p>
          </div>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white" style={{ background: topic.accent }}>
            <BookOpen size={18} />
          </span>
        </div>
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="font-semibold text-gray-700">{topic.vocabularyCount || 0} từ</span>
          <span className="inline-flex items-center gap-1 font-semibold text-primary">
            Mở
            <ArrowRight size={16} />
          </span>
        </div>
      </div>
    </Link>
  );
}

