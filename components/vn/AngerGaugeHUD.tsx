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
  return "#1a7a00";
}

function getGaugeLabel(gauge: number): string {
  if (gauge >= 80) return "限界寸前！";
  if (gauge >= 60) return "かなり怒ってる";
  if (gauge >= 40) return "不満そう";
  return "まあ落ち着いてる";
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
        borderBottom: `3px solid #111`,
        padding: "5px 14px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        minHeight: "44px",
      }}
    >
      {/* 場面表示 */}
      <div
        style={{
          background: "#111",
          color: "#FFD700",
          fontSize: "0.7rem",
          fontWeight: 900,
          whiteSpace: "nowrap",
          letterSpacing: "0.05em",
          padding: "2px 8px",
          minWidth: "60px",
          textAlign: "center",
        }}
      >
        場面{sceneIndex + 1}/{totalScenes}
      </div>

      {/* ゲージ本体 */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "3px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontSize: "0.65rem",
              fontWeight: 900,
              color: "#111",
              letterSpacing: "0.04em",
            }}
          >
            仲野ゲージ
          </span>
          <span
            style={{
              fontSize: "0.65rem",
              fontWeight: 900,
              color: isDanger ? "#CC0000" : "#111",
              animation: isDanger ? "gaugePulse 0.6s ease-in-out infinite" : "none",
            }}
          >
            {label}
          </span>
        </div>
        {/* ゲージ外枠 */}
        <div
          style={{
            width: "100%",
            height: "12px",
            background: "#FFF",
            border: "2px solid #111",
            overflow: "hidden",
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
        </div>
      </div>

      {/* 数値 */}
      <div
        style={{
          background: isDanger ? "#CC0000" : "#111",
          color: "#FFD700",
          fontSize: "0.85rem",
          fontWeight: 900,
          minWidth: "40px",
          textAlign: "center",
          padding: "2px 6px",
          animation: isDanger ? "gaugePulse 0.6s ease-in-out infinite" : "none",
          transition: "background 0.3s",
        }}
      >
        {clampedGauge}
      </div>
    </div>
  );
}
