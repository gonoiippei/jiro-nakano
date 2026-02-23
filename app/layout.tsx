import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ラーメン二郎 仲野店",
  description: "店主・仲野が試す、二郎マニア度チェック。覚悟して入店せよ。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-white">
        {children}
      </body>
    </html>
  );
}
