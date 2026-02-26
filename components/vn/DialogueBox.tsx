"use client";

import React from "react";

interface DialogueBoxProps {
  speaker?: string;      // undefined = ナレーション
  text: string;          // タイプライター後の表示テキスト
  isTyping: boolean;     // タイプライター進行中フラグ
  onAdvance: () => void; // タップで次へ
  showChoices?: boolean; // 選択肢表示モード
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
        background: "rgba(10, 10, 10, 0.90)",
        borderTop: "3px solid #CC0000",
        position: "relative",
        userSelect: "none",
      }}
      onClick={!showChoices ? onAdvance : undefined}
    >
      {/* スピーカー名タブ */}
      {!isNarration && (
        <div
          style={{
            display: "inline-block",
            background: "#CC0000",
            color: "#FFF",
            fontWeight: 900,
            fontSize: "0.75rem",
            padding: "2px 12px",
            letterSpacing: "0.1em",
            marginBottom: "6px",
            border: "2px solid #FFF",
            boxShadow: "2px 2px 0 #990000",
          }}
        >
          ■ {speaker}
        </div>
      )}

      {/* セリフ本文 */}
      <div
        style={{
          color: isNarration ? "#CCC" : "#FFF",
          fontStyle: isNarration ? "italic" : "normal",
          fontSize: "0.92rem",
          lineHeight: 1.65,
          fontWeight: isNarration ? 400 : 700,
          minHeight: "3.3em",
          padding: "0 4px",
          letterSpacing: isNarration ? "0.02em" : "0",
        }}
      >
        {text}
      </div>

      {/* 次へ矢印（▼点滅、タイプライター完了時のみ） */}
      {!showChoices && !isTyping && (
        <div
          style={{
            position: "absolute",
            bottom: "8px",
            right: "12px",
            color: "#CC0000",
            fontSize: "0.8rem",
            fontWeight: 900,
            animation: "vnBlinkArrow 0.7s ease-in-out infinite",
          }}
        >
          ▼
        </div>
      )}

      {/* 選択肢モード */}
      {showChoices && (
        <div
          key={choiceKey}
          style={{
            marginTop: "10px",
            display: "flex",
            flexDirection: "column",
            gap: "6px",
          }}
        >
          {choices.map((choice, i) => {
            const base: React.CSSProperties = {
              background: "#FFF",
              color: "#1A1A1A",
              fontWeight: 700,
              fontSize: "0.82rem",
              padding: "10px 12px",
              border: "2px solid #1A1A1A",
              boxShadow: "3px 3px 0 #1A1A1A",
              cursor: choice.disabled ? "not-allowed" : "pointer",
              textAlign: "left",
              lineHeight: 1.4,
              transition: "all 0.08s",
              opacity: choice.disabled && !choice.selected ? 0.5 : 1,
              animation: `vnBounceIn 0.4s ${i * 0.07}s cubic-bezier(0.25,0.46,0.45,0.94) both`,
            };
            const resultStyle: React.CSSProperties =
              choice.result === "correct"
                ? { background: "#1a5c1a", color: "#FFF", border: "2px solid #0d3d0d", boxShadow: "3px 3px 0 #0d3d0d" }
                : choice.result === "wrong"
                ? { background: "#CC0000", color: "#FFF", border: "2px solid #990000", boxShadow: "3px 3px 0 #990000" }
                : {};
            return (
              <button
                key={i}
                disabled={choice.disabled}
                onClick={() => !choice.disabled && onChoiceSelect?.(i)}
                style={{ ...base, ...resultStyle }}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: "20px",
                    fontWeight: 900,
                    color: choice.result ? "inherit" : "#CC0000",
                    flexShrink: 0,
                  }}
                >
                  {String.fromCharCode(65 + i)}.
                </span>{" "}
                {choice.text}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
