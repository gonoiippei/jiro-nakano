"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { SCENES, RANDOM_EVENTS, ENDINGS, type Choice, type RandomEvent, type EndingType } from "@/data/survivalData";
import { useTypewriter } from "@/hooks/useTypewriter";

type GamePhase = "start" | "playing" | "choice_result" | "event" | "gameover" | "clear";

// 仲野ゲージのカラーと状態
function getGaugeColor(gauge: number): string {
  if (gauge <= 30) return "#4ade80";
  if (gauge <= 60) return "#facc15";
  if (gauge <= 80) return "#fb923c";
  return "#ef4444";
}

function getGaugeLabel(gauge: number): string {
  if (gauge <= 20) return "普通";
  if (gauge <= 40) return "不機嫌";
  if (gauge <= 60) return "イライラ";
  if (gauge <= 80) return "激怒寸前";
  return "爆発寸前！！";
}

// 仲野の表情URL
const NAKANO_IMGS = {
  normal: "https://placehold.co/400x280/f5f0e8/1a1a1a?text=%E4%BB%B2%E9%87%8E%EF%BC%88%E6%99%AE%E9%80%9A%EF%BC%89",
  angry: "https://placehold.co/400x280/cc0000/ffffff?text=%E4%BB%B2%E9%87%8E%EF%BC%88%E6%80%92%EF%BC%89",
  furious: "https://placehold.co/400x280/990000/ffffff?text=%E4%BB%B2%E9%87%8E%EF%BC%88%E6%BF%80%E6%80%92%EF%BC%89",
  satisfied: "https://placehold.co/400x280/1a5c1a/ffffff?text=%E4%BB%B2%E9%87%8E%EF%BC%88%E6%BA%80%E8%B6%B3%EF%BC%89",
  event: "https://placehold.co/400x280/4a4a00/ffffff?text=%E4%BB%B2%E9%87%8E%EF%BC%88%E6%B3%A8%E7%9B%AE%EF%BC%89",
};

function getNakanoImg(gauge: number, phase: GamePhase, isCorrect: boolean | null): string {
  if (phase === "gameover") return NAKANO_IMGS.furious;
  if (phase === "clear") return NAKANO_IMGS.satisfied;
  if (phase === "event") return NAKANO_IMGS.event;
  if (phase === "choice_result") {
    if (isCorrect) return NAKANO_IMGS.satisfied;
    if (gauge > 80) return NAKANO_IMGS.furious;
    return NAKANO_IMGS.angry;
  }
  if (gauge > 80) return NAKANO_IMGS.furious;
  if (gauge > 50) return NAKANO_IMGS.angry;
  return NAKANO_IMGS.normal;
}

// ===== AngerGauge コンポーネント =====
function AngerGauge({ gauge }: { gauge: number }) {
  const color = getGaugeColor(gauge);
  const label = getGaugeLabel(gauge);
  const isDanger = gauge > 80;

  return (
    <div
      className="w-full px-3 py-2"
      style={{ background: "#2a2a2a", borderBottom: "2px solid #444" }}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-white font-black text-xs tracking-wider">仲野ゲージ（怒り度）</span>
        <span
          className="font-black text-xs px-2 py-0.5"
          style={{
            color: color,
            border: `1px solid ${color}`,
            animation: isDanger ? "gaugePulse 0.8s ease-in-out infinite" : "none",
          }}
        >
          {label}
        </span>
      </div>
      <div className="w-full h-4 relative" style={{ background: "#444" }}>
        <div
          className="h-full absolute left-0 top-0"
          style={{
            width: `${gauge}%`,
            background: color,
            transition: "width 0.6s cubic-bezier(0.4, 0, 0.2, 1), background 0.4s ease",
            animation: isDanger ? "gaugePulse 0.8s ease-in-out infinite" : "none",
          }}
        />
        {/* ゲージのメモリ */}
        {[25, 50, 75].map((mark) => (
          <div
            key={mark}
            className="absolute top-0 h-full w-px"
            style={{ left: `${mark}%`, background: "rgba(255,255,255,0.2)" }}
          />
        ))}
      </div>
      <div className="flex justify-between mt-0.5">
        <span className="text-gray-500 text-xs">0</span>
        <span className="font-black text-xs" style={{ color }}>{gauge} / 100</span>
      </div>
    </div>
  );
}

// ===== メインコンポーネント =====
export default function SurvivalGame() {
  const [gamePhase, setGamePhase] = useState<GamePhase>("start");
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [gauge, setGauge] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null);
  const [showReaction, setShowReaction] = useState(false);
  const [activeEvent, setActiveEvent] = useState<RandomEvent | null>(null);
  const [isFlashing, setIsFlashing] = useState(false);
  const [sceneKey, setSceneKey] = useState(0);
  const [endingType, setEndingType] = useState<EndingType>("gameover");
  const [choiceAnimKey, setChoiceAnimKey] = useState(0);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentScene = SCENES[currentSceneIndex];
  const isLastScene = currentSceneIndex === SCENES.length - 1;

  // タイプライター（場面の状況説明）
  const situationText = useTypewriter(
    gamePhase === "playing" ? currentScene?.situation ?? "" : "",
    25
  );

  // リアクションのタイプライター
  const reactionText = useTypewriter(
    showReaction && selectedChoice ? `「${selectedChoice.reaction}」` : "",
    35
  );

  // イベントのタイプライター
  const eventText = useTypewriter(
    activeEvent ? activeEvent.description : "",
    30
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // 赤フラッシュ
  const triggerFlash = useCallback(() => {
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 600);
  }, []);

  // 次の場面へ進む
  const advanceScene = useCallback(() => {
    setSelectedChoice(null);
    setShowReaction(false);
    setSceneKey((k) => k + 1);
    setChoiceAnimKey((k) => k + 1);
    setCurrentSceneIndex((i) => i + 1);
    setGamePhase("playing");
  }, []);

  // 選択肢を選んだとき
  const handleChoice = useCallback(
    (choice: Choice) => {
      if (gamePhase !== "playing") return;
      setSelectedChoice(choice);
      setShowReaction(true);
      setGamePhase("choice_result");

      const newGauge = Math.min(100, Math.max(0, gauge + choice.gaugeDelta));
      setGauge(newGauge);

      if (!choice.isCorrect) {
        triggerFlash();
      }

      // ゲームオーバー判定
      if (newGauge >= 100) {
        timerRef.current = setTimeout(() => {
          setEndingType("gameover");
          setGamePhase("gameover");
        }, 2200);
        return;
      }

      // 次へ
      timerRef.current = setTimeout(() => {
        if (isLastScene) {
          // クリア判定
          let ending: EndingType;
          if (newGauge <= 30) ending = "clear_perfect";
          else if (newGauge <= 60) ending = "clear_normal";
          else ending = "clear_close";
          setEndingType(ending);
          setGamePhase("clear");
          return;
        }

        // ランダムイベント判定（10%）
        if (Math.random() < 0.1) {
          const ev = RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)];
          setActiveEvent(ev);
          setGamePhase("event");
        } else {
          advanceScene();
        }
      }, 2200);
    },
    [gamePhase, gauge, isLastScene, triggerFlash, advanceScene]
  );

  // ランダムイベント確認後
  const handleEventDismiss = useCallback(() => {
    if (!activeEvent) return;
    const newGauge = Math.min(100, Math.max(0, gauge + activeEvent.gaugeDelta));
    setGauge(newGauge);
    setActiveEvent(null);

    if (newGauge >= 100) {
      setEndingType("gameover");
      setGamePhase("gameover");
    } else {
      advanceScene();
    }
  }, [activeEvent, gauge, advanceScene]);

  // リトライ
  const handleRetry = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setGamePhase("start");
    setCurrentSceneIndex(0);
    setGauge(0);
    setSelectedChoice(null);
    setShowReaction(false);
    setActiveEvent(null);
    setIsFlashing(false);
    setSceneKey(0);
    setChoiceAnimKey(0);
  };

  const nakanoImg = getNakanoImg(gauge, gamePhase, selectedChoice?.isCorrect ?? null);

  // ===== スタート画面 =====
  if (gamePhase === "start") {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: "#1a1a1a" }}>
        <div className="w-full py-2 text-center text-white font-black text-xs tracking-widest" style={{ background: "#cc0000" }}>
          ★ ラーメン二郎 仲野店 ★ プチサバイバルゲーム ★
        </div>

        <div className="flex flex-col items-center max-w-lg w-full mx-auto px-4 py-6 flex-1">
          {/* タイトル */}
          <div
            className="w-full text-center py-5 px-4 mb-5"
            style={{
              background: "#cc0000",
              border: "5px solid #fff",
              boxShadow: "8px 8px 0 #990000",
            }}
          >
            <p className="text-white font-black text-xs tracking-widest mb-1">ラーメン二郎 仲野店</p>
            <h1 className="text-white font-black leading-tight" style={{ fontSize: "2rem" }}>
              プチサバイバル
            </h1>
            <p className="text-white font-black text-lg opacity-80">無事に完食して出られるか</p>
          </div>

          {/* 仲野の画像 */}
          <div className="w-full mb-5" style={{ border: "4px solid #fff", maxHeight: "200px", overflow: "hidden" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={NAKANO_IMGS.normal}
              alt="店主・仲野"
              className="w-full object-cover"
              style={{ maxHeight: "200px" }}
            />
          </div>

          {/* ゲーム説明 */}
          <div
            className="w-full p-4 mb-4"
            style={{ background: "#f5f0e8", border: "3px solid #fff", boxShadow: "4px 4px 0 #fff" }}
          >
            <p className="font-black text-lg mb-3" style={{ color: "#cc0000" }}>ゲームの流れ</p>
            <ul className="space-y-2 text-sm font-bold" style={{ color: "#1a1a1a" }}>
              <li>🍜 客として入店し、全7場面を乗り越えろ</li>
              <li>😡 間違えると「仲野ゲージ」が上昇</li>
              <li>💥 ゲージが100に達したら「退店命令」</li>
              <li>⚡ 10%の確率でランダムイベント発生</li>
              <li>🏆 全場面突破で「完食認定」</li>
            </ul>
          </div>

          <div
            className="w-full p-3 mb-5 text-center text-xs font-bold"
            style={{ background: "#fff3cd", border: "2px solid #cc0000", color: "#cc0000" }}
          >
            ⚠ 問題の半分は「意地悪問題」です。ジロリアンでも騙されるかも。
          </div>

          <button
            onClick={() => {
              setGamePhase("playing");
              setChoiceAnimKey((k) => k + 1);
            }}
            className="jiro-btn text-xl font-black tracking-widest py-5"
          >
            ▶ 入 店 す る
          </button>

          <Link href="/" className="w-full mt-3">
            <button className="jiro-btn-white text-center font-black">
              ← トップに戻る
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // ===== ゲームオーバー画面 =====
  if (gamePhase === "gameover") {
    const ending = ENDINGS["gameover"];
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-4"
        style={{ background: "#cc0000", animation: "dangerBlink 1s ease-in-out 3" }}
      >
        <div className="max-w-lg w-full text-center">
          {/* 仲野の画像 */}
          <div className="w-full mb-5 mx-auto" style={{ border: "4px solid #fff", maxHeight: "200px", overflow: "hidden" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={NAKANO_IMGS.furious} alt="激怒した仲野" className="w-full object-cover" style={{ maxHeight: "200px" }} />
          </div>

          {/* 退店命令 */}
          <div className="impact-in mb-4">
            <p
              className="font-black text-white"
              style={{ fontSize: "3.5rem", textShadow: "4px 4px 0 #990000", lineHeight: 1 }}
            >
              退店命令！
            </p>
          </div>

          <div className="fade-in" style={{ animationDelay: "0.5s", animationFillMode: "both" }}>
            <p className="text-white font-black text-xl mb-4">{ending.subtitle}</p>
            <div
              className="p-4 mb-5 text-left"
              style={{ background: "rgba(0,0,0,0.3)", border: "2px solid #fff" }}
            >
              <p className="text-white font-black text-lg">{ending.nakanoLine}</p>
            </div>

            <div
              className="p-3 mb-5"
              style={{ background: "rgba(0,0,0,0.3)", border: "1px solid #fff" }}
            >
              <p className="text-white font-bold text-sm">
                ゲージ到達: {gauge}/100 ｜ 突破場面: {currentSceneIndex}/{SCENES.length}
              </p>
            </div>

            <div className="space-y-3">
              <button onClick={handleRetry} className="jiro-btn-white text-center font-black text-lg py-4">
                ▶ もう一度挑戦する
              </button>
              <Link href="/" className="w-full">
                <button className="font-black text-white text-sm w-full py-2" style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.4)" }}>
                  トップに戻る
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===== クリア画面 =====
  if (gamePhase === "clear") {
    const ending = ENDINGS[endingType];
    const isPerfect = endingType === "clear_perfect";
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-4"
        style={{ background: ending.bgColor }}
      >
        <div className="max-w-lg w-full text-center">
          {/* 仲野の画像 */}
          <div className="w-full mb-5 mx-auto" style={{ border: "4px solid #fff", maxHeight: "200px", overflow: "hidden" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={NAKANO_IMGS.satisfied} alt="満足した仲野" className="w-full object-cover" style={{ maxHeight: "200px" }} />
          </div>

          {/* クリアタイトル */}
          <div className="impact-in mb-2">
            <p className="font-black text-white" style={{ fontSize: "2.8rem", textShadow: "3px 3px 0 rgba(0,0,0,0.3)", lineHeight: 1.1 }}>
              {isPerfect ? (
                <span className="gold-shimmer">{ending.title}</span>
              ) : (
                ending.title
              )}
            </p>
          </div>

          <div className="fade-in" style={{ animationDelay: "0.4s", animationFillMode: "both" }}>
            <p className="text-white font-black text-lg mb-4 opacity-90">{ending.subtitle}</p>

            <div
              className="p-4 mb-4 text-left"
              style={{ background: "rgba(0,0,0,0.25)", border: "2px solid rgba(255,255,255,0.6)" }}
            >
              <p className="text-white font-black text-lg">{ending.nakanoLine}</p>
            </div>

            {/* スコア詳細 */}
            <div
              className="p-3 mb-5"
              style={{ background: "rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.4)" }}
            >
              <div className="flex justify-between text-white font-bold text-sm mb-2">
                <span>突破場面</span>
                <span className="font-black">{SCENES.length} / {SCENES.length} 場面</span>
              </div>
              <div className="flex justify-between text-white font-bold text-sm">
                <span>最終ゲージ</span>
                <span className="font-black" style={{ color: getGaugeColor(gauge) }}>{gauge} / 100</span>
              </div>
            </div>

            <div className="space-y-3">
              <button onClick={handleRetry} className="jiro-btn-white text-center font-black text-lg py-4">
                ▶ もう一度挑戦する
              </button>
              <Link href="/" className="w-full">
                <button className="font-black text-white text-sm w-full py-2" style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.4)" }}>
                  トップに戻る
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===== ゲームプレイ画面 =====
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#1a1a1a" }}>
      {/* 赤フラッシュオーバーレイ */}
      {isFlashing && (
        <div
          className="fixed inset-0 pointer-events-none z-50 red-flash"
          style={{ background: "#ef4444" }}
        />
      )}

      {/* ヘッダー */}
      <div className="w-full py-2 px-3 flex items-center justify-between" style={{ background: "#cc0000" }}>
        <span className="text-white font-black text-xs">ラーメン二郎 仲野店</span>
        <span className="text-white font-black text-xs">
          場面 {currentSceneIndex + 1} / {SCENES.length}
        </span>
      </div>

      {/* 仲野ゲージ */}
      <AngerGauge gauge={gauge} />

      {/* ランダムイベントオーバーレイ */}
      {gamePhase === "event" && activeEvent && (
        <div className="fixed inset-0 flex items-start justify-center z-40 pt-16 px-4">
          <div
            className="w-full max-w-lg event-slide-down"
            style={{
              background: "#1a1a1a",
              border: "4px solid #facc15",
              boxShadow: "0 8px 32px rgba(0,0,0,0.8)",
            }}
          >
            <div className="py-2 px-4 text-center font-black text-sm tracking-widest" style={{ background: "#facc15", color: "#1a1a1a" }}>
              ⚡ 突発イベント！
            </div>
            <div className="p-5">
              <p className="text-center font-black text-3xl mb-2">{activeEvent.emoji}</p>
              <p className="text-white font-black text-xl text-center mb-3">{activeEvent.title}</p>
              <p className="text-gray-300 text-sm whitespace-pre-line leading-relaxed mb-4">{eventText}</p>
              <div
                className="p-2 mb-4 text-center text-sm font-bold"
                style={{
                  background: activeEvent.gaugeDelta < 0 ? "rgba(74,222,128,0.15)" : "rgba(239,68,68,0.15)",
                  border: `1px solid ${activeEvent.gaugeDelta < 0 ? "#4ade80" : "#ef4444"}`,
                  color: activeEvent.gaugeDelta < 0 ? "#4ade80" : "#ef4444",
                }}
              >
                仲野ゲージ {activeEvent.gaugeDelta < 0 ? `▼ ${Math.abs(activeEvent.gaugeDelta)}` : `▲ +${activeEvent.gaugeDelta}`}
              </div>
              <button onClick={handleEventDismiss} className="jiro-btn font-black text-lg tracking-widest py-3">
                ▶ 続ける
              </button>
            </div>
          </div>
        </div>
      )}

      {/* メインコンテンツ */}
      <div className="flex flex-col items-center max-w-lg w-full mx-auto px-3 py-4 flex-1">

        {/* 仲野の画像 */}
        <div
          className="w-full mb-3 relative overflow-hidden"
          style={{
            border: `3px solid ${gauge > 80 ? "#ef4444" : "#fff"}`,
            maxHeight: "180px",
            transition: "border-color 0.3s ease",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={nakanoImg}
            alt="店主・仲野"
            className="w-full object-cover"
            style={{
              maxHeight: "180px",
              transition: "filter 0.4s ease",
              filter: gauge > 80 ? "brightness(1.1) saturate(1.3)" : "none",
            }}
          />
          <div className="absolute bottom-0 left-0 right-0 py-1 px-3" style={{ background: "rgba(26,26,26,0.85)" }}>
            <div className="flex items-center justify-between">
              <span className="text-white font-black text-xs">店主・仲野</span>
              {currentScene?.type === "trick" && gamePhase === "playing" && (
                <span className="text-xs font-bold px-2 py-0.5" style={{ background: "#cc0000", color: "#fff" }}>
                  ⚠ 意地悪問題
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 場面カード */}
        <div key={sceneKey} className="w-full scene-slide-in mb-4">
          {/* 場面タイトル */}
          <div className="flex items-center gap-2 mb-2">
            <div
              className="px-3 py-1 scene-pop-in"
              style={{ background: "#cc0000", border: "2px solid #fff" }}
            >
              <span className="text-white font-black text-xs">{currentScene?.title}</span>
            </div>
          </div>

          {/* 状況説明（タイプライター） */}
          {!showReaction && (
            <div
              className="w-full p-3 mb-3"
              style={{
                background: "#f5f0e8",
                border: "3px solid #fff",
                boxShadow: "3px 3px 0 #fff",
                minHeight: "90px",
              }}
            >
              <p className="font-bold text-sm whitespace-pre-line leading-relaxed" style={{ color: "#1a1a1a" }}>
                {situationText}
                {situationText.length < (currentScene?.situation?.length ?? 0) && (
                  <span className="inline-block w-2 h-4 ml-0.5 animate-pulse" style={{ background: "#cc0000", verticalAlign: "middle" }} />
                )}
              </p>
            </div>
          )}

          {/* リアクション */}
          {showReaction && selectedChoice && (
            <div
              className="w-full p-3 mb-3 fade-in"
              style={{
                background: selectedChoice.isCorrect ? "#1a5c1a" : "#cc0000",
                border: "3px solid #fff",
                boxShadow: "3px 3px 0 #fff",
                minHeight: "90px",
              }}
            >
              <p className="text-white font-black text-sm mb-1">
                {selectedChoice.isCorrect ? "✓ 正解！" : "✗ 不正解！"}
              </p>
              <p className="text-white font-black text-lg leading-snug">
                {reactionText}
                {reactionText.length < (`「${selectedChoice.reaction}」`).length && (
                  <span className="inline-block w-2 h-4 ml-0.5 animate-pulse" style={{ background: "rgba(255,255,255,0.8)", verticalAlign: "middle" }} />
                )}
              </p>
              {!selectedChoice.isCorrect && (
                <p className="text-white text-xs mt-2 opacity-80">
                  ゲージ +{selectedChoice.gaugeDelta}
                </p>
              )}
            </div>
          )}

          {/* 問いかけ */}
          {!showReaction && (
            <p className="text-white font-black text-base mb-3 text-center">
              {currentScene?.question}
            </p>
          )}
        </div>

        {/* 選択肢 */}
        {gamePhase === "playing" && !showReaction && (
          <div key={choiceAnimKey} className="w-full space-y-2">
            {currentScene?.choices.map((choice, i) => (
              <button
                key={i}
                onClick={() => handleChoice(choice)}
                className="survival-choice-btn bounce-in-up"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <span className="font-black mr-2 text-sm" style={{ color: "#cc0000" }}>
                  {["A", "B", "C", "D"][i]}.
                </span>
                {choice.text}
              </button>
            ))}
          </div>
        )}

        {/* 選択後の「次へ」ボタン */}
        {gamePhase === "choice_result" && showReaction && (
          <div className="w-full fade-in" style={{ animationDelay: "1s", animationFillMode: "both" }}>
            <p className="text-gray-400 text-xs text-center mb-2">
              {gauge >= 80 ? "⚠ ゲージが危険域です！" : ""}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
