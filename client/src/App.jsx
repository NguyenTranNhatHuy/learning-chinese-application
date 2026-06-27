import { useMemo } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { http } from "./api/http.js";
import { Layout } from "./components/Layout.jsx";
import { quizzes as mockQuizzes, topics as mockTopics, vocabularies as mockWords } from "./data/mockData.js";
import { useLearningState } from "./hooks/useLearningState.js";
import { AdminPage } from "./pages/AdminPage.jsx";
import { AuthPage } from "./pages/AuthPage.jsx";
import { DashboardPage } from "./pages/DashboardPage.jsx";
import { FavoritesPage } from "./pages/FavoritesPage.jsx";
import { HomePage } from "./pages/HomePage.jsx";
import { LearnPage } from "./pages/LearnPage.jsx";
import { ProfilePage } from "./pages/ProfilePage.jsx";
import { QuizPage } from "./pages/QuizPage.jsx";
import { ReviewPage } from "./pages/ReviewPage.jsx";
import { SearchPage } from "./pages/SearchPage.jsx";
import { TopicDetailPage, TopicsPage } from "./pages/TopicsPage.jsx";
import { useAuth } from "./state/AuthContext.jsx";

export default function App() {
  const { user } = useAuth();
  const topicsQuery = useQuery({
    queryKey: ["topics"],
    queryFn: async () => (await http.get("/topics")).data,
    retry: false
  });
  const wordsQuery = useQuery({
    queryKey: ["vocabularies"],
    queryFn: async () => (await http.get("/vocabularies")).data,
    retry: false
  });
  const quizzesQuery = useQuery({
    queryKey: ["quizzes"],
    queryFn: async () => (await http.get("/quiz")).data,
    retry: false
  });

  const topics = useMemo(() => {
    const apiTopics = topicsQuery.data?.topics;
    if (!apiTopics?.length) return mockTopics;
    return apiTopics.map((topic) => ({
      id: topic._id || topic.id,
      title: topic.title,
      description: topic.description,
      image: topic.image,
      accent: topic.accent || "#E53935",
      vocabularyCount: topic.vocabularyCount || 0
    }));
  }, [topicsQuery.data]);

  const words = useMemo(() => {
    const apiWords = wordsQuery.data?.vocabularies;
    if (!apiWords?.length) return mockWords;
    return apiWords.map((word) => ({
      id: word._id || word.id,
      topicId: normalizeTopicId(word.topicId),
      chinese: word.chinese,
      pinyin: word.pinyin,
      meaning: word.meaning,
      type: word.type,
      example: word.example,
      examplePinyin: word.examplePinyin,
      exampleMeaning: word.exampleMeaning,
      image: word.image || mockWords[0].image,
      audio: word.audio,
      radical: word.radical,
      strokes: word.strokes,
      hskLevel: word.hskLevel,
      synonyms: word.synonyms || [],
      antonyms: word.antonyms || [],
      relatedWords: word.relatedWords || []
    }));
  }, [wordsQuery.data]);

  const quizzes = useMemo(() => {
    const apiQuizzes = quizzesQuery.data?.quizzes;
    if (!apiQuizzes?.length) return mockQuizzes;
    return apiQuizzes.map((quiz) => ({
      id: quiz._id || quiz.id,
      vocabularyId: normalizeTopicId(quiz.vocabularyId),
      type: quiz.type,
      question: quiz.question,
      options: quiz.options,
      answer: quiz.answer,
      explanation: quiz.explanation
    }));
  }, [quizzesQuery.data]);

  const learning = useLearningState(words);

  return (
    <Layout metrics={learning.metrics}>
      <Routes>
        <Route path="/" element={<HomePage topics={topics} words={words} learning={learning} user={user} />} />
        <Route path="/topics" element={<TopicsPage topics={topics} />} />
        <Route path="/topics/:topicId" element={<TopicDetailPage topics={topics} words={words} learning={learning} />} />
        <Route path="/learn" element={<LearnPage topics={topics} words={words} learning={learning} />} />
        <Route path="/quiz" element={<QuizPage quizzes={quizzes} words={words} learning={learning} />} />
        <Route path="/review" element={<ReviewPage topics={topics} words={words} learning={learning} />} />
        <Route path="/dashboard" element={<DashboardPage topics={topics} words={words} learning={learning} user={user} />} />
        <Route path="/favorites" element={<FavoritesPage topics={topics} words={words} learning={learning} />} />
        <Route path="/profile" element={<ProfilePage topics={topics} learning={learning} />} />
        <Route path="/search" element={<SearchPage topics={topics} words={words} learning={learning} />} />
        <Route path="/admin" element={<AdminPage topics={topics} words={words} quizzes={quizzes} />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

function normalizeTopicId(value) {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value._id || value.id || "";
}

