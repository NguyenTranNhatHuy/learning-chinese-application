import { useEffect, useMemo, useState } from "react";
import { Headphones, Timer } from "lucide-react";
import { LazyImage } from "../components/LazyImage.jsx";
import { speakChinese } from "../utils/speech.js";

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const quizTypes = [
  { value: "meaning", label: "Chọn nghĩa" },
  { value: "pinyin", label: "Chọn pinyin" },
  { value: "hanzi", label: "Chọn chữ Hán" },
  { value: "audio", label: "Nghe chọn đáp án" },
];

const questionCounts = [10, 20, 30, 40, 50, 60];
const questionTime = 30;

export function QuizPage({ quizzes, words, topics, learning }) {
  const [type, setType] = useState("meaning");
  const [selectedTopicIds, setSelectedTopicIds] = useState([]);
  const [topicQuery, setTopicQuery] = useState("");
  const [questionCount, setQuestionCount] = useState(10);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionResults, setSessionResults] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [timer, setTimer] = useState(questionTime);
  const [showSummary, setShowSummary] = useState(false);
  const [showConfirmFinish, setShowConfirmFinish] = useState(false);
  const [randomizedQuizzes, setRandomizedQuizzes] = useState([]);

  const topicMap = useMemo(
    () => new Map(topics.map((topic) => [topic.id, topic.title])),
    [topics],
  );

  const selectedTopicTitles = useMemo(
    () => selectedTopicIds.map((id) => topicMap.get(id)).filter(Boolean),
    [selectedTopicIds, topicMap],
  );

  const filteredTopics = useMemo(() => {
    if (!topicQuery.trim()) return topics;
    const query = topicQuery.trim().toLowerCase();
    return topics.filter((topic) => topic.title.toLowerCase().includes(query));
  }, [topics, topicQuery]);

  const eligibleQuizzes = useMemo(() => {
    return quizzes.filter((quiz) => {
      if (quiz.type !== type) return false;
      const word = words.find((item) => item.id === quiz.vocabularyId);
      return word && selectedTopicIds.includes(word.topicId);
    });
  }, [quizzes, words, type, selectedTopicIds]);

  const activeQuizzes = useMemo(() => {
    const source =
      quizStarted && randomizedQuizzes.length
        ? randomizedQuizzes
        : eligibleQuizzes;
    if (!source.length) return [];
    return source.slice(0, Math.min(questionCount, source.length));
  }, [eligibleQuizzes, randomizedQuizzes, questionCount, quizStarted]);

  const currentQuiz = activeQuizzes[currentIndex];
  const currentWord = words.find(
    (item) => item.id === currentQuiz?.vocabularyId,
  );

  function formatTime(value) {
    const hours = Math.floor(value / 3600);
    const minutes = Math.floor((value % 3600) / 60);
    const seconds = value % 60;
    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  useEffect(() => {
    if (!quizStarted || showSummary) return;

    const interval = setInterval(() => {
      setTimer((value) => Math.max(value - 1, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [quizStarted, showSummary]);

  useEffect(() => {
    if (!quizStarted || showSummary) return;
    if (timer <= 0) {
      finishQuiz(true);
    }
  }, [timer, quizStarted, showSummary]);

  function toggleTopic(topicId) {
    setSelectedTopicIds((current) =>
      current.includes(topicId)
        ? current.filter((id) => id !== topicId)
        : [...current, topicId],
    );
  }

  function startQuiz() {
    if (!selectedTopicIds.length) return;
    const count = Math.min(questionCount, eligibleQuizzes.length);
    const randomized = shuffleArray(eligibleQuizzes).slice(0, count);

    setQuizStarted(true);
    setShowSummary(false);
    setCurrentIndex(0);
    setRandomizedQuizzes(randomized);
    setSelectedAnswers(Array(randomized.length).fill(null));
    setSessionResults([]);
    setTimer(randomized.length * questionTime);
    setQuestionCount(count);
  }

  function finishQuiz(timeout = false) {
    const results = activeQuizzes.map((quiz, index) => {
      const selection = selectedAnswers[index] || {};
      const expired = selection.expired || (timeout && !selection.answer);
      const answer = expired
        ? "Bạn chưa chọn đáp án"
        : selection.answer || "(Không đáp án)";
      const isCorrect = !expired && selection.answer === quiz.answer;

      return {
        quizId: quiz.id,
        question: quiz.question,
        answer,
        correctAnswer: quiz.answer,
        isCorrect,
        expired,
        explanation: quiz.explanation || "",
      };
    });

    results.forEach((item) => {
      const word = words.find(
        (w) =>
          w.id ===
          activeQuizzes.find((quiz) => quiz.id === item.quizId)?.vocabularyId,
      );
      if (word) {
        if (item.isCorrect) learning.markLearned(word.id);
        else learning.markWrong(word.id);
      }
    });

    setSessionResults(results);
    setShowSummary(true);
    setQuizStarted(false);
  }

  function handleSubmit(answer) {
    if (!currentQuiz) return;

    setSelectedAnswers((prev) => {
      const next = [...prev];
      next[currentIndex] = { answer, expired: false };
      return next;
    });

    if (currentIndex < activeQuizzes.length - 1) {
      setCurrentIndex((value) => value + 1);
    } else {
      finishQuiz();
    }
  }

  function nextQuestion() {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= activeQuizzes.length) {
      finishQuiz();
      return;
    }

    setCurrentIndex(nextIndex);
  }

  function restartQuiz() {
    setQuizStarted(false);
    setShowSummary(false);
    setCurrentIndex(0);
    setSelectedAnswers([]);
    setSessionResults([]);
    setTimer(questionTime);
    setSelectedTopicIds([]);
    setTopicQuery("");
    setQuestionCount(10);
    setType("meaning");
  }

  const correctCount = sessionResults.filter((item) => item.isCorrect).length;
  const correctPercent = sessionResults.length
    ? Math.round((correctCount / sessionResults.length) * 100)
    : 0;

  return (
    <div className="space-y-5">
      {!quizStarted && !showSummary && (
        <section className="panel p-5">
          <h2 className="text-xl font-bold text-gray-950">
            Thiết lập bài Quiz của bạn
          </h2>
          <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_220px]">
            <div className="space-y-6">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-gray-600">
                    Chọn chủ đề
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedTopicIds(topics.map((topic) => topic.id))
                      }
                      className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 transition hover:border-primary hover:text-primary"
                    >
                      Chọn tất cả
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedTopicIds([])}
                      className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 transition hover:border-primary hover:text-primary"
                    >
                      Bỏ chọn
                    </button>
                  </div>
                </div>
                <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_120px]">
                  <input
                    value={topicQuery}
                    onChange={(event) => setTopicQuery(event.target.value)}
                    placeholder="Tìm chủ đề"
                    className="w-full rounded-3xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 shadow-sm outline-none transition hover:border-primary focus:border-primary"
                  />
                  <div className="rounded-3xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
                    {filteredTopics.length}/{topics.length}
                  </div>
                </div>
                <div className="mt-4 max-h-[300px] overflow-y-auto rounded-[28px] border border-gray-200 bg-white p-3 shadow-sm">
                  <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                    {filteredTopics.length ? (
                      filteredTopics.map((topic) => {
                        const active = selectedTopicIds.includes(topic.id);
                        return (
                          <button
                            key={topic.id}
                            type="button"
                            onClick={() => toggleTopic(topic.id)}
                            className={`rounded-full border px-3 py-2 text-left text-sm font-semibold transition ${active ? "border-primary bg-primary text-white shadow-sm" : "border-gray-200 bg-white text-gray-700 hover:border-primary hover:bg-gray-50"}`}
                          >
                            {topic.title}
                          </button>
                        );
                      })
                    ) : (
                      <div className="col-span-full rounded-3xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-sm text-gray-500">
                        Không tìm thấy chủ đề.
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-3 min-h-[2.5rem]">
                  <div className="flex flex-wrap gap-2">
                    {selectedTopicTitles.slice(0, 10).map((title) => (
                      <span
                        key={title}
                        className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-semibold text-primary"
                      >
                        {title}
                      </span>
                    ))}
                    {selectedTopicTitles.length > 10 && (
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                        +{selectedTopicTitles.length - 10} thêm
                      </span>
                    )}
                  </div>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Tìm nhanh chủ đề, chọn nhiều chủ đề cùng lúc.
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-600">
                  Số câu hỏi
                </p>
                <div className="mt-4 grid gap-2 sm:grid-cols-3 lg:grid-cols-2">
                  {questionCounts.map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => setQuestionCount(count)}
                      className={`rounded-[28px] border px-5 py-3 text-sm font-semibold transition ${questionCount === count ? "border-primary bg-primary text-white shadow-lg" : "border-gray-200 bg-white text-gray-700 hover:border-primary hover:bg-gray-50"}`}
                    >
                      {count} câu
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-pink-100 bg-pink-50 p-5 text-sm text-gray-700">
              <p className="font-semibold text-gray-900">Cài đặt thời gian</p>
              <p className="mt-3">
                Mỗi câu có tối đa <strong>{questionTime}s</strong>.
              </p>
              <p className="mt-2 text-sm text-gray-600">
                Nếu hết thời gian, câu đó sẽ được tính sai và bạn sẽ tiếp tục
                sang câu kế tiếp.
              </p>
              <p className="mt-4">Chủ đề đã chọn:</p>
              <div className="mt-2 min-h-[2.5rem] text-sm text-gray-600">
                {selectedTopicTitles.length
                  ? selectedTopicTitles.join(", ")
                  : "Chưa chọn chủ đề"}
              </div>
              <button
                type="button"
                onClick={startQuiz}
                className="solid-button mt-6 w-full"
                disabled={
                  !selectedTopicIds.length || activeQuizzes.length === 0
                }
              >
                Bắt đầu Quiz
              </button>
              {activeQuizzes.length === 0 && (
                <p className="mt-3 text-sm text-red-600">
                  Không có câu hỏi cho lựa chọn hiện tại.
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      {quizStarted && currentQuiz && !showSummary && (
        <section className="panel overflow-hidden">
          <div className="grid gap-0 xl:grid-cols-[1fr_320px]">
            <div className="p-5 md:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-bold text-primary">
                  {quizTypes.find((item) => item.value === type)?.label ||
                    "Quiz"}
                </span>
                <div className="inline-flex items-center gap-2 rounded-full bg-pink-50 px-3 py-2 text-sm font-semibold text-primary">
                  <Timer size={16} />
                  {formatTime(timer)}
                </div>
              </div>
              <div className="mt-8 text-center">
                {type === "audio" ? (
                  <button
                    className="icon-button mx-auto h-20 w-20"
                    type="button"
                    onClick={() =>
                      currentWord && speakChinese(currentWord.chinese)
                    }
                    title="Nghe"
                  >
                    <Headphones size={34} />
                  </button>
                ) : (
                  <p className="hanzi text-7xl font-black text-gray-950">
                    {currentQuiz.question}
                  </p>
                )}
                <p className="mt-4 text-gray-500">
                  HSK {currentWord?.hskLevel || 1}
                </p>
                <p className="mt-2 text-sm text-gray-600">
                  Câu {currentIndex + 1}/{activeQuizzes.length}
                </p>
              </div>

              <div className="mt-8 grid gap-3 md:grid-cols-2">
                {currentQuiz.options.map((option) => {
                  const selection = selectedAnswers[currentIndex];
                  const isSelected = selection?.answer === option;

                  return (
                    <button
                      key={option}
                      className={`focus-ring min-h-[64px] rounded-lg border px-4 py-3 text-left font-bold transition ${isSelected ? "border-primary bg-primary/10 text-primary" : "border-gray-200 bg-white text-gray-800 hover:border-primary hover:bg-gray-50"}`}
                      type="button"
                      onClick={() => handleSubmit(option)}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>

            <aside className="border-t border-gray-200 bg-gray-50 p-5 xl:border-l xl:border-t-0">
              <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-center gap-2">
                  {activeQuizzes.map((_, idx) => {
                    const selection = selectedAnswers[idx];
                    const isAnswered =
                      !!selection?.answer || selection?.expired;
                    const isActive = idx === currentIndex;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCurrentIndex(idx)}
                        className={`h-10 min-w-[2.5rem] rounded-full border text-sm font-semibold transition ${isActive ? "border-primary bg-primary text-white" : isAnswered ? "border-primary/30 bg-primary/10 text-primary" : "border-gray-200 bg-white text-gray-500 hover:border-primary hover:bg-gray-50"}`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
                <p className="mt-4 text-sm text-gray-500">
                  {selectedAnswers[currentIndex]?.answer
                    ? `Đã chọn: ${selectedAnswers[currentIndex].answer}`
                    : selectedAnswers[currentIndex]?.expired
                      ? "Hết giờ cho câu này"
                      : "Chưa chọn đáp án"}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowConfirmFinish(true)}
                    className="solid-button px-4 py-2"
                  >
                    Kết thúc bài
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </section>
      )}

      {quizStarted && currentQuiz && !showSummary && (
        <section className="panel overflow-hidden">
          <div className="rounded-3xl border border-gray-200 bg-primary/10 p-5 text-sm text-primary shadow-sm">
            <p className="font-semibold text-lg">Cố lên nào! 💪✨</p>
            <p className="mt-3 flex items-center gap-2 text-gray-700">
              <span>🔥</span>
              <span>Chỉ cần từng câu, bạn sẽ làm được.</span>
            </p>
            <p className="mt-2 flex items-center gap-2 text-gray-700">
              <span>🌟</span>
              <span>Giữ tinh thần, tiến bước tiếp nào.</span>
            </p>
          </div>
        </section>
      )}

      {showConfirmFinish && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
          <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-gray-950">
              Xác nhận kết thúc bài thi
            </h3>
            <p className="mt-3 text-sm text-gray-600">
              Bạn có chắc muốn kết thúc bài thi ngay bây giờ? Những câu chưa trả
              lời sẽ được tính là sai.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setShowConfirmFinish(false)}
                className="ghost-button w-full rounded-3xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 sm:w-auto"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowConfirmFinish(false);
                  finishQuiz();
                }}
                className="solid-button w-full rounded-3xl px-4 py-3 text-sm font-semibold sm:w-auto"
              >
                Kết thúc ngay
              </button>
            </div>
          </div>
        </div>
      )}

      {showSummary && (
        <section className="panel p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-950">
                Kết quả Quiz
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Bạn đã hoàn thành {sessionResults.length} câu hỏi.
              </p>
            </div>
            <button
              className="ghost-button"
              type="button"
              onClick={restartQuiz}
            >
              Làm lại
            </button>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[.2em] text-gray-500">
                Đúng
              </p>
              <p className="mt-2 text-3xl font-bold text-emerald-600">
                {correctCount}
              </p>
              <p className="mt-1 text-xs text-gray-500">câu</p>
            </div>
            <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[.2em] text-gray-500">
                Sai
              </p>
              <p className="mt-2 text-3xl font-bold text-rose-600">
                {sessionResults.length - correctCount}
              </p>
              <p className="mt-1 text-xs text-gray-500">câu</p>
            </div>
            <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[.2em] text-gray-500">
                Tỷ lệ
              </p>
              <p className="mt-2 text-3xl font-bold text-primary">
                {correctPercent}%
              </p>
              <p className="mt-1 text-xs text-gray-500">chính xác</p>
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-[28px] border border-gray-200 bg-gradient-to-r from-pink-50 via-white to-cyan-50 p-1 shadow-sm">
            <div className="rounded-[26px] bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-gray-500">
                    Hiệu suất của bạn
                  </p>
                  <p className="mt-2 text-lg font-bold text-gray-950">
                    {correctPercent}% chính xác
                  </p>
                </div>
                <div className="h-3 min-w-[120px] overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500"
                    style={{ width: `${correctPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {sessionResults.map((item, idx) => (
              <div
                key={`${item.quizId}-${idx}`}
                className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Câu {idx + 1}
                    </p>
                    <p className="mt-1 text-base text-gray-700">
                      {item.question}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${item.isCorrect ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}
                  >
                    {item.isCorrect ? "Đúng" : item.expired ? "Hết giờ" : "Sai"}
                  </span>
                </div>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  <div className="rounded-2xl bg-gray-50 p-3">
                    <p className="text-xs uppercase tracking-[.2em] text-gray-500">
                      Câu trả lời của bạn
                    </p>
                    <p className="mt-1 text-sm text-gray-700">{item.answer}</p>
                  </div>
                  <div className="rounded-2xl bg-gray-50 p-3">
                    <p className="text-xs uppercase tracking-[.2em] text-gray-500">
                      Đáp án đúng
                    </p>
                    <p className="mt-1 text-sm text-gray-700">
                      {item.correctAnswer}
                    </p>
                  </div>
                </div>
                {item.explanation && (
                  <p className="mt-3 text-sm text-gray-500">
                    Giải thích: {item.explanation}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
