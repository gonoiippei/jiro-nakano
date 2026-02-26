import Link from "next/link";

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

        {/* 仲野からのセリフ */}
        <div
          className="w-full p-4 mb-6 text-center"
          style={{
            background: "#f5f0e8",
            border: "3px solid #fff",
            boxShadow: "4px 4px 0 #fff",
          }}
        >
          <p className="font-black text-xl" style={{ color: "#1a1a1a" }}>
            「覚悟して来てんだろうな。」
          </p>
          <p className="text-gray-600 text-sm mt-2 font-bold">
            ── 店主・仲野
          </p>
        </div>

        {/* メインCTA: サバイバルゲーム */}
        <Link href="/survival" className="w-full mb-3">
          <button className="jiro-btn text-xl font-black tracking-widest py-5">
            🍜 プチサバイバルゲームで入店する
          </button>
        </Link>
        <p className="text-gray-400 text-xs mb-5 text-center">
          全7場面・仲野ゲージ管理・ランダムイベントあり
        </p>

        {/* 区切り */}
        <div className="w-full flex items-center gap-3 mb-5">
          <div className="flex-1 h-px" style={{ background: "#444" }} />
          <span className="text-gray-500 text-xs font-bold">または</span>
          <div className="flex-1 h-px" style={{ background: "#444" }} />
        </div>

        {/* サブ: クイズ */}
        <Link href="/quiz" className="w-full mb-2">
          <button className="jiro-btn-white text-center font-black text-base py-4">
            📝 二郎マニア度クイズ（全10問）
          </button>
        </Link>
        <p className="text-gray-500 text-xs mb-6 text-center">
          ジロリアンなら全問正解できるはず
        </p>

        {/* 注意書き */}
        <div
          className="w-full p-3 text-xs"
          style={{ background: "#2a2a2a", border: "1px solid #444" }}
        >
          <p className="text-gray-400 text-center">
            ※これはフィクションです。実際の店舗・人物とは関係ありません。
          </p>
        </div>
      </div>

      {/* 下部の帯 */}
      <div className="w-full py-2 text-center text-white text-xs" style={{ background: "#cc0000" }}>
        © ラーメン二郎 仲野店
      </div>
    </div>
  );
}
