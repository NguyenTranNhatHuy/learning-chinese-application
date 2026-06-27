import { useMemo, useState } from "react";

const initial = {
  learned: ["ni-hao", "jia", "xue-xi"],
  favorites: ["ni-hao", "tian-qi"],
  wrong: ["jiu-dian"],
  hiddenToday: []
};

export function useLearningState(words) {
  const [state, setState] = useState(() => {
    const stored = localStorage.getItem("learning_chinese_state");
    return stored ? JSON.parse(stored) : initial;
  });

  function persist(next) {
    setState(next);
    localStorage.setItem("learning_chinese_state", JSON.stringify(next));
  }

  function toggleFavorite(id) {
    const favorites = state.favorites.includes(id)
      ? state.favorites.filter((item) => item !== id)
      : [...state.favorites, id];
    persist({ ...state, favorites });
  }

  function markLearned(id) {
    const learned = state.learned.includes(id) ? state.learned : [...state.learned, id];
    persist({ ...state, learned, wrong: state.wrong.filter((item) => item !== id) });
  }

  function markWrong(id) {
    const wrong = state.wrong.includes(id) ? state.wrong : [...state.wrong, id];
    persist({ ...state, wrong });
  }

  const metrics = useMemo(() => {
    const learnedCount = state.learned.length;
    const favoriteCount = state.favorites.length;
    const reviewCount = state.wrong.length;
    const progress = words.length ? Math.round((learnedCount / words.length) * 100) : 0;

    return { learnedCount, favoriteCount, reviewCount, progress };
  }, [state, words.length]);

  return {
    learnedIds: state.learned,
    favoriteIds: state.favorites,
    wrongIds: state.wrong,
    metrics,
    toggleFavorite,
    markLearned,
    markWrong
  };
}

