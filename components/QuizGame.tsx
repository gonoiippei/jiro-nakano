"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { questions, angerMessages } from "@/data/questions";

type GameState = "question" | "correct" | "wrong";

export default function QuizGame() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [gameState, setGameState] = useState<GameState>("question");
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [currentAngerMsg, setCurrentAngerMsg] = useState("");
  const [isShaking, setIsShaking] = useState(false);

  const currentQuestion = questions[currentIndex];

  const handleChoice = (choiceIndex: number) => {
    if (gameState !== "question") return;
    setSelectedChoice(choiceIndex);

    if (choiceIndex === currentQuestion.correctIndex) {
      setGameState("correct");
      setScore((s) => s + 1);
    } else {
      const randomMsg =
        currentQuestion.wrongMessages[
          Math.floor(Math.random() * currentQuestion.wrongMessages.length)
        ];
      setCurrentAngerMsg(randomMsg);
      setGameState("wrong");
      setWrongCount((w) => w + 1);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 700);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 >= questions.length) {
      router.push(
        `/result?score=${score + (gameState === "correct" ? 0 : 0)}&total=${questions.length}&wrong=${wrongCount}`
      );
    } else {
      setCurrentIndex((i) => i + 1);
      setGameState("question");
      setSelectedChoice(null);
      setCurrentAngerMsg("");
    }
  };

  const progress = ((currentIndex + 1) / questions.length) * 100;

  // 仲野の表情URL（ダミー）
  const nakanoImages = {
    normal: "https://placehold.co/400x400/f5f0e8/1a1a1a?text=%E4%BB%B2%E9%87%8E%EF%BC%88%E6%99%AE%E9%80%9A%EF%BC%89",
    angry: "https://placehold.co/400x400/cc0000/ffffff?text=%E4%BB%B2%E9%87%8E%EF%BC%88%E6%80%92%EF%BC%89",
    happy: "https://placehold.co/400x400/1a1a1a/ffffff?text=%E4%BB%B2%E9%87%8E%EF%BC%88%E6%BA%80%E8%B6%B3%EF%BC%89",
  };

  const nakanoImg =
    gameState === "wrong"
      ? nakanoImages.angry
      : gameState === "correct"
      ? nakanoImages.happy
      : nakanoImages.normal;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#1a1a1a" }}>
      {/* ヘッダー */}
      <div className="w-full py-2 px-4 flex items-center justify-between" style={{ background: "#cc0000" }}>
        <span className="text-white font-black text-sm">ラーメン二郎 仲野店</span>
        <span className="text-white font-black text-sm">
          {currentIndex + 1} / {questions.length}問
        </span>
      </div>

      {/* プログレスバー */}
      <div className="w-full h-3" style={{ background: "#333" }}>
        <div
          className="h-full transition-all duration-500"
          style={{ width: `${progress}%`, background: "#cc0000" }}
        />
      </div>

      <div className="flex flex-col items-center max-w-lg w-full mx-auto px-4 py-6 flex-1">
        {/* 仲野の画像 */}
        <div
          className={`w-full mb-4 relative overflow-hidden ${isShaking ? "shake" : ""}`}
          style={{ border: "4px solid #fff", maxHeight: "220px" }}
        >
          <Image
            src={nakanoImg}
            alt="店主・仲野"
            width={400}
            height={220}
            className="w-full object-cover"
            style={{ maxHeight: "220px" }}
            unoptimized
          />
          <div
            className="absolute bottom-0 left-0 right-0 py-1 px-3"
            style={{ background: "rgba(26,26,26,0.85)" }}
          >
            <span className="text-white font-black text-sm">店主・仲野</span>
          </div>
        </div>

        {/* 問題 or リアクション */}
        {gameState === "question" && (
          <div
            className="w-full p-4 mb-5 fade-in"
            style={{
              background: "#f5f0e8",
              border: "3px solid #fff",
              boxShadow: "4px 4px 0 #fff",
            }}
          >
            <p className="font-bold text-xs mb-2" style={{ color: "#cc0000" }}>
              第{currentIndex + 1}問
            </p>
            <p className="font-black text-lg whitespace-pre-line" style={{ color: "#1a1a1a" }}>
              {currentQuestion.situation}
            </p>
          </div>
        )}

        {gameState === "wrong" && (
          <div
            className="w-full p-4 mb-5 fade-in"
            style={{
              background: "#cc0000",
              border: "3px solid #fff",
              boxShadow: "4px 4px 0 #990000",
            }}
          >
            <p className="text-white font-black text-2xl text-center mb-2">
              ❌ 不正解！
            </p>
            <p className="text-white font-black text-xl text-center">
              「{currentAngerMsg}」
            </p>
            <div
              className="mt-3 p-3 text-sm"
              style={{ background: "rgba(0,0,0,0.3)", color: "#ffd" }}
            >
              <p className="font-bold mb-1">正解は：</p>
              <p>{currentQuestion.choices[currentQuestion.correctIndex]}</p>
              <p className="mt-2 text-xs opacity-80">{currentQuestion.explanation}</p>
            </div>
          </div>
        )}

        {gameState === "correct" && (
          <div
            className="w-full p-4 mb-5 fade-in"
            style={{
              background: "#1a5c1a",
              border: "3px solid #fff",
              boxShadow: "4px 4px 0 #0d3d0d",
            }}
          >
            <p className="text-white font-black text-2xl text-center mb-2">
              ✓ 正解！
            </p>
            <p className="text-white font-black text-xl text-center">
              「{currentQuestion.correctMessage}」
            </p>
            <p className="mt-2 text-xs text-green-200 text-center">
              {currentQuestion.explanation}
            </p>
          </div>
        )}

        {/* 選択肢 */}
        {gameState === "question" && (
          <div className="w-full space-y-3">
            {currentQuestion.choices.map((choice, i) => (
              <button
                key={i}
                onClick={() => handleChoice(i)}
                className="jiro-btn-white"
              >
                <span className="font-black mr-2" style={{ color: "#cc0000" }}>
                  {["A", "B", "C", "D"][i]}.
                </span>
                {choice}
              </button>
            ))}
          </div>
        )}

        {/* 次へボタン */}
        {(gameState === "correct" || gameState === "wrong") && (
          <button onClick={handleNext} className="jiro-btn mt-4 text-lg font-black tracking-widest">
            {currentIndex + 1 >= questions.length ? "▶ 結果を見る" : "▶ 次の問題"}
          </button>
        )}

        {/* スコア表示 */}
        <div className="mt-4 text-center">
          <span className="text-white text-sm font-bold">
            現在のスコア：{score} / {currentIndex + (gameState !== "question" ? 1 : 0)} 問正解
          </span>
        </div>
      </div>
    </div>
  );
}
