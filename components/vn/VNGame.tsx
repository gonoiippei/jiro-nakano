"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";

import { useTypewriter } from "@/hooks/useTypewriter";
import { SCENES, RANDOM_EVENTS, ENDINGS, type Choice, type EndingType } from "@/data/survivalData";
import { VN_BEATS, type Beat, type SceneBeats } from "@/data/vnBeats";

import AngerGaugeHUD from "./AngerGaugeHUD";
import SceneBackground from "./SceneBackground";
import NakanoPhoto from "./NakanoPhoto";
import DialogueBox from "./DialogueBox";

// ─── 型 ─────────────────────────────────────────────────────
type VNPhase =
  | "title"
  | "beat"
  | "choice"
  | "reaction"
  | "event"
  | "gameover"
  | "clear";

type ChoiceState = {
  selected: number | null;
  result: ("correct" | "wrong" | null)[];
  disabled: boolean;
};

// ─── ユーティリティ ──────────────────────────────────────────
function getSceneBeats(sceneId: number): SceneBeats {
  return VN_BEATS.find((b) => b.sceneId === sceneId) ?? VN_BEATS[0];
}

// ────────────────────────────────────────────────────────────
export default function VNGame() {
  const [phase, setPhase]               = useState<VNPhase>("title");
  const [sceneIndex, setSceneIndex]     = useState(0);
  const [gauge, setGauge]               = useState(0);
  const [endingType, setEndingType]     = useState<EndingType>("gameover");
  const [beats, setBeats]               = useState<Beat[]>([]);
  const [beatIndex, setBeatIndex]       = useState(0);
  const [skipTyping, setSkipTyping]     = useState(false);
  const [choiceState, setChoiceState]   = useState<ChoiceState>({
    selected: null, result: [], disabled: false,
  });
  const [activeEvent, setActiveEvent]   = useState<typeof RANDOM_EVENTS[0] | null>(null);
  const [isFlashing, setIsFlashing]     = useState(false);
  const [bgKey, setBgKey]               = useState(0);
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentBeat: Beat = beats[beatIndex] ?? { bg: "street", sprite: undefined, text: "" };

  // タイプライター
  const displayText = useTypewriter(currentBeat.text, skipTyping ? 0 : 26);
  const isTyping = displayText.length < currentBeat.text.length;

  useEffect(() => { setSkipTyping(false); }, [beatIndex, beats]);

  // 赤フラッシュ
  const triggerFlash = useCallback(() => {
    setIsFlashing(true);
    if (flashTimer.current) clearTimeout(flashTimer.current);
    flashTimer.current = setTimeout(() => setIsFlashing(false), 600);
  }, []);
  useEffect(() => () => { if (flashTimer.current) clearTimeout(flashTimer.current); }, []);

  // ゲーム開始
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

  // ビート進行
  const handleAdvance = useCallback(() => {
    if (phase !== "beat" && phase !== "reaction") return;
    if (isTyping) { setSkipTyping(true); return; }
    const nextIndex = beatIndex + 1;
    if (nextIndex < beats.length) { setBeatIndex(nextIndex); return; }
    if (phase === "beat") {
      setChoiceState({ selected: null, result: SCENES[sceneIndex].choices.map(() => null), disabled: false });
      setPhase("choice");
    } else if (phase === "reaction") {
      advanceScene();
    }
  }, [phase, isTyping, beatIndex, beats.length, sceneIndex]);

  // 選択肢
  const handleChoiceSelect = useCallback((index: number) => {
    if (choiceState.disabled) return;
    const scene = SCENES[sceneIndex];
    const choice = scene.choices[index];
    const newGauge = Math.max(0, Math.min(100, gauge + choice.gaugeDelta));
    const newResult: ("correct" | "wrong" | null)[] = scene.choices.map((_, i) =>
      i === index ? (choice.isCorrect ? "correct" : "wrong") : null
    );
    setChoiceState({ selected: index, result: newResult, disabled: true });
    setGauge(newGauge);
    if (!choice.isCorrect) triggerFlash();
    if (newGauge >= 100) {
      setTimeout(() => { setEndingType("gameover"); setPhase("gameover"); }, 1200);
      return;
    }
    const sb = getSceneBeats(scene.id);
    const reactionBeats = choice.isCorrect ? sb.reactionBeats.correct : sb.reactionBeats.wrong;
    setTimeout(() => { setBeats(reactionBeats); setBeatIndex(0); setPhase("reaction"); }, 800);
  }, [choiceState.disabled, gauge, sceneIndex, triggerFlash]);

  // シーン進行
  const advanceScene = useCallback(() => {
    const nextSceneIndex = sceneIndex + 1;
    if (nextSceneIndex >= SCENES.length) {
      let ending: EndingType;
      if (gauge <= 20) ending = "clear_perfect";
      else if (gauge <= 50) ending = "clear_normal";
      else ending = "clear_close";
      setEndingType(ending);
      setPhase("clear");
      return;
    }
    if (Math.random() < 0.1) {
      const event = RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)];
      setActiveEvent(event);
      setPhase("event");
      return;
    }
    goToScene(nextSceneIndex);
  }, [sceneIndex, gauge]);

  const goToScene = useCallback((index: number) => {
    setSceneIndex(index);
    setBeats(getSceneBeats(SCENES[index].id).preBeats);
    setBeatIndex(0);
    setPhase("beat");
    setBgKey((k) => k + 1);
  }, []);

  const handleEventDismiss = useCallback(() => {
    if (!activeEvent) return;
    const newGauge = Math.max(0, Math.min(100, gauge + activeEvent.gaugeDelta));
    setGauge(newGauge);
    setActiveEvent(null);
    if (newGauge >= 100) { setEndingType("gameover"); setPhase("gameover"); }
    else { goToScene(sceneIndex + 1); }
  }, [activeEvent, gauge, sceneIndex, goToScene]);

  const handleRetry = useCallback(() => {
    setGauge(0); setSceneIndex(0); setPhase("title");
    setBeats([]); setBeatIndex(0); setIsFlashing(false);
    setBgKey((k) => k + 1);
  }, []);

  // ════════════════════════════════════════════════════════
  // ── タイトル画面 ────────────────────────────────────────
  if (phase === "title") {
    return (
      <div style={{
        minHeight: "100dvh",
        background: "#FFD700",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 20px",
        gap: "0",
      }}>
        {/* 看板（本物二郎スタイル：黄色×黒） */}
        <div style={{
          background: "#FFD700",
          border: "8px solid #111",
          boxShadow: "8px 8px 0 #111",
          padding: "20px 40px",
          textAlign: "center",
          marginBottom: "28px",
          maxWidth: "440px",
          width: "100%",
        }}>
          <p style={{
            color: "#CC0000",
            fontWeight: 900,
            fontSize: "clamp(1.4rem, 5vw, 2rem)",
            letterSpacing: "0.2em",
            lineHeight: 1.2,
          }}>
            ラーメン
          </p>
          <p style={{
            color: "#111",
            fontWeight: 900,
            fontSize: "clamp(5rem, 18vw, 9rem)",
            lineHeight: 0.9,
            letterSpacing: "-0.02em",
          }}>
            二郎
          </p>
          <div style={{ height: "5px", background: "#111", margin: "10px 0 8px" }} />
          <p style={{
            color: "#111",
            fontWeight: 900,
            fontSize: "clamp(1.1rem, 4vw, 1.5rem)",
            letterSpacing: "0.4em",
          }}>
            仲野　店
          </p>
        </div>

        {/* キャッチ */}
        <div style={{
          background: "#111",
          border: "4px solid #111",
          padding: "14px 24px",
          textAlign: "center",
          marginBottom: "28px",
          maxWidth: "440px",
          width: "100%",
        }}>
          <p style={{
            fontWeight: 900,
            fontSize: "clamp(1rem, 3.5vw, 1.2rem)",
            color: "#FFD700",
            lineHeight: 1.6,
          }}>
            「覚悟して来てんだろうな。」
          </p>
          <p style={{ color: "#888", fontSize: "0.75rem", marginTop: "4px", fontWeight: 700 }}>
            ── 店主・仲野
          </p>
        </div>

        {/* ボタン */}
        <div style={{ maxWidth: "440px", width: "100%", display: "flex", flexDirection: "column", gap: "12px" }}>
          <button className="jiro-btn" style={{ fontSize: "1.2rem", padding: "1.1rem" }} onClick={startGame}>
            🍜 入店する
          </button>
          <p style={{ color: "#666", fontSize: "0.7rem", textAlign: "center", fontWeight: 700 }}>
            全7場面・仲野ゲージ管理・ランダムイベントあり
          </p>
          <Link href="/" style={{ display: "block", textAlign: "center", color: "#555", fontSize: "0.8rem", fontWeight: 700 }}>
            ← トップに戻る
          </Link>
        </div>
      </div>
    );
  }

  // ── ゲームオーバー ───────────────────────────────────────
  if (phase === "gameover") {
    return (
      <div style={{
        minHeight: "100dvh",
        background: "#CC0000",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 20px",
        animation: "dangerBlink 0.8s ease-in-out infinite",
      }}>
        <div style={{
          animation: "impactIn 0.6s cubic-bezier(0.25,0.46,0.45,0.94) both",
          textAlign: "center",
          marginBottom: "24px",
        }}>
          <p style={{ color: "#FFD700", fontWeight: 900, fontSize: "clamp(2.5rem,10vw,4.5rem)", textShadow: "5px 5px 0 #990000", lineHeight: 1 }}>
            退店命令！
          </p>
          <p style={{ color: "#FFF", fontWeight: 900, fontSize: "clamp(1rem,3.5vw,1.4rem)", marginTop: "8px" }}>
            二度と来るな！
          </p>
        </div>
        <div style={{
          background: "rgba(0,0,0,0.55)",
          border: "3px solid #FFD700",
          padding: "16px 24px",
          marginBottom: "28px",
          maxWidth: "500px",
          width: "100%",
          textAlign: "center",
        }}>
          <p style={{ color: "#FFF", fontWeight: 700, fontSize: "0.95rem", lineHeight: 1.7, fontStyle: "italic" }}>
            {ENDINGS.gameover.nakanoLine}
          </p>
        </div>
        <div style={{ maxWidth: "400px", width: "100%", display: "flex", flexDirection: "column", gap: "10px" }}>
          <button className="jiro-btn" onClick={handleRetry}>もう一度挑戦する</button>
          <Link href="/" style={{ display: "block", textAlign: "center", color: "#FFD", fontSize: "0.8rem" }}>← トップに戻る</Link>
        </div>
      </div>
    );
  }

  // ── クリア ───────────────────────────────────────────────
  if (phase === "clear") {
    const ending = ENDINGS[endingType];
    return (
      <div style={{
        minHeight: "100dvh",
        background: ending.bgColor,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 20px",
      }}>
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          {endingType === "clear_perfect" ? (
            <p className="gold-shimmer" style={{ fontWeight: 900, fontSize: "clamp(2rem,8vw,3.5rem)", lineHeight: 1 }}>
              {ending.title}
            </p>
          ) : (
            <p style={{ color: "#FFF", fontWeight: 900, fontSize: "clamp(1.8rem,7vw,3rem)", lineHeight: 1 }}>
              {ending.title}
            </p>
          )}
          <p style={{ color: "#DDD", fontWeight: 700, fontSize: "1rem", marginTop: "8px" }}>{ending.subtitle}</p>
        </div>
        <div style={{
          background: "rgba(0,0,0,0.4)",
          border: "2px solid #FFD700",
          padding: "10px 20px",
          marginBottom: "14px",
          textAlign: "center",
        }}>
          <p style={{ color: "#AAA", fontSize: "0.7rem", fontWeight: 700 }}>仲野ゲージ最終値</p>
          <p style={{ color: gauge >= 80 ? "#FF6060" : gauge >= 50 ? "#FFAA00" : "#4DFF91", fontWeight: 900, fontSize: "2.2rem" }}>
            {gauge} / 100
          </p>
        </div>
        <div style={{
          background: "rgba(0,0,0,0.5)",
          border: "3px solid #FFF",
          padding: "16px 24px",
          marginBottom: "28px",
          maxWidth: "500px",
          width: "100%",
          textAlign: "center",
        }}>
          <p style={{ color: "#FFF", fontWeight: 700, fontSize: "0.9rem", lineHeight: 1.7, fontStyle: "italic" }}>
            {ending.nakanoLine}
          </p>
        </div>
        <div style={{ maxWidth: "400px", width: "100%", display: "flex", flexDirection: "column", gap: "10px" }}>
          <button className="jiro-btn" onClick={handleRetry}>もう一度挑戦する</button>
          <Link href="/">
            <button className="jiro-btn-white" style={{ textAlign: "center" }}>← トップに戻る</button>
          </Link>
        </div>
      </div>
    );
  }

  // ── ランダムイベント ─────────────────────────────────────
  if (phase === "event" && activeEvent) {
    return (
      <div style={{
        minHeight: "100dvh",
        background: "#1A1A1A",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 20px",
      }}>
        <div style={{
          background: "#111",
          border: "5px solid #FFD700",
          padding: "28px 24px",
          maxWidth: "480px",
          width: "100%",
          textAlign: "center",
          animation: "slideDownFromTop 0.4s cubic-bezier(0.25,0.46,0.45,0.94) both",
        }}>
          <p style={{ fontSize: "3.5rem", marginBottom: "8px" }}>{activeEvent.emoji}</p>
          <p style={{ color: "#FFD700", fontWeight: 900, fontSize: "1.2rem", marginBottom: "12px" }}>
            ⚡ {activeEvent.title}
          </p>
          <p style={{ color: "#CCC", fontSize: "0.9rem", lineHeight: 1.7, whiteSpace: "pre-line", marginBottom: "20px" }}>
            {activeEvent.description}
          </p>
          <div style={{
            background: activeEvent.gaugeDelta > 0 ? "rgba(204,0,0,0.2)" : "rgba(46,204,64,0.2)",
            border: `2px solid ${activeEvent.gaugeDelta > 0 ? "#CC0000" : "#2ECC40"}`,
            padding: "8px",
            marginBottom: "20px",
          }}>
            <p style={{
              color: activeEvent.gaugeDelta > 0 ? "#FF6060" : "#4DFF91",
              fontWeight: 900,
              fontSize: "0.9rem",
            }}>
              仲野ゲージ {activeEvent.gaugeDelta > 0 ? "+" : ""}{activeEvent.gaugeDelta}
            </p>
          </div>
          <button className="jiro-btn" onClick={handleEventDismiss}>続ける</button>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════
  // ── メインゲーム画面（beat / choice / reaction） ─────────
  const currentScene = SCENES[sceneIndex];
  const currentBg = currentBeat.bg ?? "street";
  const currentSprite = currentBeat.sprite;
  const displaySpeaker = phase === "choice" ? undefined : currentBeat.speaker;

  return (
    <div style={{
      height: "100dvh",
      background: "#111",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      position: "relative",
    }}>
      {/* 赤フラッシュ */}
      {isFlashing && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(204,0,0,0.35)",
          zIndex: 100,
          pointerEvents: "none",
          animation: "redFlash 0.6s ease-out both",
        }} />
      )}

      {/* ─── HUD ─── */}
      <AngerGaugeHUD gauge={gauge} sceneIndex={sceneIndex} totalScenes={SCENES.length} />

      {/* ─── 場面タイトル ─── */}
      <div
        key={`title-${sceneIndex}`}
        style={{
          background: "#FFD700",
          color: "#111",
          fontWeight: 900,
          fontSize: "0.78rem",
          textAlign: "center",
          padding: "4px 8px",
          letterSpacing: "0.1em",
          borderBottom: "2px solid #111",
          animation: "scenePopIn 0.3s ease-out both",
        }}
      >
        ■ {currentScene.title} ■
      </div>

      {/* ─── 背景＋キャラクターエリア ─── */}
      <div
        key={`bg-${bgKey}`}
        style={{
          flex: 1,
          position: "relative",
          overflow: "hidden",
          minHeight: 0,
          animation: "slideInFromRight 0.35s cubic-bezier(0.25,0.46,0.45,0.94) both",
        }}
      >
        {/* 背景 */}
        <div style={{ position: "absolute", inset: 0 }}>
          <SceneBackground bg={currentBg} />
        </div>

        {/* キャラクター写真（右側・高さ100%） */}
        {currentSprite && (
          <div
            key={`char-${currentSprite}`}
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              height: "100%",
              width: "clamp(140px, 38%, 320px)",
              animation: "vnSpriteEnter 0.35s cubic-bezier(0.25,0.46,0.45,0.94) both",
            }}
          >
            <NakanoPhoto expression={currentSprite} />
          </div>
        )}
      </div>

      {/* ─── ダイアログボックス ─── */}
      <div style={{
        background: "rgba(0,0,0,0.92)",
        borderTop: "4px solid #FFD700",
        flexShrink: 0,
        maxHeight: "45dvh",
        overflowY: "auto",
      }}>
        <DialogueBox
          speaker={displaySpeaker}
          text={phase === "choice" ? currentScene.question : displayText}
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
