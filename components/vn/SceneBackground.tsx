"use client";

import React, { useState } from "react";
import type { BackgroundId } from "@/data/vnBeats";

// ─── 写真対応ラッパー ─────────────────────────────────────────
// src を試して失敗したら Fallback SVG を表示
function PhotoOrSvg({
  src,
  objectPosition = "center center",
  Fallback,
}: {
  src: string;
  objectPosition?: string;
  Fallback: React.FC;
}) {
  const [imgError, setImgError] = useState(false);
  if (imgError) return <Fallback />;
  return (
    <img
      src={src}
      alt=""
      onError={() => setImgError(true)}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        objectPosition,
        display: "block",
      }}
    />
  );
}

// ─── 場面: street フォールバックSVG ──────────────────────────
function BgStreetSVG() {
  return (
    <svg
      viewBox="0 0 400 280"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="400" height="280" fill="#87CEEB" />
      <ellipse cx="80" cy="40" rx="40" ry="20" fill="#FFF" opacity="0.9" />
      <ellipse cx="110" cy="30" rx="30" ry="18" fill="#FFF" opacity="0.9" />
      <ellipse cx="310" cy="55" rx="35" ry="16" fill="#FFF" opacity="0.85" />
      {/* タイル外壁 */}
      <rect x="40" y="40" width="320" height="180" fill="#D8D4CC" />
      {[80,120,160,200,240,280,320].map((x) =>
        [40,70,100,130,160,190].map((y) => (
          <rect key={`${x}-${y}`} x={x} y={y} width="38" height="28" fill="none" stroke="#C8C4BC" strokeWidth="1" />
        ))
      )}
      {/* 黄色看板 */}
      <rect x="70" y="50" width="260" height="80" fill="#FFD700" />
      <rect x="70" y="50" width="260" height="80" fill="none" stroke="#111" strokeWidth="4" />
      {/* 「ラーメン」（赤文字っぽく） */}
      <rect x="82" y="60" width="90" height="18" fill="#CC0000" rx="2" />
      {/* 「二郎」（黒・大） */}
      <rect x="86" y="83" width="14" height="36" fill="#111" />
      <rect x="78" y="83" width="30" height="7" fill="#111" />
      <rect x="78" y="98" width="30" height="7" fill="#111" />
      <rect x="78" y="112" width="30" height="7" fill="#111" />
      <rect x="118" y="83" width="14" height="36" fill="#111" />
      <rect x="132" y="89" width="18" height="7" fill="#111" />
      <rect x="132" y="100" width="18" height="7" fill="#111" />
      <rect x="118" y="112" width="32" height="7" fill="#111" />
      {/* 仲野店（黒小） */}
      <rect x="200" y="90" width="80" height="28" fill="#111" />
      <rect x="204" y="94" width="72" height="20" fill="#FFD700" />
      {/* シャッター */}
      <rect x="80" y="160" width="240" height="60" fill="#AAA" />
      {[0,6,12,18,24,30,36,42,48,54].map((y) => (
        <line key={y} x1="80" y1={160 + y} x2="320" y2={160 + y} stroke="#999" strokeWidth="1" />
      ))}
      {/* 歩道 */}
      <rect x="0" y="220" width="400" height="60" fill="#C8C8C0" />
      {[0,50,100,150,200,250,300,350].map((x) => (
        <line key={x} x1={x} y1="220" x2={x} y2="280" stroke="#AAA" strokeWidth="1" />
      ))}
      {[240,260].map((y) => (
        <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="#AAA" strokeWidth="1" />
      ))}
      {/* 行列シルエット */}
      {[290,322,350,375].map((x, i) => (
        <g key={i}>
          <ellipse cx={x} cy="216" rx="11" ry="13" fill="#444" />
          <rect x={x - 10} y="229" width="20" height="32" fill="#333" rx="2" />
        </g>
      ))}
    </svg>
  );
}

// ─── 場面: entrance（食券機） ─────────────────────────────────
function BgEntrance() {
  return (
    <svg viewBox="0 0 400 280" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="280" fill="#E8E0D0" />
      <rect x="0" y="215" width="400" height="65" fill="#C0B898" />
      {[0,50,100,150,200,250,300,350,400].map((x) => (
        <line key={`v${x}`} x1={x} y1="215" x2={x} y2="280" stroke="#AAA" strokeWidth="1" />
      ))}
      {[235,255,275].map((y) => (
        <line key={`h${y}`} x1="0" y1={y} x2="400" y2={y} stroke="#AAA" strokeWidth="1" />
      ))}
      <rect x="0" y="178" width="400" height="8" fill="#8B6040" />
      {/* 食券機 */}
      <rect x="55" y="60" width="110" height="158" fill="#FFD700" rx="6" />
      <rect x="55" y="60" width="110" height="158" fill="none" stroke="#111" strokeWidth="4" rx="6" />
      <rect x="68" y="74" width="84" height="44" fill="#222" rx="3" />
      <rect x="72" y="78" width="76" height="36" fill="#001800" rx="2" />
      {[0,1,2,3].map((row) => [0,1].map((col) => (
        <rect key={`${row}-${col}`} x={68 + col * 42} y={128 + row * 24} width="36" height="18" fill="#CC0000" rx="3" />
      )))}
      <rect x="91" y="210" width="38" height="5" fill="#B8960C" rx="2" />
      {/* 張り紙 */}
      <rect x="210" y="80" width="130" height="100" fill="#FFFFF0" />
      <rect x="210" y="80" width="130" height="100" fill="none" stroke="#CC0000" strokeWidth="3" />
      <rect x="222" y="93" width="106" height="6" fill="#CC0000" rx="2" />
      {[112,126,140,154,168].map((y) => (
        <rect key={y} x="222" y={y} width={60 + Math.random() * 40} height="5" fill="#888" rx="2" />
      ))}
    </svg>
  );
}

// ─── 場面: counter（カウンター越し） ─────────────────────────
function BgCounter() {
  return (
    <svg viewBox="0 0 400 280" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="280" fill="#D4C8B0" />
      <rect x="0" y="0" width="400" height="140" fill="#E8E4DC" />
      {[0,40,80,120,160,200,240,280,320,360,400].map((x) => (
        <line key={`cv${x}`} x1={x} y1="0" x2={x} y2="140" stroke="#CCC" strokeWidth="1" />
      ))}
      {[0,35,70,105,140].map((y) => (
        <line key={`ch${y}`} x1="0" y1={y} x2="400" y2={y} stroke="#CCC" strokeWidth="1" />
      ))}
      {/* レンジフード */}
      <rect x="90" y="5" width="220" height="42" fill="#888" rx="4" />
      <rect x="110" y="47" width="180" height="10" fill="#777" />
      {/* 大鍋 */}
      <ellipse cx="175" cy="118" rx="55" ry="16" fill="#444" />
      <rect x="120" y="104" width="110" height="22" fill="#333" rx="3" />
      {[158,175,192].map((x) => (
        <path key={x} d={`M${x},98 Q${x+6},82 ${x},66 Q${x-6},50 ${x},34`}
          fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="4" strokeLinecap="round" />
      ))}
      {/* カウンター */}
      <rect x="0" y="160" width="400" height="22" fill="#8B6040" />
      <rect x="0" y="180" width="400" height="6" fill="#5A3820" />
      <rect x="0" y="186" width="400" height="94" fill="#A07850" />
      {/* 丼 */}
      <ellipse cx="200" cy="158" rx="50" ry="14" fill="#F5F0E8" />
      <rect x="152" y="146" width="96" height="22" fill="#F5F0E8" />
      <ellipse cx="200" cy="146" rx="44" ry="11" fill="#E8DCC8" />
      <ellipse cx="200" cy="146" rx="36" ry="8" fill="#C8843C" opacity="0.9" />
      <ellipse cx="200" cy="140" rx="26" ry="7" fill="#F0E0A0" />
      <ellipse cx="184" cy="138" rx="13" ry="9" fill="#A06040" />
      <ellipse cx="216" cy="137" rx="11" ry="8" fill="#B07050" />
      {[192,200,208].map((x) => (
        <line key={x} x1={x} y1="133" x2={x + 3} y2="143" stroke="#E0F0C0" strokeWidth="2" />
      ))}
    </svg>
  );
}

// ─── 場面: eating（食事中） ──────────────────────────────────
function BgEating() {
  return (
    <svg viewBox="0 0 400 280" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="280" fill="#D4C8B0" />
      <rect x="0" y="0" width="400" height="120" fill="#E8E4DC" />
      <rect x="0" y="120" width="400" height="22" fill="#8B6040" />
      <rect x="0" y="140" width="400" height="8" fill="#5A3820" />
      <rect x="0" y="148" width="400" height="132" fill="#A07850" />
      {/* 大きな丼アップ */}
      <ellipse cx="200" cy="118" rx="95" ry="28" fill="#F5F0E8" />
      <rect x="107" y="92" width="186" height="36" fill="#F5F0E8" />
      <ellipse cx="200" cy="92" rx="88" ry="22" fill="#E8DCC8" />
      <ellipse cx="200" cy="90" rx="80" ry="19" fill="#C8843C" opacity="0.88" />
      <ellipse cx="200" cy="84" rx="60" ry="15" fill="#F0E0A0" />
      {[162,175,188,200,212,225,238].map((x) => (
        <line key={x} x1={x} y1="74" x2={x + 4} y2="90" stroke="#D0EAAA" strokeWidth="3" strokeLinecap="round" />
      ))}
      <ellipse cx="176" cy="80" rx="24" ry="15" fill="#A06040" />
      <ellipse cx="226" cy="78" rx="21" ry="14" fill="#B07050" />
      <line x1="162" y1="80" x2="190" y2="80" stroke="#8B4030" strokeWidth="2" />
      <line x1="213" y1="78" x2="239" y2="78" stroke="#8B4030" strokeWidth="2" />
      <circle cx="200" cy="74" r="9" fill="#FFFFF0" />
      {[172,200,228].map((x) => (
        <path key={x} d={`M${x},65 Q${x + 9},50 ${x},35 Q${x - 9},20 ${x},5`}
          fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="5" strokeLinecap="round" />
      ))}
      <line x1="318" y1="128" x2="284" y2="86" stroke="#8B6040" strokeWidth="4" strokeLinecap="round" />
      <line x1="333" y1="134" x2="298" y2="90" stroke="#8B6040" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

// ─── 場面: exit（退店） ──────────────────────────────────────
function BgExit() {
  return (
    <svg viewBox="0 0 400 280" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="280" fill="#D4C8B0" />
      <rect x="130" y="0" width="140" height="220" fill="#FFE88A" opacity="0.55" />
      <rect x="0" y="218" width="400" height="62" fill="#C0B898" />
      {[0,50,100,150,200,250,300,350,400].map((x) => (
        <line key={`v${x}`} x1={x} y1="218" x2={x} y2="280" stroke="#AAA" strokeWidth="1" />
      ))}
      {[238,258,278].map((y) => (
        <line key={`h${y}`} x1="0" y1={y} x2="400" y2={y} stroke="#AAA" strokeWidth="1" />
      ))}
      <rect x="0" y="0" width="130" height="280" fill="#C8B898" />
      <rect x="270" y="0" width="130" height="280" fill="#C8B898" />
      <rect x="0" y="182" width="130" height="8" fill="#8B6040" />
      <rect x="270" y="182" width="130" height="8" fill="#8B6040" />
      <rect x="128" y="0" width="12" height="220" fill="#5A3820" />
      <rect x="260" y="0" width="12" height="220" fill="#5A3820" />
      <rect x="128" y="218" width="144" height="10" fill="#5A3820" />
      <rect x="140" y="20" width="120" height="198" fill="#8B6040" />
      <rect x="140" y="20" width="120" height="198" fill="none" stroke="#5A3820" strokeWidth="3" />
      <rect x="155" y="40" width="38" height="52" fill="#C8E8F0" rx="2" />
      <rect x="200" y="40" width="38" height="52" fill="#C8E8F0" rx="2" />
      <circle cx="234" cy="124" r="7" fill="#FFD700" />
      {/* のれん */}
      {[140,176,212,246].map((x, i) => (
        <rect key={x} x={x} y={0} width={30} height={18 + (i % 2) * 2} fill="#FFD700" />
      ))}
    </svg>
  );
}

// ─── メインコンポーネント ─────────────────────────────────────
interface SceneBackgroundProps {
  bg: BackgroundId;
  className?: string;
}

export default function SceneBackground({ bg, className = "" }: SceneBackgroundProps) {
  return (
    <div className={className} style={{ width: "100%", height: "100%" }}>
      {bg === "street" && (
        <PhotoOrSvg
          src="/bg_street.jpg"
          objectPosition="center 40%"
          Fallback={BgStreetSVG}
        />
      )}
      {bg === "entrance" && <BgEntrance />}
      {bg === "counter" && <BgCounter />}
      {bg === "eating" && <BgEating />}
      {bg === "exit" && <BgExit />}
    </div>
  );
}
