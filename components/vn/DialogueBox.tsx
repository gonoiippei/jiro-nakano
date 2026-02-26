"use client";

import React from "react";

interface DialogueBoxProps {
  speaker?: string;
  text: string;
  isTyping: boolean;
  onAdvance: () => void;
  showChoices?: boolean;
  choices?: {
    text: string;
    isCorrect: boolean;
    disabled?: boolean;
    selected?: boolean;
    result?: "correct" | "wrong";
  }[];
  onChoiceSelect?: (index: number) => void;
  choiceKey?: number;
}

export default function DialogueBox({
  speaker,
  text,
  isTyping,
  onAdvance,
  showChoices = false,
  choices = [],
  onChoiceSelect,
  choiceKey = 0,
}: DialogueBoxProps) {
  const isNarration = !speaker;

  return (
    <div
      className="vn-dialogue-box"
      style={{
        background: "rgba(8, 8, 8, 0.95)",
        borderTop: "4px solid #FFD700",
        position: "relative",
        userSelect: "none",
      }}
      onClick={!showChoices ? onAdvance : undefined}
    >
      {/* スピーカー名 */}
      {!isNarration && (
        <div style={{ marginBottom: "8px" }}>
          <span
            style={{
              display: "inline-block",
              background: "#FFD700",
              color: "#111",
              fontWeight: 900,
              fontSize: "0.95rem",
              padding: "3px 16px",
              letterSpacing: "0.12em",
              border: "2px solid #111",
              boxShadow: "3px 3px 0 #111",
            }}
          >
            {speaker}
          </span>
        </div>
      )}

      {/* ナレーション時の区切りラベル */}
      {isNarration && (
        <div style={{ marginBottom: "6px" }}>
          <span style={{
            display: "inline-block",
            color: "#888",
            fontSize: "0.72rem",
            fontWeight: 700,
            letterSpacing: "0.15em",
            borderBottom: "1px solid #444",
            paddingBottom: "2px",
          }}>
            ──── ナレーション
          </span>
        </div>
      )}

      {/* セリフ本文 */}
      <div
        style={{
          color: isNarration ? "#BBBBBB" : "#FFFFFF",
          fontStyle: isNarration ? "italic" : "normal",
          fontSize: "1.12rem",
          lineHeight: 1.75,
          fontWeight: isNarration ? 400 : 700,
          minHeight: "3.5em",
          letterSpacing: "0.02em",
        }}
      >
        {text}
      </div>

      {/* 次へ案内（タイプライター完了時） */}
      {!showChoices && !isTyping && text.length > 0 && (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: "4px",
            marginTop: "8px",
          }}
        >
          <span
            style={{
              color: "#888",
              fontSize: "0.72rem",
              fontWeight: 700,
              letterSpacing: "0.06em",
            }}
          >
            タップで次へ
          </span>
          <span
            style={{
              color: "#FFD700",
              fontSize: "1rem",
              fontWeight: 900,
              animation: "vnBlinkArrow 0.7s ease-in-out infinite",
            }}
          >
            ▼
          </span>
        </div>
      )}

      {/* タイプライター進行中 */}
      {!showChoices && isTyping && (
        <div style={{ height: "28px" }} />
      )}

      {/* ─── 選択肢 ─── */}
      {showChoices && (
        <div
          key={choiceKey}
          style={{
            marginTop: "14px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <p style={{
            color: "#FFD700",
            fontSize: "0.75rem",
            fontWeight: 900,
            letterSpacing: "0.15em",
            marginBottom: "2px",
          }}>
            ▼ どうする？
          </p>

          {choices.map((choice, i) => {
            const isCorrectResult = choice.result === "correct";
            const isWrongResult = choice.result === "wrong";
            const base: React.CSSProperties = {
              background: isCorrectResult ? "#1a6e1a" : isWrongResult ? "#CC0000" : "#FFFFFF",
              color: isCorrectResult || isWrongResult ? "#FFF" : "#111",
              fontWeight: 700,
              fontSize: "1rem",
              padding: "12px 16px",
              border: isCorrectResult
                ? "3px solid #0d4a0d"
                : isWrongResult
                ? "3px solid #990000"
                : "3px solid #111",
              boxShadow: isCorrectResult
                ? "4px 4px 0 #0d4a0d"
                : isWrongResult
                ? "4px 4px 0 #990000"
                : "4px 4px 0 #111",
              cursor: choice.disabled ? "not-allowed" : "pointer",
              textAlign: "left",
              lineHeight: 1.5,
              transition: "all 0.08s",
              opacity: choice.disabled && !choice.selected && !choice.result ? 0.45 : 1,
              animation: `vnBounceIn 0.4s ${i * 0.08}s cubic-bezier(0.25,0.46,0.45,0.94) both`,
              display: "flex",
              alignItems: "flex-start",
              gap: "10px",
            };
            return (
              <button
                key={i}
                disabled={choice.disabled}
                onClick={() => !choice.disabled && onChoiceSelect?.(i)}
                style={base}
              >
                <span style={{
                  display: "inline-block",
                  minWidth: "26px",
                  height: "26px",
                  lineHeight: "26px",
                  textAlign: "center",
                  background: isCorrectResult || isWrongResult ? "rgba(255,255,255,0.2)" : "#FFD700",
                  color: isCorrectResult || isWrongResult ? "#FFF" : "#111",
                  fontWeight: 900,
                  fontSize: "0.85rem",
                  flexShrink: 0,
                }}>
                  {String.fromCharCode(65 + i)}
                </span>
                <span style={{ flex: 1 }}>{choice.text}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
