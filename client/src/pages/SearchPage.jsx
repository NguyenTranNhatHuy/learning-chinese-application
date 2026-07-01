import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { hanziCharacters } from "../data/hanziCharacters.js";

const hanziRegex = /[\p{Script=Han}]/u;

export function SearchPage({ topics, words = [] }) {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const characters = useMemo(
    () =>
      hanziCharacters
        .map((character) => String(character).trim())
        .filter((character) => hanziRegex.test(character)),
    [],
  );

  const results = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) {
      return characters.slice(0, 200);
    }

    const chineseChars = [...keyword].filter((char) =>
      /[\p{Script=Han}]/u.test(char),
    );
    const matched = new Set();

    if (chineseChars.length) {
      characters.forEach((character) => {
        if (chineseChars.some((query) => character.includes(query))) {
          matched.add(character);
        }
      });
    }

    if (words?.length) {
      const keywordLower = keyword.toLowerCase();
      words.forEach((word) => {
        const searchable = [
          word.chinese,
          word.pinyin,
          word.meaning,
          word.example,
        ]
          .filter(Boolean)
          .map((value) => value.toLowerCase());

        if (searchable.some((value) => value.includes(keywordLower))) {
          matched.add(word.chinese);
        }
      });
    }

    return Array.from(matched).slice(0, 1000);
  }, [search, words, characters]);

  return (
    <div className="space-y-5">
      <div className="grid gap-3 rounded-lg border border-gray-200 bg-white p-3 md:grid-cols-[1fr_150px_200px]">
        <label className="relative md:col-span-2">
          <input
            className="field pr-14"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Tìm chữ Hán trong 9000+ ký tự"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-pink-50 text-gray-500">
            🔎
          </span>
        </label>
        <button
          type="button"
          className="solid-button"
          onClick={() => setSearch("")}
        >
          Xóa tìm
        </button>
      </div>

      <div className="rounded-[28px] border border-pink-100 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Kết quả tìm kiếm
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {search
                ? `Tìm thấy ${results.length} ký tự chứa “${search}”`
                : `Hiển thị 200 trong ${hanziCharacters.length} ký tự`}
            </p>
          </div>
          {search && (
            <div className="rounded-full bg-pink-50 px-3 py-1 text-sm font-semibold text-primary">
              {results.length} kết quả
            </div>
          )}
        </div>

        {results.length === 0 ? (
          <div className="panel p-8 text-center text-gray-600">
            Không có ký tự phù hợp với “{search}”.
          </div>
        ) : (
          <div className="mt-6 grid gap-3 sm:grid-cols-4 xl:grid-cols-6">
            {results.map((character) => (
              <button
                key={character}
                type="button"
                onClick={() =>
                  navigate(`/write?char=${encodeURIComponent(character)}`)
                }
                className="rounded-3xl border border-gray-200 bg-pink-50 px-4 py-6 text-4xl font-black text-gray-900 transition hover:border-pink-300 hover:bg-pink-100"
              >
                {character}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
