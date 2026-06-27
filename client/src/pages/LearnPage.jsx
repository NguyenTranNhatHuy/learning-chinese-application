import { useMemo, useState } from "react";
import { Check, Eye, EyeOff, Heart, Shuffle, SkipBack, SkipForward, Volume2 } from "lucide-react";
import { FilterBar } from "../components/FilterBar.jsx";
import { speakChinese } from "../utils/speech.js";

export function LearnPage({ topics, words, learning }) {
  const [search, setSearch] = useState("");
  const [hsk, setHsk] = useState("");
  const [topicId, setTopicId] = useState("");
  const [index, setIndex] = useState(0);
  const [showPinyin, setShowPinyin] = useState(true);
  const [showMeaning, setShowMeaning] = useState(true);
  const [isFlipped, setIsFlipped] = useState(false);

  const filteredWords = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return words.filter((word) => {
      const matchesSearch =
        !keyword ||
        [word.chinese, word.pinyin, word.meaning, word.example].some((value) => value?.toLowerCase().includes(keyword));
      const matchesHsk = !hsk || Number(word.hskLevel) === Number(hsk);
      const matchesTopic = !topicId || word.topicId === topicId;
      return matchesSearch && matchesHsk && matchesTopic;
    });
  }, [words, search, hsk, topicId]);

  const current = filteredWords[index % Math.max(filteredWords.length, 1)];
  const topic = topics.find((item) => item.id === current?.topicId);

  function move(step) {
    setIsFlipped(false);
    setIndex((value) => {
      const total = filteredWords.length || 1;
      return (value + step + total) % total;
    });
  }

  function shuffle() {
    setIsFlipped(false);
    setIndex(Math.floor(Math.random() * Math.max(filteredWords.length, 1)));
  }

  return (
    <div className="space-y-5">
      <FilterBar
        search={search}
        onSearch={(value) => {
          setSearch(value);
          setIndex(0);
        }}
        hsk={hsk}
        onHsk={(value) => {
          setHsk(value);
          setIndex(0);
        }}
        topicId={topicId}
        onTopic={(value) => {
          setTopicId(value);
          setIndex(0);
        }}
        topics={topics}
      />

      {!current ? (
        <div className="panel p-8 text-center text-gray-600">Không có từ phù hợp.</div>
      ) : (
        <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="panel overflow-hidden">
            <div className="grid min-h-[520px] md:grid-cols-[1fr_320px]">
              <button
                className="flex min-h-[360px] flex-col items-center justify-center p-6 text-center"
                type="button"
                onClick={() => setIsFlipped((value) => !value)}
                title="Flip card"
              >
                {!isFlipped ? (
                  <>
                    <span className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-bold text-primary">HSK {current.hskLevel}</span>
                    <span className="hanzi mt-8 block text-7xl font-black text-gray-950 md:text-8xl">{current.chinese}</span>
                    {showPinyin && <span className="mt-4 text-xl font-bold text-primary">{current.pinyin}</span>}
                    {showMeaning && <span className="mt-2 text-lg text-gray-600">{current.meaning}</span>}
                  </>
                ) : (
                  <>
                    <span className="text-sm font-bold text-primary">{current.type}</span>
                    <span className="mt-5 max-w-lg text-2xl font-bold text-gray-950">{current.example}</span>
                    <span className="mt-3 text-base font-semibold text-gray-500">{current.examplePinyin}</span>
                    <span className="mt-2 max-w-lg text-gray-600">{current.exampleMeaning}</span>
                  </>
                )}
              </button>

              <div className="border-t border-gray-200 bg-gray-50 p-5 md:border-l md:border-t-0">
                <img className="h-44 w-full rounded-lg object-cover" src={current.image} alt={current.meaning} />
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <Info label="Bộ thủ" value={current.radical || "-"} />
                  <Info label="Số nét" value={current.strokes || "-"} />
                  <Info label="Chủ đề" value={topic?.title || "-"} />
                  <Info label="Loại từ" value={current.type} />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {current.relatedWords?.map((item) => (
                    <span key={item} className="rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-gray-700">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-3">
            <div className="panel p-4">
              <div className="grid grid-cols-3 gap-2">
                <button className="icon-button w-full" type="button" onClick={() => move(-1)} title="Previous">
                  <SkipBack size={18} />
                </button>
                <button className="icon-button w-full" type="button" onClick={() => speakChinese(current.chinese)} title="Phát âm">
                  <Volume2 size={18} />
                </button>
                <button className="icon-button w-full" type="button" onClick={() => move(1)} title="Next">
                  <SkipForward size={18} />
                </button>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button className="ghost-button px-3" type="button" onClick={() => setShowPinyin((value) => !value)}>
                  {showPinyin ? <EyeOff size={17} /> : <Eye size={17} />}
                  Pinyin
                </button>
                <button className="ghost-button px-3" type="button" onClick={() => setShowMeaning((value) => !value)}>
                  {showMeaning ? <EyeOff size={17} /> : <Eye size={17} />}
                  Nghĩa
                </button>
              </div>
              <button className="mt-3 ghost-button w-full" type="button" onClick={shuffle}>
                <Shuffle size={17} />
                Random
              </button>
            </div>

            <div className="panel p-4">
              <button className="solid-button w-full" type="button" onClick={() => learning.markLearned(current.id)}>
                <Check size={17} />
                {learning.learnedIds.includes(current.id) ? "Đã học" : "Đánh dấu đã học"}
              </button>
              <button className="mt-3 ghost-button w-full" type="button" onClick={() => learning.toggleFavorite(current.id)}>
                <Heart size={17} fill={learning.favoriteIds.includes(current.id) ? "currentColor" : "none"} />
                Favorite
              </button>
            </div>
          </aside>
        </section>
      )}
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-lg bg-white p-3">
      <p className="text-xs font-semibold text-gray-400">{label}</p>
      <p className="mt-1 font-bold text-gray-800">{value}</p>
    </div>
  );
}

