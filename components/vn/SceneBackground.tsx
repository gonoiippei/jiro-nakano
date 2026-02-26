"use client";

import React from "react";
import type { BackgroundId } from "@/data/vnBeats";

// ─── 場面: street（店の外観・行列） ────────────────────────────
function BgStreet() {
  return (
    <svg
      viewBox="0 0 400 280"
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block" }}
    >
      {/* 空 */}
      <rect width="400" height="180" fill="#87CEEB" />
      {/* 雲 */}
      <ellipse cx="80" cy="40" rx="40" ry="20" fill="#FFF" opacity="0.9" />
      <ellipse cx="110" cy="30" rx="30" ry="18" fill="#FFF" opacity="0.9" />
      <ellipse cx="310" cy="55" rx="35" ry="16" fill="#FFF" opacity="0.85" />
      <ellipse cx="340" cy="45" rx="25" ry="14" fill="#FFF" opacity="0.85" />

      {/* 建物（白い壁） */}
      <rect x="60" y="50" width="280" height="150" fill="#F5F0E8" />
      {/* 壁の縦ライン（レンガ感） */}
      <line x1="120" y1="50" x2="120" y2="200" stroke="#DDD" strokeWidth="1.5" />
      <line x1="200" y1="50" x2="200" y2="200" stroke="#DDD" strokeWidth="1.5" />
      <line x1="280" y1="50" x2="280" y2="200" stroke="#DDD" strokeWidth="1.5" />

      {/* 赤い看板（大） */}
      <rect x="80" y="60" width="240" height="60" fill="#CC0000" rx="4" />
      {/* 看板の縁 */}
      <rect x="80" y="60" width="240" height="60" fill="none" stroke="#FFF" strokeWidth="3" rx="4" />
      {/* 看板文字エリア（ドット絵風長方形で表現） */}
      {/* 「二郎」文字 - 矩形で模倣 */}
      <rect x="145" y="72" width="8" height="36" fill="#FFF" />
      <rect x="137" y="72" width="24" height="6" fill="#FFF" />
      <rect x="137" y="88" width="24" height="6" fill="#FFF" />
      <rect x="137" y="102" width="24" height="6" fill="#FFF" />
      <rect x="185" y="72" width="8" height="36" fill="#FFF" />
      <rect x="193" y="78" width="14" height="6" fill="#FFF" />
      <rect x="193" y="90" width="14" height="6" fill="#FFF" />
      <rect x="185" y="102" width="22" height="6" fill="#FFF" />

      {/* 小看板「仲野店」 */}
      <rect x="90" y="128" width="220" height="22" fill="#990000" />
      <rect x="90" y="128" width="220" height="22" fill="none" stroke="#FFD700" strokeWidth="1.5" />

      {/* のれん */}
      <rect x="100" y="150" width="40" height="30" fill="#CC0000" rx="0 0 4 4" />
      <rect x="150" y="150" width="40" height="28" fill="#CC0000" rx="0 0 4 4" />
      <rect x="200" y="150" width="40" height="30" fill="#CC0000" rx="0 0 4 4" />
      <rect x="250" y="150" width="40" height="28" fill="#CC0000" rx="0 0 4 4" />

      {/* 歩道 */}
      <rect x="0" y="200" width="400" height="80" fill="#C8C8C0" />
      {/* 歩道タイル */}
      {[0,50,100,150,200,250,300,350].map((x) => (
        <line key={x} x1={x} y1="200" x2={x} y2="280" stroke="#AAA" strokeWidth="1" />
      ))}
      {[220,240,260,280].map((y) => (
        <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="#AAA" strokeWidth="1" />
      ))}

      {/* 行列の人シルエット */}
      {[300, 330, 358, 382].map((x, i) => (
        <g key={i}>
          <ellipse cx={x} cy="195" rx="10" ry="12" fill="#555" />
          <rect x={x - 9} y="207" width="18" height="30" fill="#444" rx="2" />
        </g>
      ))}
    </svg>
  );
}

// ─── 場面: entrance（店内入口・食券機） ────────────────────────
function BgEntrance() {
  return (
    <svg
      viewBox="0 0 400 280"
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block" }}
    >
      {/* 壁 */}
      <rect width="400" height="280" fill="#E8E0D0" />
      {/* 床タイル */}
      <rect x="0" y="220" width="400" height="60" fill="#C0B898" />
      {[0,50,100,150,200,250,300,350,400].map((x) => (
        <line key={`v${x}`} x1={x} y1="220" x2={x} y2="280" stroke="#AAA" strokeWidth="1" />
      ))}
      {[240, 260, 280].map((y) => (
        <line key={`h${y}`} x1="0" y1={y} x2="400" y2={y} stroke="#AAA" strokeWidth="1" />
      ))}
      {/* 壁の腰板 */}
      <rect x="0" y="180" width="400" height="8" fill="#8B6040" />

      {/* 食券機（黄色） */}
      <rect x="60" y="70" width="100" height="150" fill="#FFD700" rx="6" />
      <rect x="60" y="70" width="100" height="150" fill="none" stroke="#B8960C" strokeWidth="3" rx="6" />
      {/* 食券機 ディスプレイ */}
      <rect x="72" y="82" width="76" height="40" fill="#222" rx="3" />
      <rect x="76" y="86" width="68" height="32" fill="#001000" rx="2" />
      {/* 食券ボタン群 */}
      {[0,1,2,3].map((row) =>
        [0,1].map((col) => (
          <rect
            key={`btn-${row}-${col}`}
            x={72 + col * 38}
            y={130 + row * 22}
            width="32"
            height="16"
            fill="#CC0000"
            rx="3"
          />
        ))
      )}
      {/* コイン投入口 */}
      <rect x="95" y="205" width="30" height="6" fill="#B8960C" rx="3" />

      {/* 張り紙 */}
      <rect x="200" y="90" width="120" height="80" fill="#FFFFF0" />
      <rect x="200" y="90" width="120" height="80" fill="none" stroke="#CC0000" strokeWidth="2" />
      <rect x="210" y="102" width="100" height="5" fill="#CC0000" rx="2" />
      <rect x="210" y="115" width="80" height="4" fill="#888" rx="2" />
      <rect x="210" y="127" width="90" height="4" fill="#888" rx="2" />
      <rect x="210" y="139" width="70" height="4" fill="#888" rx="2" />
      <rect x="210" y="151" width="85" height="4" fill="#888" rx="2" />

      {/* 入口ドア（右側） */}
      <rect x="320" y="100" width="70" height="120" fill="#8B6040" rx="4" />
      <rect x="320" y="100" width="70" height="120" fill="none" stroke="#5A3820" strokeWidth="3" rx="4" />
      <rect x="328" y="110" width="26" height="45" fill="#A07850" rx="2" />
      <rect x="362" y="110" width="20" height="45" fill="#A07850" rx="2" />
      <circle cx="352" cy="166" r="5" fill="#FFD700" />
    </svg>
  );
}

// ─── 場面: counter（カウンター越し） ───────────────────────────
function BgCounter() {
  return (
    <svg
      viewBox="0 0 400 280"
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block" }}
    >
      {/* 壁・厨房 */}
      <rect width="400" height="280" fill="#D4C8B0" />
      {/* 厨房壁（タイル風） */}
      <rect x="0" y="0" width="400" height="130" fill="#E8E4DC" />
      {[0,40,80,120,160,200,240,280,320,360,400].map((x) => (
        <line key={`cv${x}`} x1={x} y1="0" x2={x} y2="130" stroke="#CCC" strokeWidth="1" />
      ))}
      {[0,30,60,90,120].map((y) => (
        <line key={`ch${y}`} x1="0" y1={y} x2="400" y2={y} stroke="#CCC" strokeWidth="1" />
      ))}

      {/* レンジフード */}
      <rect x="100" y="5" width="200" height="40" fill="#888" rx="4" />
      <rect x="120" y="45" width="160" height="10" fill="#777" />

      {/* 大鍋 */}
      <ellipse cx="170" cy="115" rx="50" ry="15" fill="#555" />
      <rect x="120" y="100" width="100" height="20" fill="#444" rx="2" />
      {/* 湯気 */}
      {[155,170,185].map((x) => (
        <g key={x}>
          <path
            d={`M${x},95 Q${x+5},80 ${x},65 Q${x-5},50 ${x},35`}
            fill="none"
            stroke="rgba(255,255,255,0.6)"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </g>
      ))}

      {/* カウンター天板 */}
      <rect x="0" y="160" width="400" height="20" fill="#8B6040" />
      <rect x="0" y="178" width="400" height="6" fill="#5A3820" />

      {/* カウンター前面 */}
      <rect x="0" y="184" width="400" height="96" fill="#A07850" />
      {/* カウンター木目 */}
      {[200,210,225,240,255].map((y) => (
        <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="#8B6040" strokeWidth="1" opacity="0.5" />
      ))}

      {/* 丼（中央） */}
      <ellipse cx="200" cy="158" rx="45" ry="12" fill="#F5F0E8" />
      <rect x="157" y="148" width="86" height="20" fill="#F5F0E8" rx="2" />
      <ellipse cx="200" cy="148" rx="40" ry="10" fill="#E8DCC8" />
      {/* 麺（ぐるぐる） */}
      <ellipse cx="200" cy="148" rx="30" ry="7" fill="#F0E0A0" opacity="0.9" />
      {/* 豚チャーシュー */}
      <ellipse cx="185" cy="146" rx="12" ry="8" fill="#A06040" />
      <ellipse cx="215" cy="147" rx="10" ry="7" fill="#B07050" />
      {/* もやし（ヤサイ） */}
      {[193,200,207].map((x) => (
        <line key={x} x1={x} y1="140" x2={x+3} y2="150" stroke="#E0F0C0" strokeWidth="2" />
      ))}
    </svg>
  );
}

// ─── 場面: eating（食事中・テーブル視点） ──────────────────────
function BgEating() {
  return (
    <svg
      viewBox="0 0 400 280"
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block" }}
    >
      {/* 壁 */}
      <rect width="400" height="280" fill="#D4C8B0" />
      <rect x="0" y="0" width="400" height="120" fill="#E8E4DC" />

      {/* カウンター天板（超近景・画面下半分を占める） */}
      <rect x="0" y="120" width="400" height="20" fill="#8B6040" />
      <rect x="0" y="138" width="400" height="6" fill="#5A3820" />
      <rect x="0" y="144" width="400" height="136" fill="#A07850" />
      {/* 木目 */}
      {[160,175,190,210,230].map((y) => (
        <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="#8B6040" strokeWidth="1" opacity="0.4" />
      ))}

      {/* 大きな丼（アップ） */}
      <ellipse cx="200" cy="118" rx="90" ry="25" fill="#F5F0E8" />
      <rect x="112" y="95" width="176" height="35" fill="#F5F0E8" />
      <ellipse cx="200" cy="95" rx="82" ry="20" fill="#E8DCC8" />
      {/* スープ */}
      <ellipse cx="200" cy="95" rx="75" ry="17" fill="#C8843C" opacity="0.85" />
      {/* 麺の山 */}
      <ellipse cx="200" cy="88" rx="55" ry="14" fill="#F0E0A0" />
      {/* もやし */}
      {[165,178,190,200,212,225].map((x) => (
        <line key={x} x1={x} y1="78" x2={x+4} y2="94" stroke="#D0EAAA" strokeWidth="2.5" strokeLinecap="round" />
      ))}
      {/* 豚（大きめ） */}
      <ellipse cx="175" cy="85" rx="22" ry="14" fill="#A06040" />
      <ellipse cx="225" cy="83" rx="20" ry="13" fill="#B07050" />
      {/* 豚の断面線 */}
      <line x1="162" y1="85" x2="188" y2="85" stroke="#8B4030" strokeWidth="1.5" />
      <line x1="213" y1="83" x2="237" y2="83" stroke="#8B4030" strokeWidth="1.5" />
      {/* ニンニク */}
      <circle cx="200" cy="80" r="8" fill="#F5F0E8" />
      <circle cx="200" cy="80" r="6" fill="#FFFFF0" />

      {/* 湯気 */}
      {[175,200,225].map((x) => (
        <g key={x}>
          <path
            d={`M${x},70 Q${x+8},55 ${x},40 Q${x-8},25 ${x},10`}
            fill="none"
            stroke="rgba(255,255,255,0.55)"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </g>
      ))}

      {/* 箸 */}
      <line x1="310" y1="125" x2="280" y2="85" stroke="#8B6040" strokeWidth="3" strokeLinecap="round" />
      <line x1="325" y1="130" x2="294" y2="88" stroke="#8B6040" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

// ─── 場面: exit（退店・出口） ──────────────────────────────────
function BgExit() {
  return (
    <svg
      viewBox="0 0 400 280"
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block" }}
    >
      {/* 外の光（ドア越し） */}
      <rect width="400" height="280" fill="#D4C8B0" />

      {/* 外の光の柱（ドア枠の内側） */}
      <rect x="130" y="0" width="140" height="220" fill="#FFE88A" opacity="0.6" />
      <ellipse cx="200" cy="0" rx="90" ry="80" fill="#FFFAC0" opacity="0.4" />

      {/* 床 */}
      <rect x="0" y="215" width="400" height="65" fill="#C0B898" />
      {[0,50,100,150,200,250,300,350,400].map((x) => (
        <line key={`v${x}`} x1={x} y1="215" x2={x} y2="280" stroke="#AAA" strokeWidth="1" />
      ))}
      {[235,255,275].map((y) => (
        <line key={`h${y}`} x1="0" y1={y} x2="400" y2={y} stroke="#AAA" strokeWidth="1" />
      ))}

      {/* 壁（左右） */}
      <rect x="0" y="0" width="130" height="280" fill="#C8B898" />
      <rect x="270" y="0" width="130" height="280" fill="#C8B898" />
      {/* 壁の腰板 */}
      <rect x="0" y="180" width="130" height="8" fill="#8B6040" />
      <rect x="270" y="180" width="130" height="8" fill="#8B6040" />

      {/* ドア枠 */}
      <rect x="128" y="0" width="10" height="220" fill="#5A3820" />
      <rect x="262" y="0" width="10" height="220" fill="#5A3820" />
      <rect x="128" y="215" width="144" height="10" fill="#5A3820" />

      {/* ドア（片開き・左に開いている） */}
      <rect x="140" y="20" width="100" height="195" fill="#8B6040" />
      <rect x="140" y="20" width="100" height="195" fill="none" stroke="#5A3820" strokeWidth="3" />
      {/* ドア窓 */}
      <rect x="155" y="40" width="35" height="50" fill="#C8E8F0" rx="2" />
      <rect x="195" y="40" width="35" height="50" fill="#C8E8F0" rx="2" />
      {/* ドアノブ */}
      <circle cx="236" cy="122" r="6" fill="#FFD700" />

      {/* のれん（ドア上） */}
      <rect x="138" y="0" width="30" height="18" fill="#CC0000" />
      <rect x="176" y="0" width="30" height="20" fill="#CC0000" />
      <rect x="214" y="0" width="30" height="18" fill="#CC0000" />
      <rect x="252" y="0" width="16" height="20" fill="#CC0000" />

      {/* 外の景色（ドア越し） */}
      <rect x="138" y="20" width="2" height="195" fill="none" />
      {/* 外の空 */}
      <rect x="240" y="0" width="30" height="215" fill="#87CEEB" opacity="0.5" />
    </svg>
  );
}

// ─── メインコンポーネント ─────────────────────────────────────
interface SceneBackgroundProps {
  bg: BackgroundId;
  className?: string;
}

const BG_COMPONENTS: Record<BackgroundId, React.FC> = {
  street:   BgStreet,
  entrance: BgEntrance,
  counter:  BgCounter,
  eating:   BgEating,
  exit:     BgExit,
};

export default function SceneBackground({
  bg,
  className = "",
}: SceneBackgroundProps) {
  const BgComponent = BG_COMPONENTS[bg];
  return (
    <div
      className={className}
      style={{ width: "100%", height: "100%", overflow: "hidden" }}
    >
      <BgComponent />
    </div>
  );
}
