import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  BookOpen,
  Brain,
  Edit3,
  Lock,
  Plus,
  Shield,
  Trash2,
  Unlock,
  Users,
} from "lucide-react";
import { http } from "../api/http.js";
import { useAuth } from "../state/AuthContext.jsx";

const tabs = [
  { id: "topics", label: "Chủ đề", icon: BookOpen },
  { id: "words", label: "Từ vựng", icon: Shield },
  { id: "quiz", label: "Quiz", icon: Brain },
  { id: "users", label: "User", icon: Users },
];

export function AdminPage({ topics, words, quizzes }) {
  const { isAdmin } = useAuth();
  const [tab, setTab] = useState("topics");
  const [localTopics, setLocalTopics] = useState(topics);
  const [localWords, setLocalWords] = useState(words);
  const [localQuizzes, setLocalQuizzes] = useState(quizzes);
  const [topicForm, setTopicForm] = useState({ title: "", description: "" });
  const [wordForm, setWordForm] = useState({
    chinese: "",
    pinyin: "",
    meaning: "",
    hskLevel: 1,
    topicId: topics[0]?.id || "",
  });
  const [quizForm, setQuizForm] = useState({
    vocabularyId: words[0]?.id || "",
    question: "",
    answer: "",
    type: "meaning",
  });
  const [editingQuizId, setEditingQuizId] = useState(null);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    users: 0,
    topics: topics.length,
    vocabularies: words.length,
    quizzes: quizzes.length,
    learned: 0,
  });
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    setLocalTopics(topics);
    setLocalWords(words);
    setLocalQuizzes(quizzes);
    setWordForm((value) => ({
      ...value,
      topicId: value.topicId || topics[0]?.id || "",
    }));
    setQuizForm((value) => ({
      ...value,
      vocabularyId: value.vocabularyId || words[0]?.id || "",
    }));
  }, [topics, words, quizzes]);

  useEffect(() => {
    if (!isAdmin) return;

    async function loadAdminData() {
      try {
        const [{ data: statsData }, { data: usersData }] = await Promise.all([
          http.get("/admin/stats"),
          http.get("/admin/users"),
        ]);
        setStats(statsData);
        setUsers(usersData.users || []);
      } catch {
        const message = "Không tải được dữ liệu quản trị.";
        setStatusMessage(message);
        toast.error(message);
      }
    }

    void loadAdminData();
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div className="panel p-8 text-center">
        <Shield className="mx-auto text-primary" size={34} />
        <h2 className="mt-3 text-xl font-bold text-gray-950">
          Cần quyền admin
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Bạn cần đăng nhập bằng tài khoản quản trị để vào trang này.
        </p>
      </div>
    );
  }

  async function addTopic(event) {
    event.preventDefault();
    if (!topicForm.title.trim()) return;

    try {
      const { data } = await http.post("/topics", {
        title: topicForm.title,
        description: topicForm.description,
        image:
          "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80",
        accent: "#f472b6",
        order: localTopics.length + 1,
      });
      setLocalTopics((value) => [
        ...value,
        {
          id: data.topic._id || data.topic.id,
          title: data.topic.title,
          description: data.topic.description,
          image: data.topic.image,
          accent: data.topic.accent,
          vocabularyCount: 0,
        },
      ]);
      setTopicForm({ title: "", description: "" });
      setStatusMessage("Đã thêm chủ đề.");
      toast.success("Đã thêm chủ đề.");
    } catch (error) {
      const message = error.response?.data?.message || "Không thể thêm chủ đề.";
      setStatusMessage(message);
      toast.error(message);
    }
  }

  async function addWord(event) {
    event.preventDefault();
    if (!wordForm.chinese.trim() || !wordForm.topicId) return;

    try {
      const { data } = await http.post("/vocabularies", {
        chinese: wordForm.chinese,
        pinyin: wordForm.pinyin,
        meaning: wordForm.meaning,
        type: "Khác",
        example: "",
        examplePinyin: "",
        exampleMeaning: "",
        image:
          "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
        topicId: wordForm.topicId,
        hskLevel: Number(wordForm.hskLevel),
        synonyms: [],
        antonyms: [],
        relatedWords: [],
      });
      const vocabulary = data.vocabulary;
      setLocalWords((value) => [
        ...value,
        {
          id: vocabulary._id || vocabulary.id,
          topicId: vocabulary.topicId,
          chinese: vocabulary.chinese,
          pinyin: vocabulary.pinyin,
          meaning: vocabulary.meaning,
          type: vocabulary.type,
          example: vocabulary.example,
          examplePinyin: vocabulary.examplePinyin,
          exampleMeaning: vocabulary.exampleMeaning,
          image: vocabulary.image,
          audio: vocabulary.audio,
          radical: vocabulary.radical,
          strokes: vocabulary.strokes,
          hskLevel: vocabulary.hskLevel,
          synonyms: vocabulary.synonyms || [],
          antonyms: vocabulary.antonyms || [],
          relatedWords: vocabulary.relatedWords || [],
        },
      ]);
      setWordForm({
        chinese: "",
        pinyin: "",
        meaning: "",
        hskLevel: 1,
        topicId: localTopics[0]?.id || "",
      });
      setQuizForm((value) => ({
        ...value,
        vocabularyId: vocabulary._id || vocabulary.id,
      }));
      setStatusMessage("Đã thêm từ vựng.");
      toast.success("Đã thêm từ vựng.");
    } catch (error) {
      const message = error.response?.data?.message || "Không thể thêm từ vựng.";
      setStatusMessage(message);
      toast.error(message);
    }
  }

  async function addOrUpdateQuiz(event) {
    event.preventDefault();
    if (
      !quizForm.question.trim() ||
      !quizForm.answer.trim() ||
      !quizForm.vocabularyId
    )
      return;

    try {
      const payload = {
        vocabularyId: quizForm.vocabularyId,
        type: quizForm.type,
        question: quizForm.question,
        options: [quizForm.answer, "A", "B", "C"],
        answer: quizForm.answer,
        explanation: "",
      };

      if (editingQuizId) {
        const { data } = await http.put(`/quiz/${editingQuizId}`, payload);
        const quiz = data.quiz;
        setLocalQuizzes((value) =>
          value.map((item) =>
            item.id === editingQuizId
              ? {
                  id: quiz._id || quiz.id,
                  vocabularyId: quiz.vocabularyId,
                  type: quiz.type,
                  question: quiz.question,
                  options: quiz.options,
                  answer: quiz.answer,
                  explanation: quiz.explanation,
                }
              : item,
          ),
        );
        setStatusMessage("Đã cập nhật câu hỏi.");
        toast.success("Đã cập nhật câu hỏi.");
      } else {
        const { data } = await http.post("/quiz", payload);
        const quiz = data.quiz;
        setLocalQuizzes((value) => [
          ...value,
          {
            id: quiz._id || quiz.id,
            vocabularyId: quiz.vocabularyId,
            type: quiz.type,
            question: quiz.question,
            options: quiz.options,
            answer: quiz.answer,
            explanation: quiz.explanation,
          },
        ]);
        setStatusMessage("Đã thêm câu hỏi.");
        toast.success("Đã thêm câu hỏi.");
      }

      setQuizForm({
        vocabularyId: localWords[0]?.id || "",
        question: "",
        answer: "",
        type: "meaning",
      });
      setEditingQuizId(null);
    } catch (error) {
      const message = error.response?.data?.message || "Không thể lưu câu hỏi.";
      setStatusMessage(message);
      toast.error(message);
    }
  }

  async function deleteTopic(topicId) {
    try {
      await http.delete(`/topics/${topicId}`);
      setLocalTopics((value) => value.filter((item) => item.id !== topicId));
      setStatusMessage("Đã xóa chủ đề.");
      toast.success("Đã xóa chủ đề.");
    } catch (error) {
      const message = error.response?.data?.message || "Không thể xóa chủ đề.";
      setStatusMessage(message);
      toast.error(message);
    }
  }

  async function deleteWord(wordId) {
    try {
      await http.delete(`/vocabularies/${wordId}`);
      setLocalWords((value) => value.filter((item) => item.id !== wordId));
      setStatusMessage("Đã xóa từ vựng.");
      toast.success("Đã xóa từ vựng.");
    } catch (error) {
      const message = error.response?.data?.message || "Không thể xóa từ vựng.";
      setStatusMessage(message);
      toast.error(message);
    }
  }

  async function deleteQuiz(quizId) {
    try {
      await http.delete(`/quiz/${quizId}`);
      setLocalQuizzes((value) => value.filter((item) => item.id !== quizId));
      setStatusMessage("Đã xóa quiz.");
      toast.success("Đã xóa quiz.");
    } catch (error) {
      const message = error.response?.data?.message || "Không thể xóa quiz.";
      setStatusMessage(message);
      toast.error(message);
    }
  }

  async function toggleUserLock(userId, isLocked) {
    try {
      const endpoint = isLocked
        ? `/admin/users/${userId}/unlock`
        : `/admin/users/${userId}/lock`;
      await http.patch(endpoint);
      setUsers((value) =>
        value.map((item) =>
          item.id === userId ? { ...item, isLocked: !isLocked } : item,
        ),
      );
      const message = isLocked ? "Đã mở khóa người dùng." : "Đã khóa người dùng.";
      setStatusMessage(message);
      toast.success(message);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Không thể cập nhật trạng thái người dùng.";
      setStatusMessage(message);
      toast.error(message);
    }
  }

  function startEditingQuiz(quiz) {
    setEditingQuizId(quiz.id);
    setQuizForm({
      vocabularyId: quiz.vocabularyId || localWords[0]?.id || "",
      question: quiz.question,
      answer: quiz.answer,
      type: quiz.type,
    });
    setTab("quiz");
  }

  const summary = useMemo(
    () => [
      { label: "User", value: stats.users },
      { label: "Vocabulary", value: localWords.length },
      { label: "Topic", value: localTopics.length },
      { label: "Quiz", value: localQuizzes.length },
    ],
    [stats.users, localWords.length, localTopics.length, localQuizzes.length],
  );

  return (
    <div className="space-y-5">
      <section className="grid gap-4 md:grid-cols-4">
        {summary.map((item) => (
          <div key={item.label} className="panel p-4">
            <p className="text-sm font-medium text-gray-500">{item.label}</p>
            <p className="mt-1 text-2xl font-black text-gray-950">
              {item.value}
            </p>
          </div>
        ))}
      </section>

      {statusMessage && (
        <div className="rounded-xl border border-pink-100 bg-pink-50 px-4 py-3 text-sm text-gray-700">
          {statusMessage}
        </div>
      )}

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
            <form
              className="grid gap-3 md:grid-cols-[1fr_1fr_auto]"
              onSubmit={addTopic}
            >
              <input
                className="field"
                placeholder="Tên chủ đề"
                value={topicForm.title}
                onChange={(event) =>
                  setTopicForm((value) => ({
                    ...value,
                    title: event.target.value,
                  }))
                }
              />
              <input
                className="field"
                placeholder="Mô tả"
                value={topicForm.description}
                onChange={(event) =>
                  setTopicForm((value) => ({
                    ...value,
                    description: event.target.value,
                  }))
                }
              />
              <button className="solid-button" type="submit">
                <Plus size={17} />
                Create
              </button>
            </form>
          }
        >
          {localTopics.map((topic) => (
            <AdminRow
              key={topic.id}
              title={topic.title}
              meta={topic.description}
              onDelete={() => deleteTopic(topic.id)}
            />
          ))}
        </AdminSection>
      )}

      {tab === "words" && (
        <AdminSection
          form={
            <form
              className="grid gap-3 md:grid-cols-[1fr_1fr_1fr_110px_160px_auto]"
              onSubmit={addWord}
            >
              <input
                className="field"
                placeholder="中文"
                value={wordForm.chinese}
                onChange={(event) =>
                  setWordForm((value) => ({
                    ...value,
                    chinese: event.target.value,
                  }))
                }
              />
              <input
                className="field"
                placeholder="Pinyin"
                value={wordForm.pinyin}
                onChange={(event) =>
                  setWordForm((value) => ({
                    ...value,
                    pinyin: event.target.value,
                  }))
                }
              />
              <input
                className="field"
                placeholder="Nghĩa"
                value={wordForm.meaning}
                onChange={(event) =>
                  setWordForm((value) => ({
                    ...value,
                    meaning: event.target.value,
                  }))
                }
              />
              <select
                className="field"
                value={wordForm.hskLevel}
                onChange={(event) =>
                  setWordForm((value) => ({
                    ...value,
                    hskLevel: event.target.value,
                  }))
                }
              >
                {[1, 2, 3, 4, 5, 6].map((level) => (
                  <option key={level} value={level}>
                    HSK {level}
                  </option>
                ))}
              </select>
              <select
                className="field"
                value={wordForm.topicId}
                onChange={(event) =>
                  setWordForm((value) => ({
                    ...value,
                    topicId: event.target.value,
                  }))
                }
              >
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
            <AdminRow
              key={word.id}
              title={`${word.chinese} - ${word.meaning}`}
              meta={`${word.pinyin} · HSK ${word.hskLevel}`}
              onDelete={() => deleteWord(word.id)}
            />
          ))}
        </AdminSection>
      )}

      {tab === "quiz" && (
        <AdminSection
          form={
            <form
              className="grid gap-3 md:grid-cols-[160px_1fr_1fr_200px_auto]"
              onSubmit={addOrUpdateQuiz}
            >
              <select
                className="field"
                value={quizForm.type}
                onChange={(event) =>
                  setQuizForm((value) => ({
                    ...value,
                    type: event.target.value,
                  }))
                }
              >
                <option value="meaning">Chọn nghĩa</option>
                <option value="pinyin">Chọn pinyin</option>
                <option value="audio">Nghe</option>
                <option value="hanzi">Chữ Hán</option>
              </select>
              <input
                className="field"
                placeholder="Câu hỏi"
                value={quizForm.question}
                onChange={(event) =>
                  setQuizForm((value) => ({
                    ...value,
                    question: event.target.value,
                  }))
                }
              />
              <input
                className="field"
                placeholder="Đáp án"
                value={quizForm.answer}
                onChange={(event) =>
                  setQuizForm((value) => ({
                    ...value,
                    answer: event.target.value,
                  }))
                }
              />
              <select
                className="field"
                value={quizForm.vocabularyId}
                onChange={(event) =>
                  setQuizForm((value) => ({
                    ...value,
                    vocabularyId: event.target.value,
                  }))
                }
              >
                {localWords.map((word) => (
                  <option key={word.id} value={word.id}>
                    {word.chinese}
                  </option>
                ))}
              </select>
              <button className="solid-button" type="submit">
                {editingQuizId ? <Edit3 size={17} /> : <Plus size={17} />}
                {editingQuizId ? "Update" : "Create"}
              </button>
            </form>
          }
        >
          {localQuizzes.map((quiz) => (
            <AdminRow
              key={quiz.id}
              title={quiz.question}
              meta={`${quiz.type} · ${quiz.answer}`}
              onDelete={() => deleteQuiz(quiz.id)}
              onEdit={() => startEditingQuiz(quiz)}
            />
          ))}
        </AdminSection>
      )}

      {tab === "users" && (
        <AdminSection>
          {users.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between gap-3 p-4"
            >
              <div className="min-w-0">
                <p className="truncate font-bold text-gray-950">
                  {user.name || user.email}
                </p>
                <p className="truncate text-sm text-gray-500">
                  {user.email} · {user.role}
                </p>
              </div>
              <button
                className="icon-button"
                type="button"
                onClick={() => toggleUserLock(user.id, user.isLocked)}
                title={user.isLocked ? "Mở khóa" : "Khóa"}
              >
                {user.isLocked ? <Unlock size={17} /> : <Lock size={17} />}
              </button>
            </div>
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

function AdminRow({ title, meta, onDelete, onEdit }) {
  return (
    <div className="flex items-center justify-between gap-3 p-4">
      <div className="min-w-0">
        <p className="truncate font-bold text-gray-950">{title}</p>
        <p className="truncate text-sm text-gray-500">{meta}</p>
      </div>
      <div className="flex items-center gap-2">
        {onEdit && (
          <button
            className="icon-button"
            type="button"
            onClick={onEdit}
            title="Edit"
          >
            <Edit3 size={17} />
          </button>
        )}
        {onDelete && (
          <button
            className="icon-button"
            type="button"
            onClick={onDelete}
            title="Delete"
          >
            <Trash2 size={17} />
          </button>
        )}
      </div>
    </div>
  );
}
