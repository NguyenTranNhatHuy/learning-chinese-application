import { useMemo, useState } from "react";
import { CheckCircle2, Headphones, ListChecks, XCircle } from "lucide-react";
import { LazyImage } from "../components/LazyImage.jsx";
import { speakChinese } from "../utils/speech.js";

const quizTypes = [
  { value: "meaning", label: "Chọn nghĩa" },
  { value: "pinyin", label: "Chọn pinyin" },
  { value: "hanzi", label: "Chọn chữ Hán" },
  { value: "audio", label: "Nghe chọn đáp án" }
];

export function QuizPage({ quizzes, words, learning }) {
  const [type, setType] = useState("meaning");
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState("");
  const [result, setResult] = useState(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const filtered = useMemo(() => {
    const pool = quizzes.filter((quiz) => quiz.type === type);
    return pool.length ? pool : quizzes.slice(0, 6);
  }, [quizzes, type]);

  const quiz = filtered[index % Math.max(filtered.length, 1)];
  const word = words.find((item) => item.id === quiz?.vocabularyId);

  function submit(answer) {
    const isCorrect = answer === quiz.answer;
    setSelected(answer);
    setResult(isCorrect);
    setScore((value) => ({ correct: value.correct + (isCorrect ? 1 : 0), total: value.total + 1 }));

    if (word) {
      if (isCorrect) learning.markLearned(word.id);
      else learning.markWrong(word.id);
    }
  }

  function next() {
    setIndex((value) => (value + 1) % Math.max(filtered.length, 1));
    setSelected("");
    setResult(null);
  }

  return (
    <div className="space-y-5">
      <section className="grid gap-3 md:grid-cols-[1fr_auto]">
        <div className="flex flex-wrap gap-2">
          {quizTypes.map((item) => (
            <button
              key={item.value}
              className={`ghost-button ${type === item.value ? "border-primary text-primary" : ""}`}
              type="button"
              onClick={() => {
                setType(item.value);
                setIndex(0);
                setSelected("");
                setResult(null);
              }}
            >
              {item.value === "audio" ? <Headphones size={17} /> : <ListChecks size={17} />}
              {item.label}
            </button>
          ))}
        </div>
        <div className="panel flex items-center justify-center px-4 py-2 text-sm font-bold text-gray-700">
          {score.correct}/{score.total} đúng
        </div>
      </section>

      {quiz && (
        <section className="panel overflow-hidden">
          <div className="grid gap-0 xl:grid-cols-[1fr_320px]">
            <div className="p-5 md:p-8">
              <span className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-bold text-primary">
                {quizTypes.find((item) => item.value === type)?.label || "Quiz"}
              </span>
              <div className="mt-8 text-center">
                {type === "audio" ? (
                  <button className="icon-button mx-auto h-20 w-20" type="button" onClick={() => word && speakChinese(word.chinese)} title="Nghe">
                    <Headphones size={34} />
                  </button>
                ) : (
                  <p className="hanzi text-7xl font-black text-gray-950">{quiz.question}</p>
                )}
                <p className="mt-4 text-gray-500">HSK {word?.hskLevel || 1}</p>
              </div>

              <div className="mt-8 grid gap-3 md:grid-cols-2">
                {quiz.options.map((option) => {
                  const isAnswer = option === quiz.answer;
                  const isSelected = option === selected;
                  const stateClass =
                    selected && isAnswer
                      ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                      : selected && isSelected
                        ? "border-red-500 bg-red-50 text-red-700"
                        : "border-gray-200 bg-white text-gray-800 hover:border-primary";

                  return (
                    <button
                      key={option}
                      className={`focus-ring min-h-[64px] rounded-lg border px-4 py-3 text-left font-bold transition ${stateClass}`}
                      type="button"
                      disabled={Boolean(selected)}
                      onClick={() => submit(option)}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>

              {selected && (
                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <div className="flex items-center gap-2 font-semibold">
                    {result ? <CheckCircle2 className="text-emerald-600" size={20} /> : <XCircle className="text-primary" size={20} />}
                    {result ? "Chính xác" : `Đáp án: ${quiz.answer}`}
                  </div>
                  <button className="solid-button" type="button" onClick={next}>
                    Câu tiếp
                  </button>
                </div>
              )}
            </div>

            <aside className="border-t border-gray-200 bg-gray-50 p-5 xl:border-l xl:border-t-0">
              <LazyImage className="h-44 w-full rounded-lg object-cover" src={word?.image} alt={word?.meaning} />
              <p className="hanzi mt-4 text-3xl font-bold text-gray-950">{word?.chinese}</p>
              <p className="font-semibold text-primary">{word?.pinyin}</p>
              <p className="mt-2 text-sm text-gray-600">{quiz.explanation}</p>
            </aside>
          </div>
        </section>
      )}
    </div>
  );
}

