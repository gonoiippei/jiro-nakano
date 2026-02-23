"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";

function ResultContent() {
  const params = useSearchParams();
  const score = parseInt(params.get("score") || "0");
  const total = parseInt(params.get("total") || "10");
  const wrong = parseInt(params.get("wrong") || "0");
  const percentage = Math.round((score / total) * 100);

  const isPerfect = score === total;
  const isGood = score >= 8;
  const isMid = score >= 5;

  const resultData = isPerfect
    ? {
        title: "ジロリアン認定！",
        subtitle: "完全制覇",
        message: "「……認めよう。お前は本物のジロリアンだ。次も来い。」",
        subMessage: "全問正解！仲野も渋々認めました。",
        imgUrl: "https://placehold.co/400x300/1a5c1a/ffffff?text=%E4%BB%B2%E9%87%8E%EF%BC%88%E6%BA%80%E8%B6%B3%EF%BC%89",
        bgColor: "#1a5c1a",
        accent: "#2d8c2d",
      }
    : isGood
    ? {
        title: "まあ合格だ",
        subtitle: `${score}/${total}問正解`,
        message: "「悪くはない。もっと精進しろよ。」",
        subMessage: "惜しい！もう少しで完全制覇でした。",
        imgUrl: "https://placehold.co/400x300/4a4a00/ffffff?text=%E4%BB%B2%E9%87%8E%EF%BC%88%E6%99%AE%E9%80%9A%EF%BC%89",
        bgColor: "#4a4a00",
        accent: "#8a8a00",
      }
    : isMid
    ? {
        title: "修行が足りない",
        subtitle: `${score}/${total}問正解`,
        message: "「まだまだだな。もっと二郎に来い。」",
        subMessage: "半分は正解！でも仲野はまだ納得していません。",
        imgUrl: "https://placehold.co/400x300/8a4500/ffffff?text=%E4%BB%B2%E9%87%8E%EF%BC%88%E4%B8%8D%E6%BA%80%EF%BC%89",
        bgColor: "#8a4500",
        accent: "#cc6600",
      }
    : {
        title: "もう出てって",
        subtitle: `${score}/${total}問正解`,
        message: "「二郎に来る前に出直してきてほしいんだけど。マジで。」",
        subMessage: "仲野が激怒しています。ゼロから勉強し直しましょう。",
        imgUrl: "https://placehold.co/400x300/cc0000/ffffff?text=%E4%BB%B2%E9%87%8E%EF%BC%88%E6%BF%80%E6%80%92%EF%BC%89",
        bgColor: "#cc0000",
        accent: "#990000",
      };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#1a1a1a" }}>
      {/* ヘッダー */}
      <div className="w-full py-2 px-4 text-center" style={{ background: "#cc0000" }}>
        <span className="text-white font-black text-sm">ラーメン二郎 仲野店 ── 結果発表</span>
      </div>

      <div className="flex flex-col items-center max-w-lg w-full mx-auto px-4 py-6">
        {/* 仲野の画像 */}
        <div
          className="w-full mb-5 overflow-hidden fade-in"
          style={{ border: "4px solid #fff", maxHeight: "240px" }}
        >
          <Image
            src={resultData.imgUrl}
            alt="店主・仲野"
            width={400}
            height={240}
            className="w-full object-cover"
            style={{ maxHeight: "240px" }}
            unoptimized
          />
        </div>

        {/* 結果タイトル */}
        <div
          className="w-full p-5 mb-5 text-center fade-in"
          style={{
            background: resultData.bgColor,
            border: "4px solid #fff",
            boxShadow: `6px 6px 0 ${resultData.accent}`,
          }}
        >
          <p className="text-white font-black text-4xl mb-1">{resultData.title}</p>
          <p className="text-white font-black text-xl opacity-80">{resultData.subtitle}</p>
        </div>

        {/* 仲野のコメント */}
        <div
          className="w-full p-4 mb-5"
          style={{
            background: "#f5f0e8",
            border: "3px solid #fff",
            boxShadow: "4px 4px 0 #fff",
          }}
        >
          <p className="font-black text-xl text-center" style={{ color: "#1a1a1a" }}>
            {resultData.message}
          </p>
          <p className="text-center text-gray-600 text-sm mt-2">{resultData.subMessage}</p>
        </div>

        {/* スコア詳細 */}
        <div
          className="w-full p-4 mb-6"
          style={{
            background: "#2a2a2a",
            border: "3px solid #444",
          }}
        >
          <div className="flex justify-between items-center mb-3">
            <span className="text-white font-black">正解数</span>
            <span className="font-black text-2xl" style={{ color: "#4ade80" }}>
              {score} 問
            </span>
          </div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-white font-black">不正解数</span>
            <span className="font-black text-2xl" style={{ color: "#f87171" }}>
              {wrong} 問
            </span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-white font-black">正答率</span>
            <span className="font-black text-2xl text-white">{percentage}%</span>
          </div>
          {/* 正答率バー */}
          <div className="w-full h-4 rounded-none" style={{ background: "#444" }}>
            <div
              className="h-full transition-all duration-1000"
              style={{
                width: `${percentage}%`,
                background: isPerfect ? "#4ade80" : isGood ? "#facc15" : isMid ? "#fb923c" : "#f87171",
              }}
            />
          </div>
        </div>

        {/* ボタン群 */}
        <div className="w-full space-y-3">
          <Link href="/quiz" className="w-full">
            <button className="jiro-btn text-lg font-black tracking-widest">
              ▶ もう一度挑戦する
            </button>
          </Link>
          <Link href="/" className="w-full">
            <button className="jiro-btn-white text-lg font-black text-center">
              ▶ トップに戻る
            </button>
          </Link>
        </div>

        {isPerfect && (
          <div
            className="mt-5 p-3 text-center w-full fade-in"
            style={{ background: "#1a5c1a", border: "2px solid #4ade80" }}
          >
            <p className="text-green-300 font-black">
              🏆 ジロリアン認定証 🏆
            </p>
            <p className="text-green-200 text-sm mt-1">
              全問正解達成！あなたは本物のジロリアンです。
            </p>
          </div>
        )}

        <p className="text-gray-500 text-xs mt-5 text-center">
          ※これはフィクションです。実際の店舗とは関係ありません。
        </p>
      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center" style={{ background: "#1a1a1a" }}><p className="text-white font-black">読み込み中...</p></div>}>
      <ResultContent />
    </Suspense>
  );
}
