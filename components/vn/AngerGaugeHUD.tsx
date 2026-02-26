"use client";

import React from "react";

interface AngerGaugeHUDProps {
  gauge: number;
  sceneIndex: number;
  totalScenes: number;
}

function getGaugeColor(gauge: number): string {
  if (gauge >= 80) return "#CC0000";
  if (gauge >= 60) return "#FF6600";
  if (gauge >= 40) return "#E8A000";
  return "#1a8a00";
}

function getGaugeLabel(gauge: number): string {
  if (gauge >= 80) return "🔥 限界寸前！！";
  if (gauge >= 60) return "😤 かなり怒ってる";
  if (gauge >= 40) return "😒 不満そう";
  return "😐 まあ落ち着いてる";
}

export default function AngerGaugeHUD({
  gauge,
  sceneIndex,
  totalScenes,
}: AngerGaugeHUDProps) {
  const color = getGaugeColor(gauge);
  const label = getGaugeLabel(gauge);
  const isDanger = gauge >= 80;
  const clampedGauge = Math.min(100, Math.max(0, gauge));

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "#FFD700",
        borderBottom: "4px solid #111",
        padding: "8px 16px 10px",
        display: "flex",
        alignItems: "center",
        gap: "14px",
      }}
    >
      {/* 場面バッジ */}
      <div
        style={{
          background: "#111",
          color: "#FFD700",
          fontSize: "0.85rem",
          fontWeight: 900,
          whiteSpace: "nowrap",
          letterSpacing: "0.04em",
          padding: "4px 12px",
          minWidth: "70px",
          textAlign: "center",
          flexShrink: 0,
          lineHeight: 1.4,
        }}
      >
        場面<br />
        <span style={{ fontSize: "1.2rem" }}>{sceneIndex + 1}</span>
        <span style={{ fontSize: "0.75rem" }}>/{totalScenes}</span>
      </div>

      {/* ゲージ + ラベル */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "5px" }}>
        {/* ラベル行 */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "0.78rem", fontWeight: 900, color: "#111" }}>
            仲野イライラゲージ
          </span>
          <span
            style={{
              fontSize: "0.78rem",
              fontWeight: 900,
              color: isDanger ? "#CC0000" : "#333",
              animation: isDanger ? "gaugePulse 0.6s ease-in-out infinite" : "none",
            }}
          >
            {label}
          </span>
        </div>

        {/* ゲージバー */}
        <div
          style={{
            width: "100%",
            height: "22px",
            background: "#FFF",
            border: "3px solid #111",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            style={{
              width: `${clampedGauge}%`,
              height: "100%",
              background: color,
              transition: "width 0.5s ease, background 0.5s ease",
              animation: isDanger ? "gaugePulse 0.6s ease-in-out infinite" : "none",
            }}
          />
          {/* 目盛り（25, 50, 75） */}
          {[25, 50, 75].map((v) => (
            <div
              key={v}
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: `${v}%`,
                width: "2px",
                background: "rgba(0,0,0,0.2)",
                pointerEvents: "none",
              }}
            />
          ))}
        </div>
      </div>

      {/* 数値バッジ */}
      <div
        style={{
          background: isDanger ? "#CC0000" : "#111",
          color: "#FFD700",
          fontSize: "1.3rem",
          fontWeight: 900,
          minWidth: "52px",
          textAlign: "center",
          padding: "4px 8px",
          flexShrink: 0,
          animation: isDanger ? "gaugePulse 0.6s ease-in-out infinite" : "none",
          transition: "background 0.3s",
          lineHeight: 1.2,
        }}
      >
        {clampedGauge}
        <div style={{ fontSize: "0.6rem", color: "#AAA", fontWeight: 700 }}>/ 100</div>
      </div>
    </div>
  );
}
