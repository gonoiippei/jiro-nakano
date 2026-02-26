import { useState, useEffect, useRef } from "react";

/**
 * タイプライター効果フック
 * @param text 表示するテキスト
 * @param speed 文字間隔(ms)。0のとき即時表示。
 */
export function useTypewriter(text: string, speed: number = 30): string {
  const [displayed, setDisplayed] = useState("");
  const indexRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setDisplayed("");
    indexRef.current = 0;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (speed === 0) {
      setDisplayed(text);
      return;
    }

    const tick = () => {
      if (indexRef.current < text.length) {
        indexRef.current += 1;
        setDisplayed(text.slice(0, indexRef.current));
        timerRef.current = setTimeout(tick, speed);
      }
    };

    timerRef.current = setTimeout(tick, speed);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [text, speed]);

  return displayed;
}
