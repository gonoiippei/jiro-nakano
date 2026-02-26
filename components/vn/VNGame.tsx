"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";

import { useTypewriter } from "@/hooks/useTypewriter";
import { SCENES, RANDOM_EVENTS, ENDINGS, type EndingType } from "@/data/survivalData";
import { VN_BEATS, type Beat, type SceneBeats } from "@/data/vnBeats";

import AngerGaugeHUD from "./AngerGaugeHUD";
import SceneBackground from "./SceneBackground";
import NakanoPhoto from "./NakanoPhoto";
import DialogueBox from "./DialogueBox";

// ─── 型 ──────────────────────────────────────────────────────
type VNPhase =
  | "title"         // タイトル画面
  | "scene_title"   // シーンタイトルカード（アニメサブタイ風）
  | "beat"          // ナレーション・会話
  | "choice"        // 選択肢
  | "reaction"      // 選択後リアクション
  | "event"         // ランダムイベント
  | "gameover"
  | "clear";

type ChoiceState = {
  selected: number | null;
  result: ("correct" | "wrong" | null)[];
  disabled: boolean;
};

function getSceneBeats(sceneId: number): SceneBeats {
  return VN_BEATS.find((b) => b.sceneId === sceneId) ?? VN_BEATS[0];
}

// ────────────────────────────────────────────────────────────
export default function VNGame() {
  const [phase, setPhase]             = useState<VNPhase>("title");
  const [sceneIndex, setSceneIndex]   = useState(0);
  const [gauge, setGauge]             = useState(0);
  const [endingType, setEndingType]   = useState<EndingType>("gameover");
  const [beats, setBeats]             = useState<Beat[]>([]);
  const [beatIndex, setBeatIndex]     = useState(0);
  const [skipTyping, setSkipTyping]   = useState(false);
  const [choiceState, setChoiceState] = useState<ChoiceState>({
    selected: null, result: [], disabled: false,
  });
  const [activeEvent, setActiveEvent] = useState<typeof RANDOM_EVENTS[0] | null>(null);
  const [isFlashing, setIsFlashing]   = useState(false);
  const [bgKey, setBgKey]             = useState(0);
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentBeat: Beat = beats[beatIndex] ?? { bg: "street", sprite: undefined, text: "" };
  const displayText = useTypewriter(currentBeat.text, skipTyping ? 0 : 26);
  const isTyping = displayText.length < currentBeat.text.length;

  useEffect(() => { setSkipTyping(false); }, [beatIndex, beats]);
  useEffect(() => () => { if (flashTimer.current) clearTimeout(flashTimer.current); }, []);

  const triggerFlash = useCallback(() => {
    setIsFlashing(true);
    if (flashTimer.current) clearTimeout(flashTimer.current);
    flashTimer.current = setTimeout(() => setIsFlashing(false), 600);
  }, []);

  // ─── ゲーム開始 ──────────────────────────────────────────
  const startGame = useCallback(() => {
    setGauge(0);
    setSceneIndex(0);
    setPhase("scene_title");
    setBgKey((k) => k + 1);
  }, []);

  // ─── シーンタイトルカードから次へ ────────────────────────
  const proceedFromSceneTitle = useCallback(() => {
    const scene = SCENES[sceneIndex];
    setBeats(getSceneBeats(scene.id).preBeats);
    setBeatIndex(0);
    setPhase("beat");
    setBgKey((k) => k + 1);
  }, [sceneIndex]);

  // ─── ビート進行 ──────────────────────────────────────────
  const handleAdvance = useCallback(() => {
    if (phase !== "beat" && phase !== "reaction") return;
    if (isTyping) { setSkipTyping(true); return; }
    const nextIndex = beatIndex + 1;
    if (nextIndex < beats.length) { setBeatIndex(nextIndex); return; }
    if (phase === "beat") {
      setChoiceState({ selected: null, result: SCENES[sceneIndex].choices.map(() => null), disabled: false });
      setPhase("choice");
    } else {
      advanceScene();
    }
  }, [phase, isTyping, beatIndex, beats.length, sceneIndex]);

  // ─── 選択肢 ──────────────────────────────────────────────
  const handleChoiceSelect = useCallback((index: number) => {
    if (choiceState.disabled) return;
    const scene = SCENES[sceneIndex];
    const choice = scene.choices[index];
    const newGauge = Math.max(0, Math.min(100, gauge + choice.gaugeDelta));
    setChoiceState({
      selected: index,
      result: scene.choices.map((_, i) => i === index ? (choice.isCorrect ? "correct" : "wrong") : null),
      disabled: true,
    });
    setGauge(newGauge);
    if (!choice.isCorrect) triggerFlash();
    if (newGauge >= 100) {
      setTimeout(() => { setEndingType("gameover"); setPhase("gameover"); }, 1200);
      return;
    }
    const sb = getSceneBeats(scene.id);
    const rBeats = choice.isCorrect ? sb.reactionBeats.correct : sb.reactionBeats.wrong;
    setTimeout(() => { setBeats(rBeats); setBeatIndex(0); setPhase("reaction"); }, 800);
  }, [choiceState.disabled, gauge, sceneIndex, triggerFlash]);

  // ─── シーン進行 ──────────────────────────────────────────
  const goToScene = useCallback((index: number) => {
    setSceneIndex(index);
    setPhase("scene_title");  // 必ずタイトルカードを挟む
    setBgKey((k) => k + 1);
  }, []);

  const advanceScene = useCallback(() => {
    const next = sceneIndex + 1;
    if (next >= SCENES.length) {
      setEndingType(gauge <= 20 ? "clear_perfect" : gauge <= 50 ? "clear_normal" : "clear_close");
      setPhase("clear");
      return;
    }
    if (Math.random() < 0.1) {
      setActiveEvent(RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)]);
      setPhase("event");
      return;
    }
    goToScene(next);
  }, [sceneIndex, gauge, goToScene]);

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
  }, []);

  // ════════════════════════════════════════════════════════════
  // ─── タイトル画面 ─────────────────────────────────────────
  if (phase === "title") {
    return (
      <div style={{
        minHeight: "100dvh", background: "#FFD700",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: "24px 20px",
      }}>
        {/* 看板 */}
        <div style={{
          background: "#FFD700", border: "8px solid #111", boxShadow: "8px 8px 0 #111",
          padding: "24px 48px", textAlign: "center", marginBottom: "28px",
          maxWidth: "460px", width: "100%",
        }}>
          <p style={{ color: "#CC0000", fontWeight: 900, fontSize: "clamp(1.6rem,5vw,2.2rem)", letterSpacing: "0.2em" }}>
            ラーメン
          </p>
          <p style={{ color: "#111", fontWeight: 900, fontSize: "clamp(5rem,20vw,10rem)", lineHeight: 0.9, letterSpacing: "-0.02em" }}>
            二郎
          </p>
          <div style={{ height: "5px", background: "#111", margin: "12px 0 10px" }} />
          <p style={{ color: "#111", fontWeight: 900, fontSize: "clamp(1.2rem,4vw,1.6rem)", letterSpacing: "0.35em" }}>
            仲野　店
          </p>
        </div>
        {/* キャッチコピー */}
        <div style={{
          background: "#111", padding: "16px 28px", textAlign: "center",
          marginBottom: "28px", maxWidth: "460px", width: "100%", border: "4px solid #111",
        }}>
          <p style={{ fontWeight: 900, fontSize: "clamp(1rem,3.5vw,1.25rem)", color: "#FFD700", lineHeight: 1.7 }}>
            「覚悟して来てんだろうな。」
          </p>
          <p style={{ color: "#666", fontSize: "0.8rem", marginTop: "4px", fontWeight: 700 }}>── 店主・仲野</p>
        </div>
        <div style={{ maxWidth: "460px", width: "100%", display: "flex", flexDirection: "column", gap: "12px" }}>
          <button className="jiro-btn" style={{ fontSize: "1.3rem", padding: "1.2rem" }} onClick={startGame}>
            🍜 入店する
          </button>
          <p style={{ color: "#555", fontSize: "0.72rem", textAlign: "center", fontWeight: 700 }}>
            全7場面・仲野ゲージ管理・ランダムイベントあり
          </p>
          <Link href="/" style={{ display: "block", textAlign: "center", color: "#555", fontSize: "0.82rem", fontWeight: 700 }}>
            ← トップに戻る
          </Link>
        </div>
      </div>
    );
  }

  // ─── シーンタイトルカード ─────────────────────────────────
  if (phase === "scene_title") {
    const scene = SCENES[sceneIndex];
    return (
      <div
        style={{
          height: "100dvh",
          background: "#0A0A0A",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 24px",
          gap: "0",
          animation: "fadeIn 0.4s ease-out both",
        }}
      >
        {/* 場面番号 */}
        <p style={{
          color: "#666",
          fontWeight: 900,
          fontSize: "0.9rem",
          letterSpacing: "0.4em",
          marginBottom: "20px",
        }}>
          場面 {sceneIndex + 1} / {SCENES.length}
        </p>

        {/* 上の装飾ライン */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px", width: "100%", maxWidth: "500px" }}>
          <div style={{ flex: 1, height: "3px", background: "#FFD700" }} />
          <div style={{ width: "10px", height: "10px", background: "#FFD700", transform: "rotate(45deg)" }} />
          <div style={{ flex: 1, height: "3px", background: "#FFD700" }} />
        </div>

        {/* シーンタイトル */}
        <h2
          style={{
            color: "#FFD700",
            fontWeight: 900,
            fontSize: "clamp(2.2rem, 10vw, 5rem)",
            textAlign: "center",
            lineHeight: 1.2,
            letterSpacing: "0.06em",
            textShadow: "0 0 40px rgba(255,215,0,0.4), 4px 4px 0 rgba(0,0,0,0.8)",
            marginBottom: "28px",
            animation: "impactIn 0.7s cubic-bezier(0.25,0.46,0.45,0.94) both",
          }}
        >
          {scene.title}
        </h2>

        {/* 下の装飾ライン */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "48px", width: "100%", maxWidth: "500px" }}>
          <div style={{ flex: 1, height: "3px", background: "#FFD700" }} />
          <div style={{ width: "10px", height: "10px", background: "#FFD700", transform: "rotate(45deg)" }} />
          <div style={{ flex: 1, height: "3px", background: "#FFD700" }} />
        </div>

        {/* 進むボタン */}
        <button
          className="jiro-btn"
          style={{ maxWidth: "280px", fontSize: "1.15rem", padding: "1rem 2rem" }}
          onClick={proceedFromSceneTitle}
        >
          ▶ 進む
        </button>
      </div>
    );
  }

  // ─── ゲームオーバー ───────────────────────────────────────
  if (phase === "gameover") {
    return (
      <div style={{
        minHeight: "100dvh", background: "#CC0000",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: "24px 20px", animation: "dangerBlink 0.8s ease-in-out infinite",
      }}>
        <div style={{ animation: "impactIn 0.6s cubic-bezier(0.25,0.46,0.45,0.94) both", textAlign: "center", marginBottom: "24px" }}>
          <p style={{ color: "#FFD700", fontWeight: 900, fontSize: "clamp(2.8rem,12vw,5rem)", textShadow: "5px 5px 0 #990000", lineHeight: 1 }}>
            退店命令！
          </p>
          <p style={{ color: "#FFF", fontWeight: 900, fontSize: "clamp(1rem,4vw,1.5rem)", marginTop: "10px" }}>
            二度と来るな！
          </p>
        </div>
        <div style={{
          background: "rgba(0,0,0,0.55)", border: "3px solid #FFD700",
          padding: "18px 28px", marginBottom: "32px", maxWidth: "520px", width: "100%", textAlign: "center",
        }}>
          <p style={{ color: "#FFF", fontWeight: 700, fontSize: "1rem", lineHeight: 1.7, fontStyle: "italic" }}>
            {ENDINGS.gameover.nakanoLine}
          </p>
        </div>
        <div style={{ maxWidth: "400px", width: "100%", display: "flex", flexDirection: "column", gap: "10px" }}>
          <button className="jiro-btn" onClick={handleRetry}>もう一度挑戦する</button>
          <Link href="/" style={{ display: "block", textAlign: "center", color: "#FFD", fontSize: "0.85rem", marginTop: "4px" }}>← トップに戻る</Link>
        </div>
      </div>
    );
  }

  // ─── クリア ───────────────────────────────────────────────
  if (phase === "clear") {
    const ending = ENDINGS[endingType];
    return (
      <div style={{
        minHeight: "100dvh", background: ending.bgColor,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: "24px 20px",
      }}>
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          {endingType === "clear_perfect"
            ? <p className="gold-shimmer" style={{ fontWeight: 900, fontSize: "clamp(2rem,9vw,4rem)", lineHeight: 1 }}>{ending.title}</p>
            : <p style={{ color: "#FFF", fontWeight: 900, fontSize: "clamp(1.8rem,7vw,3.2rem)", lineHeight: 1 }}>{ending.title}</p>
          }
          <p style={{ color: "#DDD", fontWeight: 700, fontSize: "1.05rem", marginTop: "10px" }}>{ending.subtitle}</p>
        </div>
        <div style={{
          background: "rgba(0,0,0,0.4)", border: "2px solid #FFD700",
          padding: "12px 24px", marginBottom: "16px", textAlign: "center",
        }}>
          <p style={{ color: "#AAA", fontSize: "0.75rem", fontWeight: 700 }}>仲野ゲージ最終値</p>
          <p style={{ color: gauge >= 80 ? "#FF6060" : gauge >= 50 ? "#FFAA00" : "#4DFF91", fontWeight: 900, fontSize: "2.5rem" }}>
            {gauge} / 100
          </p>
        </div>
        <div style={{
          background: "rgba(0,0,0,0.5)", border: "3px solid #FFF",
          padding: "18px 28px", marginBottom: "32px", maxWidth: "520px", width: "100%", textAlign: "center",
        }}>
          <p style={{ color: "#FFF", fontWeight: 700, fontSize: "0.95rem", lineHeight: 1.7, fontStyle: "italic" }}>
            {ending.nakanoLine}
          </p>
        </div>
        <div style={{ maxWidth: "400px", width: "100%", display: "flex", flexDirection: "column", gap: "10px" }}>
          <button className="jiro-btn" onClick={handleRetry}>もう一度挑戦する</button>
          <Link href="/"><button className="jiro-btn-white" style={{ textAlign: "center" }}>← トップに戻る</button></Link>
        </div>
      </div>
    );
  }

  // ─── ランダムイベント ─────────────────────────────────────
  if (phase === "event" && activeEvent) {
    return (
      <div style={{
        minHeight: "100dvh", background: "#111",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px 20px",
      }}>
        <div style={{
          background: "#0A0A0A", border: "5px solid #FFD700",
          padding: "32px 28px", maxWidth: "500px", width: "100%", textAlign: "center",
          animation: "slideDownFromTop 0.4s cubic-bezier(0.25,0.46,0.45,0.94) both",
        }}>
          <p style={{ fontSize: "4rem", marginBottom: "10px" }}>{activeEvent.emoji}</p>
          <p style={{ color: "#FFD700", fontWeight: 900, fontSize: "1.3rem", marginBottom: "14px" }}>⚡ {activeEvent.title}</p>
          <p style={{ color: "#CCC", fontSize: "0.95rem", lineHeight: 1.75, whiteSpace: "pre-line", marginBottom: "22px" }}>
            {activeEvent.description}
          </p>
          <div style={{
            background: activeEvent.gaugeDelta > 0 ? "rgba(204,0,0,0.2)" : "rgba(46,204,64,0.2)",
            border: `3px solid ${activeEvent.gaugeDelta > 0 ? "#CC0000" : "#2ECC40"}`,
            padding: "10px", marginBottom: "22px",
          }}>
            <p style={{ color: activeEvent.gaugeDelta > 0 ? "#FF6060" : "#4DFF91", fontWeight: 900, fontSize: "1rem" }}>
              仲野ゲージ {activeEvent.gaugeDelta > 0 ? "+" : ""}{activeEvent.gaugeDelta}
            </p>
          </div>
          <button className="jiro-btn" onClick={handleEventDismiss}>続ける</button>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════
  // ─── メインゲーム画面 ─────────────────────────────────────
  const currentScene = SCENES[sceneIndex];

  return (
    <div style={{
      height: "100dvh", background: "#111",
      display: "flex", flexDirection: "column", overflow: "hidden", position: "relative",
    }}>
      {/* 赤フラッシュ */}
      {isFlashing && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(204,0,0,0.38)",
          zIndex: 100, pointerEvents: "none", animation: "redFlash 0.6s ease-out both",
        }} />
      )}

      {/* ─── HUD ─── */}
      <AngerGaugeHUD gauge={gauge} sceneIndex={sceneIndex} totalScenes={SCENES.length} />

      {/* ─── 背景＋キャラクター ─── */}
      <div
        key={`bg-${bgKey}`}
        style={{
          flex: 1, position: "relative", overflow: "hidden", minHeight: 0,
          animation: "slideInFromRight 0.35s cubic-bezier(0.25,0.46,0.45,0.94) both",
        }}
      >
        <div style={{ position: "absolute", inset: 0 }}>
          <SceneBackground bg={currentBeat.bg ?? "street"} />
        </div>

        {/* 暗幕オーバーレイ（選択肢時に少し暗くする） */}
        {phase === "choice" && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.35)", pointerEvents: "none" }} />
        )}

        {/* キャラクター */}
        {currentBeat.sprite && (
          <div
            key={`char-${currentBeat.sprite}-${beatIndex}`}
            style={{
              position: "absolute", bottom: 0, right: 0,
              height: "100%", width: "clamp(130px, 36%, 300px)",
              animation: "vnSpriteEnter 0.35s cubic-bezier(0.25,0.46,0.45,0.94) both",
            }}
          >
            <NakanoPhoto expression={currentBeat.sprite} />
          </div>
        )}
      </div>

      {/* ─── ダイアログボックス ─── */}
      <div style={{
        background: "rgba(0,0,0,0.95)",
        borderTop: "4px solid #FFD700",
        flexShrink: 0,
        maxHeight: "48dvh",
        overflowY: "auto",
      }}>
        <DialogueBox
          speaker={phase === "choice" ? undefined : currentBeat.speaker}
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
