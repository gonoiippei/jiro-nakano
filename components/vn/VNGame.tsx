"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";

import { useTypewriter } from "@/hooks/useTypewriter";
import { SCENES, RANDOM_EVENTS, ENDINGS, type Choice, type EndingType } from "@/data/survivalData";
import { VN_BEATS, type Beat, type SceneBeats } from "@/data/vnBeats";

import AngerGaugeHUD from "./AngerGaugeHUD";
import SceneBackground from "./SceneBackground";
import NakanoSprite from "./NakanoSprite";
import DialogueBox from "./DialogueBox";

// ─── 型定義 ──────────────────────────────────────────────────
type VNPhase =
  | "title"      // タイトル画面
  | "beat"       // ビート（ナレーション・会話）
  | "choice"     // 選択肢
  | "reaction"   // リアクションビート
  | "event"      // ランダムイベント
  | "gameover"   // ゲームオーバー
  | "clear";     // クリア

type ChoiceState = {
  selected: number | null;
  result: ("correct" | "wrong" | null)[];
  disabled: boolean;
};

// ─── ユーティリティ ──────────────────────────────────────────
function getSceneBeats(sceneId: number): SceneBeats {
  return VN_BEATS.find((b) => b.sceneId === sceneId) ?? VN_BEATS[0];
}

// ─── メインコンポーネント ─────────────────────────────────────
export default function VNGame() {
  // ゲーム状態
  const [phase, setPhase] = useState<VNPhase>("title");
  const [sceneIndex, setSceneIndex] = useState(0);
  const [gauge, setGauge] = useState(0);
  const [endingType, setEndingType] = useState<EndingType>("gameover");

  // ビート状態
  const [beats, setBeats] = useState<Beat[]>([]);
  const [beatIndex, setBeatIndex] = useState(0);
  const [skipTyping, setSkipTyping] = useState(false);

  // 選択肢状態
  const [choiceState, setChoiceState] = useState<ChoiceState>({
    selected: null,
    result: [],
    disabled: false,
  });
  const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null);

  // イベント状態
  const [activeEvent, setActiveEvent] = useState<typeof RANDOM_EVENTS[0] | null>(null);

  // 赤フラッシュ
  const [isFlashing, setIsFlashing] = useState(false);
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // アニメーション用キー
  const [bgKey, setBgKey] = useState(0);

  // ─── 現在のビート取得 ───────────────────────────────────────
  const currentBeat: Beat = beats[beatIndex] ?? {
    bg: "street",
    sprite: undefined,
    text: "",
  };

  // ─── タイプライター ─────────────────────────────────────────
  const displayText = useTypewriter(
    currentBeat.text,
    skipTyping ? 0 : 28
  );
  const isTyping = displayText.length < currentBeat.text.length;

  // skipTypingを次ビートに進む時にリセット
  useEffect(() => {
    setSkipTyping(false);
  }, [beatIndex, beats]);

  // ─── 赤フラッシュ ──────────────────────────────────────────
  const triggerFlash = useCallback(() => {
    setIsFlashing(true);
    if (flashTimer.current) clearTimeout(flashTimer.current);
    flashTimer.current = setTimeout(() => setIsFlashing(false), 600);
  }, []);

  useEffect(() => {
    return () => {
      if (flashTimer.current) clearTimeout(flashTimer.current);
    };
  }, []);

  // ─── ゲーム開始 ────────────────────────────────────────────
  const startGame = useCallback(() => {
    const scene = SCENES[0];
    const sb = getSceneBeats(scene.id);
    setGauge(0);
    setSceneIndex(0);
    setBeats(sb.preBeats);
    setBeatIndex(0);
    setPhase("beat");
    setBgKey((k) => k + 1);
  }, []);

  // ─── ビート進行（タップ） ───────────────────────────────────
  const handleAdvance = useCallback(() => {
    if (phase !== "beat" && phase !== "reaction") return;

    // タイプライター進行中 → 全文即時表示
    if (isTyping) {
      setSkipTyping(true);
      return;
    }

    // 次のビートへ
    const nextIndex = beatIndex + 1;
    if (nextIndex < beats.length) {
      setBeatIndex(nextIndex);
      return;
    }

    // ビート終了
    if (phase === "beat") {
      // 選択肢へ
      setChoiceState({
        selected: null,
        result: SCENES[sceneIndex].choices.map(() => null),
        disabled: false,
      });
      setSelectedChoice(null);
      setPhase("choice");
    } else if (phase === "reaction") {
      // 次シーンへ、またはエンディング
      advanceScene();
    }
  }, [phase, isTyping, beatIndex, beats.length, sceneIndex]);

  // ─── 選択肢選択 ─────────────────────────────────────────────
  const handleChoiceSelect = useCallback(
    (index: number) => {
      if (choiceState.disabled) return;
      const scene = SCENES[sceneIndex];
      const choice = scene.choices[index];
      const newGauge = Math.max(0, Math.min(100, gauge + choice.gaugeDelta));

      // 視覚フィードバック
      const newResult: ("correct" | "wrong" | null)[] = scene.choices.map((_, i) =>
        i === index ? (choice.isCorrect ? "correct" : "wrong") : null
      );
      setChoiceState({ selected: index, result: newResult, disabled: true });
      setSelectedChoice(choice);
      setGauge(newGauge);

      if (!choice.isCorrect) triggerFlash();

      // ゲームオーバー判定
      if (newGauge >= 100) {
        setTimeout(() => {
          setEndingType("gameover");
          setPhase("gameover");
        }, 1200);
        return;
      }

      // リアクションビートへ
      const sb = getSceneBeats(scene.id);
      const reactionBeats = choice.isCorrect
        ? sb.reactionBeats.correct
        : sb.reactionBeats.wrong;

      setTimeout(() => {
        setBeats(reactionBeats);
        setBeatIndex(0);
        setPhase("reaction");
      }, 800);
    },
    [choiceState.disabled, gauge, sceneIndex, triggerFlash]
  );

  // ─── シーン進行 ─────────────────────────────────────────────
  const advanceScene = useCallback(() => {
    const nextSceneIndex = sceneIndex + 1;

    // 全シーン完了 → エンディング
    if (nextSceneIndex >= SCENES.length) {
      let ending: EndingType;
      if (gauge <= 20) ending = "clear_perfect";
      else if (gauge <= 50) ending = "clear_normal";
      else ending = "clear_close";
      setEndingType(ending);
      setPhase("clear");
      return;
    }

    // ランダムイベント（10%）
    if (Math.random() < 0.1) {
      const event = RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)];
      setActiveEvent(event);
      setPhase("event");
      return;
    }

    goToScene(nextSceneIndex);
  }, [sceneIndex, gauge]);

  const goToScene = useCallback((index: number) => {
    const scene = SCENES[index];
    const sb = getSceneBeats(scene.id);
    setSceneIndex(index);
    setBeats(sb.preBeats);
    setBeatIndex(0);
    setPhase("beat");
    setBgKey((k) => k + 1);
  }, []);

  // ─── イベント解除 ───────────────────────────────────────────
  const handleEventDismiss = useCallback(() => {
    if (!activeEvent) return;
    const newGauge = Math.max(0, Math.min(100, gauge + activeEvent.gaugeDelta));
    setGauge(newGauge);
    setActiveEvent(null);

    if (newGauge >= 100) {
      setEndingType("gameover");
      setPhase("gameover");
    } else {
      goToScene(sceneIndex + 1);
    }
  }, [activeEvent, gauge, sceneIndex, goToScene]);

  // ─── リトライ ───────────────────────────────────────────────
  const handleRetry = useCallback(() => {
    setGauge(0);
    setSceneIndex(0);
    setPhase("title");
    setBeats([]);
    setBeatIndex(0);
    setSelectedChoice(null);
    setIsFlashing(false);
    setBgKey((k) => k + 1);
  }, []);

  // ════════════════════════════════════════════════════════════
  // レンダリング
  // ════════════════════════════════════════════════════════════

  // ─── タイトル画面 ────────────────────────────────────────────
  if (phase === "title") {
    return (
      <div
        style={{
          minHeight: "100svh",
          background: "#1A1A1A",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px 16px",
        }}
      >
        {/* 看板 */}
        <div
          style={{
            background: "#CC0000",
            border: "5px solid #FFF",
            boxShadow: "0 0 0 3px #CC0000, 8px 8px 0 #990000",
            padding: "20px 32px",
            textAlign: "center",
            marginBottom: "24px",
          }}
        >
          <p style={{ color: "#FFF", fontWeight: 900, fontSize: "0.75rem", letterSpacing: "0.2em", marginBottom: "4px" }}>
            ラーメン
          </p>
          <h1
            style={{
              color: "#FFF",
              fontWeight: 900,
              fontSize: "3rem",
              lineHeight: 1,
              textShadow: "3px 3px 0 #990000",
            }}
          >
            二郎
          </h1>
          <p style={{ color: "#FFF", fontWeight: 900, fontSize: "1.4rem", letterSpacing: "0.2em" }}>
            仲野店
          </p>
        </div>

        {/* キャッチ */}
        <div
          style={{
            background: "#F5F0E8",
            border: "3px solid #FFF",
            padding: "14px 20px",
            textAlign: "center",
            marginBottom: "28px",
            maxWidth: "320px",
            width: "100%",
          }}
        >
          <p style={{ fontWeight: 900, fontSize: "1.05rem", color: "#1A1A1A" }}>
            「覚悟して来てんだろうな。」
          </p>
          <p style={{ color: "#888", fontSize: "0.75rem", marginTop: "4px", fontWeight: 700 }}>
            ── 店主・仲野
          </p>
        </div>

        {/* 入店ボタン */}
        <button
          className="jiro-btn"
          style={{ maxWidth: "320px", fontSize: "1.1rem" }}
          onClick={startGame}
        >
          🍜 入店する
        </button>
        <p style={{ color: "#666", fontSize: "0.7rem", marginTop: "10px", textAlign: "center" }}>
          全7場面・仲野ゲージ管理・ランダムイベントあり
        </p>

        <div style={{ marginTop: "20px" }}>
          <Link href="/" style={{ color: "#555", fontSize: "0.7rem" }}>
            ← トップに戻る
          </Link>
        </div>
      </div>
    );
  }

  // ─── ゲームオーバー画面 ──────────────────────────────────────
  if (phase === "gameover") {
    return (
      <div
        style={{
          minHeight: "100svh",
          background: "#CC0000",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px 16px",
          animation: "dangerBlink 0.8s ease-in-out infinite",
        }}
      >
        <div
          style={{
            animation: "impactIn 0.6s cubic-bezier(0.25,0.46,0.45,0.94) both",
            textAlign: "center",
            marginBottom: "24px",
          }}
        >
          <p style={{ color: "#FFF", fontWeight: 900, fontSize: "3.5rem", textShadow: "4px 4px 0 #990000", lineHeight: 1 }}>
            退店命令！
          </p>
          <p style={{ color: "#FFFF00", fontWeight: 900, fontSize: "1.2rem", marginTop: "8px" }}>
            二度と来るな！
          </p>
        </div>

        <div
          style={{
            background: "rgba(0,0,0,0.5)",
            border: "3px solid #FFF",
            padding: "16px 20px",
            marginBottom: "28px",
            maxWidth: "340px",
            textAlign: "center",
          }}
        >
          <p style={{ color: "#FFF", fontWeight: 700, fontSize: "0.9rem", lineHeight: 1.6, fontStyle: "italic" }}>
            {ENDINGS.gameover.nakanoLine}
          </p>
        </div>

        <button
          className="jiro-btn-white"
          style={{ maxWidth: "280px" }}
          onClick={handleRetry}
        >
          もう一度挑戦する
        </button>
        <div style={{ marginTop: "16px" }}>
          <Link href="/" style={{ color: "#FFD", fontSize: "0.7rem" }}>
            ← トップに戻る
          </Link>
        </div>
      </div>
    );
  }

  // ─── クリア画面 ──────────────────────────────────────────────
  if (phase === "clear") {
    const ending = ENDINGS[endingType];
    return (
      <div
        style={{
          minHeight: "100svh",
          background: ending.bgColor,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px 16px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          {endingType === "clear_perfect" ? (
            <p className="gold-shimmer" style={{ fontWeight: 900, fontSize: "2.8rem", lineHeight: 1 }}>
              {ending.title}
            </p>
          ) : (
            <p style={{ color: "#FFF", fontWeight: 900, fontSize: "2.2rem", lineHeight: 1 }}>
              {ending.title}
            </p>
          )}
          <p style={{ color: "#DDD", fontWeight: 700, fontSize: "1rem", marginTop: "8px" }}>
            {ending.subtitle}
          </p>
        </div>

        {/* 仲野ゲージ最終 */}
        <div
          style={{
            background: "rgba(0,0,0,0.4)",
            border: "2px solid #FFF",
            padding: "10px 20px",
            marginBottom: "16px",
            textAlign: "center",
          }}
        >
          <p style={{ color: "#AAA", fontSize: "0.7rem", fontWeight: 700 }}>仲野ゲージ最終値</p>
          <p style={{ color: gauge >= 80 ? "#FF6060" : gauge >= 50 ? "#FFAA00" : "#4DFF91", fontWeight: 900, fontSize: "2rem" }}>
            {gauge} / 100
          </p>
        </div>

        <div
          style={{
            background: "rgba(0,0,0,0.5)",
            border: "3px solid #FFF",
            padding: "16px 20px",
            marginBottom: "28px",
            maxWidth: "340px",
            textAlign: "center",
          }}
        >
          <p style={{ color: "#FFF", fontWeight: 700, fontSize: "0.88rem", lineHeight: 1.6, fontStyle: "italic" }}>
            {ending.nakanoLine}
          </p>
        </div>

        <button
          className="jiro-btn-white"
          style={{ maxWidth: "280px", marginBottom: "12px" }}
          onClick={handleRetry}
        >
          もう一度挑戦する
        </button>
        <Link href="/">
          <button
            className="jiro-btn-white"
            style={{ maxWidth: "280px", fontSize: "0.85rem" }}
          >
            ← トップに戻る
          </button>
        </Link>
      </div>
    );
  }

  // ─── ランダムイベント ────────────────────────────────────────
  if (phase === "event" && activeEvent) {
    return (
      <div
        style={{
          minHeight: "100svh",
          background: "#1A1A1A",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px 16px",
        }}
      >
        <div
          style={{
            background: "#2A2A2A",
            border: "4px solid #CC0000",
            padding: "24px 20px",
            maxWidth: "340px",
            width: "100%",
            textAlign: "center",
            animation: "slideDownFromTop 0.4s cubic-bezier(0.25,0.46,0.45,0.94) both",
          }}
        >
          <p style={{ fontSize: "3rem", marginBottom: "8px" }}>{activeEvent.emoji}</p>
          <p style={{ color: "#CC0000", fontWeight: 900, fontSize: "1.1rem", marginBottom: "12px" }}>
            ⚡ {activeEvent.title}
          </p>
          <p style={{ color: "#CCC", fontSize: "0.85rem", lineHeight: 1.65, whiteSpace: "pre-line", marginBottom: "20px" }}>
            {activeEvent.description}
          </p>
          <div
            style={{
              background: activeEvent.gaugeDelta > 0 ? "rgba(204,0,0,0.2)" : "rgba(46,204,64,0.2)",
              border: `2px solid ${activeEvent.gaugeDelta > 0 ? "#CC0000" : "#2ECC40"}`,
              padding: "8px",
              marginBottom: "16px",
            }}
          >
            <p
              style={{
                color: activeEvent.gaugeDelta > 0 ? "#FF6060" : "#4DFF91",
                fontWeight: 900,
                fontSize: "0.85rem",
              }}
            >
              仲野ゲージ {activeEvent.gaugeDelta > 0 ? "+" : ""}{activeEvent.gaugeDelta}
            </p>
          </div>
          <button className="jiro-btn" onClick={handleEventDismiss}>
            続ける
          </button>
        </div>
      </div>
    );
  }

  // ─── メインゲーム画面（beat / choice / reaction） ────────────
  const currentScene = SCENES[sceneIndex];
  const currentBg = currentBeat.bg ?? "street";
  const currentSprite = currentBeat.sprite;

  // 選択肢フェーズのセリフ
  const choicePhaseText = currentScene.question;

  // 表示するテキストとスピーカー
  const displaySpeaker = phase === "choice" ? undefined : currentBeat.speaker;
  const displayBody =
    phase === "choice"
      ? choicePhaseText
      : displayText;

  return (
    <div
      style={{
        minHeight: "100svh",
        background: "#1A1A1A",
        display: "flex",
        flexDirection: "column",
        maxWidth: "480px",
        margin: "0 auto",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* 赤フラッシュオーバーレイ */}
      {isFlashing && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(204,0,0,0.4)",
            zIndex: 100,
            pointerEvents: "none",
            animation: "redFlash 0.6s ease-out both",
          }}
        />
      )}

      {/* ─── HUD（上部ゲージ） ─── */}
      <AngerGaugeHUD
        gauge={gauge}
        sceneIndex={sceneIndex}
        totalScenes={SCENES.length}
      />

      {/* ─── 場面タイトルバナー ─── */}
      <div
        key={`scene-${sceneIndex}`}
        style={{
          background: "#CC0000",
          color: "#FFF",
          fontWeight: 900,
          fontSize: "0.72rem",
          textAlign: "center",
          padding: "3px 8px",
          letterSpacing: "0.08em",
          animation: "scenePopIn 0.4s cubic-bezier(0.25,0.46,0.45,0.94) both",
        }}
      >
        {currentScene.title}
      </div>

      {/* ─── 背景＋スプライトエリア ─── */}
      <div
        key={`bg-${bgKey}`}
        style={{
          flex: 1,
          position: "relative",
          minHeight: "200px",
          maxHeight: "300px",
          overflow: "hidden",
          animation: "slideInFromRight 0.4s cubic-bezier(0.25,0.46,0.45,0.94) both",
        }}
      >
        {/* 背景 */}
        <div style={{ position: "absolute", inset: 0 }}>
          <SceneBackground bg={currentBg} />
        </div>

        {/* キャラクタースプライト（右下） */}
        {currentSprite && (
          <div
            key={`sprite-${currentSprite}`}
            style={{
              position: "absolute",
              bottom: 0,
              right: "8px",
              animation: "vnSpriteEnter 0.35s cubic-bezier(0.25,0.46,0.45,0.94) both",
              filter: "drop-shadow(4px 4px 0 rgba(0,0,0,0.5))",
            }}
          >
            <NakanoSprite expression={currentSprite} />
          </div>
        )}
      </div>

      {/* ─── ダイアログボックス ─── */}
      <div
        style={{
          padding: "10px 12px 14px",
          background: "transparent",
        }}
      >
        <DialogueBox
          speaker={displaySpeaker}
          text={phase === "choice" ? choicePhaseText : displayText}
          isTyping={phase === "choice" ? false : isTyping}
          onAdvance={handleAdvance}
          showChoices={phase === "choice"}
          choices={
            phase === "choice"
              ? currentScene.choices.map((c, i) => ({
                  text: c.text,
                  isCorrect: c.isCorrect,
                  disabled: choiceState.disabled,
                  selected: choiceState.selected === i,
                  result: choiceState.result[i] ?? undefined,
                }))
              : []
          }
          onChoiceSelect={handleChoiceSelect}
          choiceKey={sceneIndex}
        />
      </div>
    </div>
  );
}
