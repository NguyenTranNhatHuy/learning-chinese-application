import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, RotateCcw, Sparkles } from "lucide-react";
import HanziWriter from "hanzi-writer";
import { hanziCharacters } from "../data/hanziCharacters.js";

export function WritePage({ words = [] }) {
  const [searchText, setSearchText] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeIndex, setActiveIndex] = useState(0);
  const [status, setStatus] = useState("Sẵn sàng");
  const [strokeCount, setStrokeCount] = useState(null);
  const targetRef = useRef(null);
  const writerRef = useRef(null);
  const navigate = useNavigate();

  const characters = useMemo(() => {
    const list = hanziCharacters.length
      ? hanziCharacters
      : ["你", "家", "学", "好", "天", "酒"];
    return list
      .map((character) => String(character).trim())
      .filter((character) => /[\p{Script=Han}]/u.test(character));
  }, []);

  const queryChar = normalizeCharacter(searchParams.get("char") || "");
  useEffect(() => {
    if (!queryChar) return;
    const index = characters.indexOf(queryChar);
    if (index >= 0 && index !== activeIndex) {
      setActiveIndex(index);
    }
  }, [queryChar, characters, activeIndex]);

  const activeCharacter = characters[activeIndex] || "你";
  const matchedWord = words.find(
    (word) => normalizeCharacter(word.chinese) === activeCharacter,
  );

  useEffect(() => {
    if (!targetRef.current) return undefined;

    const options = {
      width: 260,
      height: 260,
      padding: 18,
      showOutline: true,
      showCharacter: true,
      strokeColor: "#ec4899",
      outlineColor: "#fbcfe8",
      drawingColor: "#ec4899",
      drawingWidth: 7,
      delayBetweenStrokes: 180,
      quiz: true,
      showHintAfterMisses: 1,
      highlightOnComplete: true,
      markStrokeCorrectAfterMisses: false,
      acceptBackwardsStrokes: false,
      onCorrectStroke: () => setStatus("Nét đúng!"),
      onMistake: () => setStatus("Sai nét, thử lại."),
      onComplete: () => setStatus("Đúng rồi, bạn giỏi quá!"),
    };

    if (!writerRef.current) {
      writerRef.current = HanziWriter.create(
        targetRef.current,
        activeCharacter,
        options,
      );
      writerRef.current.quiz(options);
      setStatus("Đã tải mẫu chữ");
    } else {
      setStatus("Đang chuyển chữ...");
      writerRef.current.setCharacter(activeCharacter).then(() => {
        writerRef.current.quiz(options);
        setStatus("Đã tải mẫu chữ");
      });
    }

    return undefined;
  }, [activeCharacter]);

  useEffect(() => {
    if (!activeCharacter) {
      setStrokeCount(null);
      return;
    }

    fetch(
      `https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0.1/${encodeURIComponent(
        activeCharacter,
      )}.json`,
    )
      .then((response) => {
        if (!response.ok) throw new Error("Không có dữ liệu");
        return response.json();
      })
      .then((data) => {
        setStrokeCount(data.strokes?.length ?? null);
      })
      .catch(() => setStrokeCount(null));
  }, [activeCharacter]);

  function handlePlay() {
    if (!writerRef.current) return;
    setStatus("Đang vẽ...");
    writerRef.current.animateCharacter({
      onComplete: () => setStatus("Hoàn thành!"),
    });
  }

  function handleReset() {
    if (!writerRef.current) return;
    const quizOptions = {
      showHintAfterMisses: 1,
      highlightOnComplete: true,
      markStrokeCorrectAfterMisses: false,
      acceptBackwardsStrokes: false,
      onCorrectStroke: () => setStatus("Nét đúng!"),
      onMistake: () => setStatus("Sai nét, thử lại."),
      onComplete: () => setStatus("Đúng rồi, bạn giỏi quá!"),
    };

    writerRef.current.quiz(quizOptions);
    setStatus("Đã đặt lại");
  }

  function handleNext() {
    setActiveIndex((prev) => {
      const next = (prev + 1) % characters.length;
      setSearchParams({ char: characters[next] });
      return next;
    });
  }

  function handlePrevious() {
    setActiveIndex((prev) => {
      const next = (prev - 1 + characters.length) % characters.length;
      setSearchParams({ char: characters[next] });
      return next;
    });
  }

  function handleSearch(event) {
    event.preventDefault();
    const char = normalizeCharacter(searchText);
    if (!char) {
      setStatus("Vui lòng nhập một chữ Hán để luyện.");
      return;
    }

    if (!characters.includes(char)) {
      setStatus(`Không tìm thấy chữ “${char}” trong dữ liệu.`);
      return;
    }

    const nextIndex = characters.indexOf(char);
    setActiveIndex(nextIndex >= 0 ? nextIndex : 0);
    setSearchParams({ char });
    setSearchText("");
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-pink-100 bg-white/80 p-6 shadow-sm backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Luyện viết chữ Hán
            </p>
            <h2 className="mt-1 text-2xl font-bold text-gray-950">
              Viết theo nét và xem phản hồi trực tiếp
            </h2>
          </div>
          {/* <div className="rounded-full bg-pink-50 px-3 py-1 text-sm font-semibold text-primary">
            <Sparkles className="mr-1 inline h-4 w-4" />
            Hỗ trợ bởi Hanzi Writer
          </div> */}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[28px] border border-pink-100 bg-white p-6 shadow-sm">
          <div className="flex min-h-[180px] flex-col items-center justify-center gap-3 text-center">
            <div>
              <p className="text-sm font-semibold text-gray-500">
                Mẫu chữ đang luyện
              </p>
              <p className="text-7xl md:text-8xl font-bold text-gray-950 leading-none">
                {activeCharacter}
              </p>
              {/* <p className="mt-1 text-sm text-gray-500">
                Hiển thị {activeIndex + 1}/{characters.length}
              </p> */}
            </div>
            <div className="rounded-2xl bg-pink-50 px-3 py-2 text-sm font-semibold text-primary">
              {status}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handlePrevious}
              className="ghost-button"
            >
              <ChevronLeft className="h-4 w-4" />
              Trước
            </button>
            <button type="button" onClick={handlePlay} className="solid-button">
              <Sparkles className="h-4 w-4" />
              Vẽ mẫu chữ
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="ghost-button"
            >
              <RotateCcw className="h-4 w-4" />
              Vẽ chữ
            </button>
            <button type="button" onClick={handleNext} className="ghost-button">
              Tiếp
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <form onSubmit={handleSearch} className="mt-6 flex flex-wrap gap-2">
            <input
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              className="field flex-1 min-w-[180px]"
              placeholder="Nhập chữ Hán để tìm"
            />
            <button type="submit" className="solid-button">
              Tìm chữ
            </button>
            <button
              type="button"
              onClick={() => {
                setSearchText("");
                navigate("/write");
              }}
              className="ghost-button"
            >
              Xóa tìm
            </button>
          </form>

          <div className="mt-6 flex h-[340px] items-center justify-center rounded-[24px] border border-pink-100 bg-gradient-to-br from-pink-50 via-white to-amber-50 p-4">
            <div
              ref={targetRef}
              className="flex h-full w-full items-center justify-center"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[28px] border border-pink-100 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-950">
              Thông tin từ vựng
            </h3>
            <div className="mt-4 rounded-2xl bg-pink-50 p-4 text-center">
              <p className="text-3xl font-black text-gray-950">
                {activeCharacter}
              </p>
              <p className="mt-2 text-sm font-semibold text-primary">
                {matchedWord?.pinyin || "pīnyīn"}
              </p>
              <p className="mt-2 text-sm text-gray-700">
                {matchedWord?.meaning || "Luyện viết chữ Hán cơ bản."}
              </p>
              <p className="mt-2 text-sm text-gray-700">
                Số nét: {strokeCount ?? "Đang tải..."}
              </p>
            </div>
            {matchedWord?.example && (
              <div className="mt-4">
                <p className="text-sm font-semibold text-gray-500">Ví dụ</p>
                <p className="mt-2 text-sm text-gray-700">
                  {matchedWord.example}
                </p>
              </div>
            )}
          </div>

          <div className="rounded-[28px] border border-pink-100 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-950">Cách dùng</h3>
            <ul className="mt-4 space-y-2 text-sm text-gray-700">
              <li>• Nhấn “Vẽ mẫu chữ” để xem nét viết tự động.</li>
              <li>• Nhẫn “Vẽ chữ” để bắt đầu vẽ chữ.</li>
              <li>• Chọn “Trước/ Tiếp” để luyện nhiều chữ khác nhau.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function normalizeCharacter(value) {
  if (!value) return "";
  const cleaned = String(value).replace(/\s+/g, "");
  const match = [...cleaned].find((char) => /[\p{Script=Han}]/u.test(char));
  return match || "";
}
