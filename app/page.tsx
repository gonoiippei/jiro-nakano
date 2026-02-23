import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: "#1a1a1a" }}>
      {/* 上部の赤帯 */}
      <div className="w-full py-3 text-center text-white font-black text-sm tracking-widest" style={{ background: "#cc0000" }}>
        ★ 二郎系ラーメン ★ 仲野店 ★ 覚悟して入店せよ ★
      </div>

      <div className="flex flex-col items-center max-w-lg w-full px-4 py-8">
        {/* 店舗看板 */}
        <div
          className="w-full text-center py-6 px-4 mb-6"
          style={{
            background: "#cc0000",
            border: "6px solid #fff",
            boxShadow: "0 0 0 3px #cc0000, 8px 8px 0 #990000",
          }}
        >
          <p className="text-white font-black text-sm tracking-widest mb-1">ラーメン</p>
          <h1 className="text-white font-black leading-none" style={{ fontSize: "3.5rem", textShadow: "3px 3px 0 #990000" }}>
            二郎
          </h1>
          <p className="text-white font-black text-2xl tracking-widest">仲野店</p>
        </div>

        {/* 店主・仲野の画像エリア */}
        <div className="w-full mb-6 relative">
          <div
            className="w-full aspect-square max-h-72 flex items-center justify-center overflow-hidden"
            style={{ background: "#f5f0e8", border: "4px solid #fff" }}
          >
            <Image
              src="https://placehold.co/400x400/f5f0e8/1a1a1a?text=%E4%BB%B2%E9%87%8E%E5%BA%97%E4%B8%BB"
              alt="店主・仲野"
              width={400}
              height={400}
              className="object-cover w-full h-full"
              unoptimized
            />
          </div>
          <div
            className="absolute bottom-0 left-0 right-0 py-2 px-4 text-center"
            style={{ background: "rgba(26,26,26,0.85)" }}
          >
            <p className="text-white font-black text-lg">店主・仲野</p>
          </div>
        </div>

        {/* 仲野からのセリフ */}
        <div
          className="w-full p-4 mb-6 text-center"
          style={{
            background: "#f5f0e8",
            border: "3px solid #1a1a1a",
            boxShadow: "4px 4px 0 #1a1a1a",
          }}
        >
          <p className="font-black text-xl" style={{ color: "#1a1a1a" }}>
            「入りたいなら
            <span style={{ color: "#cc0000" }}>二郎のルール</span>を
            わかってもらわないと困る。」
          </p>
          <p className="text-gray-600 text-sm mt-2 font-bold">
            ── 全10問。正しい二郎マナーを証明しろ。
          </p>
        </div>

        {/* 注意書き */}
        <div
          className="w-full p-3 mb-6 text-sm"
          style={{
            background: "#fff3cd",
            border: "2px solid #cc0000",
          }}
        >
          <p className="font-bold text-center" style={{ color: "#cc0000" }}>
            ⚠ 間違えると仲野に怒られます
          </p>
          <ul className="mt-2 text-gray-700 space-y-1 text-xs">
            <li>・二郎のルール・マナーに関する全10問</li>
            <li>・間違えると仲野から叱責されます</li>
            <li>・全問正解で「ジロリアン認定」</li>
          </ul>
        </div>

        {/* 入店ボタン */}
        <Link href="/quiz" className="w-full">
          <button className="jiro-btn text-xl font-black tracking-widest py-5">
            ▶ 入 店 す る
          </button>
        </Link>

        <p className="text-gray-400 text-xs mt-4 text-center">
          ※これはフィクションです。実際の店舗とは関係ありません。
        </p>
      </div>

      {/* 下部の帯 */}
      <div className="w-full py-2 text-center text-white text-xs" style={{ background: "#cc0000" }}>
        © ラーメン二郎 仲野店
      </div>
    </div>
  );
}
