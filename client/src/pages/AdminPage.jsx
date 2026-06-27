import { useMemo, useState } from "react";
import { BookOpen, Brain, Plus, Shield, Trash2, Users } from "lucide-react";
import { useAuth } from "../state/AuthContext.jsx";

const tabs = [
  { id: "topics", label: "Chủ đề", icon: BookOpen },
  { id: "words", label: "Từ vựng", icon: Shield },
  { id: "quiz", label: "Quiz", icon: Brain },
  { id: "users", label: "User", icon: Users }
];

export function AdminPage({ topics, words, quizzes }) {
  const { isAdmin } = useAuth();
  const [tab, setTab] = useState("topics");
  const [localTopics, setLocalTopics] = useState(topics);
  const [localWords, setLocalWords] = useState(words);
  const [localQuizzes, setLocalQuizzes] = useState(quizzes);
  const [topicForm, setTopicForm] = useState({ title: "", description: "" });
  const [wordForm, setWordForm] = useState({ chinese: "", pinyin: "", meaning: "", hskLevel: 1, topicId: topics[0]?.id || "" });
  const [quizForm, setQuizForm] = useState({ question: "", answer: "", type: "meaning" });

  const stats = useMemo(
    () => [
      { label: "User", value: 2 },
      { label: "Vocabulary", value: localWords.length },
      { label: "Topic", value: localTopics.length },
      { label: "Quiz", value: localQuizzes.length }
    ],
    [localWords.length, localTopics.length, localQuizzes.length]
  );

  if (!isAdmin) {
    return (
      <div className="panel p-8 text-center">
        <Shield className="mx-auto text-primary" size={34} />
        <h2 className="mt-3 text-xl font-bold text-gray-950">Cần quyền admin</h2>
        <p className="mt-1 text-sm text-gray-500">Chuyển role trong hồ sơ demo để mở màn quản trị.</p>
      </div>
    );
  }

  function addTopic(event) {
    event.preventDefault();
    if (!topicForm.title.trim()) return;
    setLocalTopics((value) => [
      ...value,
      {
        id: `topic-${Date.now()}`,
        title: topicForm.title,
        description: topicForm.description,
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80",
        accent: "#E53935",
        vocabularyCount: 0
      }
    ]);
    setTopicForm({ title: "", description: "" });
  }

  function addWord(event) {
    event.preventDefault();
    if (!wordForm.chinese.trim()) return;
    setLocalWords((value) => [
      ...value,
      {
        id: `word-${Date.now()}`,
        ...wordForm,
        hskLevel: Number(wordForm.hskLevel),
        type: "Khác",
        example: "",
        examplePinyin: "",
        exampleMeaning: "",
        relatedWords: [],
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80"
      }
    ]);
    setWordForm({ chinese: "", pinyin: "", meaning: "", hskLevel: 1, topicId: topics[0]?.id || "" });
  }

  function addQuiz(event) {
    event.preventDefault();
    if (!quizForm.question.trim()) return;
    setLocalQuizzes((value) => [
      ...value,
      {
        id: `quiz-${Date.now()}`,
        vocabularyId: localWords[0]?.id,
        options: [quizForm.answer, "A", "B", "C"],
        explanation: "",
        ...quizForm
      }
    ]);
    setQuizForm({ question: "", answer: "", type: "meaning" });
  }

  return (
    <div className="space-y-5">
      <section className="grid gap-4 md:grid-cols-4">
        {stats.map((item) => (
          <div key={item.label} className="panel p-4">
            <p className="text-sm font-medium text-gray-500">{item.label}</p>
            <p className="mt-1 text-2xl font-black text-gray-950">{item.value}</p>
          </div>
        ))}
      </section>

      <div className="flex flex-wrap gap-2">
        {tabs.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={`ghost-button ${tab === item.id ? "border-primary text-primary" : ""}`}
              type="button"
              onClick={() => setTab(item.id)}
            >
              <Icon size={17} />
              {item.label}
            </button>
          );
        })}
      </div>

      {tab === "topics" && (
        <AdminSection
          form={
            <form className="grid gap-3 md:grid-cols-[1fr_1fr_auto]" onSubmit={addTopic}>
              <input className="field" placeholder="Tên chủ đề" value={topicForm.title} onChange={(event) => setTopicForm((value) => ({ ...value, title: event.target.value }))} />
              <input className="field" placeholder="Mô tả" value={topicForm.description} onChange={(event) => setTopicForm((value) => ({ ...value, description: event.target.value }))} />
              <button className="solid-button" type="submit">
                <Plus size={17} />
                Create
              </button>
            </form>
          }
        >
          {localTopics.map((topic) => (
            <AdminRow key={topic.id} title={topic.title} meta={topic.description} onDelete={() => setLocalTopics((value) => value.filter((item) => item.id !== topic.id))} />
          ))}
        </AdminSection>
      )}

      {tab === "words" && (
        <AdminSection
          form={
            <form className="grid gap-3 md:grid-cols-[1fr_1fr_1fr_110px_160px_auto]" onSubmit={addWord}>
              <input className="field" placeholder="中文" value={wordForm.chinese} onChange={(event) => setWordForm((value) => ({ ...value, chinese: event.target.value }))} />
              <input className="field" placeholder="Pinyin" value={wordForm.pinyin} onChange={(event) => setWordForm((value) => ({ ...value, pinyin: event.target.value }))} />
              <input className="field" placeholder="Nghĩa" value={wordForm.meaning} onChange={(event) => setWordForm((value) => ({ ...value, meaning: event.target.value }))} />
              <select className="field" value={wordForm.hskLevel} onChange={(event) => setWordForm((value) => ({ ...value, hskLevel: event.target.value }))}>
                {[1, 2, 3, 4, 5, 6].map((level) => (
                  <option key={level} value={level}>
                    HSK {level}
                  </option>
                ))}
              </select>
              <select className="field" value={wordForm.topicId} onChange={(event) => setWordForm((value) => ({ ...value, topicId: event.target.value }))}>
                {localTopics.map((topic) => (
                  <option key={topic.id} value={topic.id}>
                    {topic.title}
                  </option>
                ))}
              </select>
              <button className="solid-button" type="submit">
                <Plus size={17} />
                Create
              </button>
            </form>
          }
        >
          {localWords.map((word) => (
            <AdminRow key={word.id} title={`${word.chinese} - ${word.meaning}`} meta={`${word.pinyin} · HSK ${word.hskLevel}`} onDelete={() => setLocalWords((value) => value.filter((item) => item.id !== word.id))} />
          ))}
        </AdminSection>
      )}

      {tab === "quiz" && (
        <AdminSection
          form={
            <form className="grid gap-3 md:grid-cols-[160px_1fr_1fr_auto]" onSubmit={addQuiz}>
              <select className="field" value={quizForm.type} onChange={(event) => setQuizForm((value) => ({ ...value, type: event.target.value }))}>
                <option value="meaning">Chọn nghĩa</option>
                <option value="pinyin">Chọn pinyin</option>
                <option value="audio">Nghe</option>
                <option value="hanzi">Chữ Hán</option>
              </select>
              <input className="field" placeholder="Câu hỏi" value={quizForm.question} onChange={(event) => setQuizForm((value) => ({ ...value, question: event.target.value }))} />
              <input className="field" placeholder="Đáp án" value={quizForm.answer} onChange={(event) => setQuizForm((value) => ({ ...value, answer: event.target.value }))} />
              <button className="solid-button" type="submit">
                <Plus size={17} />
                Create
              </button>
            </form>
          }
        >
          {localQuizzes.map((quiz) => (
            <AdminRow key={quiz.id} title={quiz.question} meta={`${quiz.type} · ${quiz.answer}`} onDelete={() => setLocalQuizzes((value) => value.filter((item) => item.id !== quiz.id))} />
          ))}
        </AdminSection>
      )}

      {tab === "users" && (
        <AdminSection>
          {["admin@learningchinese.dev", "user@learningchinese.dev"].map((email) => (
            <AdminRow key={email} title={email} meta="Mở khóa · Reset password" />
          ))}
        </AdminSection>
      )}
    </div>
  );
}

function AdminSection({ form, children }) {
  return (
    <section className="panel overflow-hidden">
      {form && <div className="border-b border-gray-200 p-4">{form}</div>}
      <div className="divide-y divide-gray-100">{children}</div>
    </section>
  );
}

function AdminRow({ title, meta, onDelete }) {
  return (
    <div className="flex items-center justify-between gap-3 p-4">
      <div className="min-w-0">
        <p className="truncate font-bold text-gray-950">{title}</p>
        <p className="truncate text-sm text-gray-500">{meta}</p>
      </div>
      {onDelete && (
        <button className="icon-button" type="button" onClick={onDelete} title="Delete">
          <Trash2 size={17} />
        </button>
      )}
    </div>
  );
}

