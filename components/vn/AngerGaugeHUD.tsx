"use client";

import React from "react";

interface AngerGaugeHUDProps {
  gauge: number;        // 0〜100
  sceneIndex: number;   // 0-indexed (表示は+1)
  totalScenes: number;
}

function getGaugeColor(gauge: number): string {
  if (gauge >= 80) return "#CC0000";
  if (gauge >= 60) return "#FF6600";
  if (gauge >= 40) return "#FFAA00";
  return "#2ECC40";
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
        background: "#1A1A1A",
        borderBottom: `2px solid ${color}`,
        padding: "6px 12px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        minHeight: "44px",
      }}
    >
      {/* 場面表示 */}
      <div
        style={{
          color: "#FFF",
          fontSize: "0.7rem",
          fontWeight: 900,
          whiteSpace: "nowrap",
          letterSpacing: "0.05em",
          minWidth: "50px",
        }}
      >
        場面{sceneIndex + 1}/{totalScenes}
      </div>

      {/* ゲージ本体 */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "2px" }}>
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
              fontWeight: 700,
              color: "#AAA",
              letterSpacing: "0.04em",
            }}
          >
            仲野ゲージ
          </span>
          <span
            style={{
              fontSize: "0.65rem",
              fontWeight: 900,
              color: color,
              animation: isDanger ? "gaugePulse 0.6s ease-in-out infinite" : "none",
            }}
          >
            {label}
          </span>
        </div>
        <div
          style={{
            width: "100%",
            height: "10px",
            background: "#333",
            borderRadius: "2px",
            overflow: "hidden",
            border: "1px solid #444",
          }}
        >
          <div
            style={{
              width: `${clampedGauge}%`,
              height: "100%",
              background: color,
              transition: "width 0.5s ease, background 0.5s ease",
              animation: isDanger ? "gaugePulse 0.6s ease-in-out infinite" : "none",
              borderRadius: "2px",
            }}
          />
        </div>
      </div>

      {/* 数値 */}
      <div
        style={{
          color: color,
          fontSize: "0.8rem",
          fontWeight: 900,
          minWidth: "36px",
          textAlign: "right",
          animation: isDanger ? "gaugePulse 0.6s ease-in-out infinite" : "none",
        }}
      >
        {clampedGauge}
      </div>
    </div>
  );
}
