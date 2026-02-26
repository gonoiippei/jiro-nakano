"use client";

import React, { useState } from "react";
import type { SpriteExpression } from "@/data/vnBeats";
import NakanoSprite from "./NakanoSprite";

// 表情ごとのCSSフィルター
const EXPRESSION_FILTERS: Record<SpriteExpression, string> = {
  normal:    "brightness(1.0) saturate(1.0)",
  annoyed:   "brightness(0.88) saturate(0.75) contrast(1.05)",
  angry:     "brightness(0.82) saturate(1.5) sepia(0.25) contrast(1.1)",
  furious:   "brightness(0.75) saturate(1.9) sepia(0.4) contrast(1.2) hue-rotate(-8deg)",
  satisfied: "brightness(1.06) saturate(0.85) sepia(0.08)",
};

// 表情ごとのオーバーレイカラー（怒りなら赤みがかる）
const EXPRESSION_OVERLAYS: Record<SpriteExpression, string> = {
  normal:    "transparent",
  annoyed:   "rgba(0,0,0,0.08)",
  angry:     "rgba(180,0,0,0.10)",
  furious:   "rgba(220,0,0,0.18)",
  satisfied: "rgba(255,240,0,0.04)",
};

interface NakanoPhotoProps {
  expression: SpriteExpression;
  className?: string;
}

export default function NakanoPhoto({
  expression,
  className = "",
}: NakanoPhotoProps) {
  const [imageError, setImageError] = useState(false);

  // 写真が見つからない場合はSVGドット絵にフォールバック
  if (imageError) {
    return (
      <NakanoSprite expression={expression} className={className} />
    );
  }

  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* 実際の写真 */}
      <img
        src="/nakano.jpg.png"
        alt="仲野"
        onError={() => setImageError(true)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center 8%",
          filter: EXPRESSION_FILTERS[expression],
          transition: "filter 0.4s ease",
          display: "block",
        }}
      />

      {/* 表情カラーオーバーレイ */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: EXPRESSION_OVERLAYS[expression],
          pointerEvents: "none",
          transition: "background 0.4s ease",
        }}
      />

      {/* 下部グラデーション（背景に溶け込む） */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "35%",
          background:
            "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)",
          pointerEvents: "none",
        }}
      />

      {/* 左側グラデーション（背景との境界をぼかす） */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          width: "25%",
          background:
            "linear-gradient(to right, rgba(0,0,0,0.5) 0%, transparent 100%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
