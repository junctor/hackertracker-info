import { useEffect, useRef, useState } from "react";

export function useNowSeconds() {
  const [nowSeconds, setNowSeconds] = useState(() => Math.floor(Date.now() / 1000));
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const tick = () => {
      const nowMs = Date.now();
      setNowSeconds(Math.floor(nowMs / 1000));
      timeoutRef.current = setTimeout(tick, 1000 - (nowMs % 1000));
    };

    timeoutRef.current = setTimeout(tick, 1000 - (Date.now() % 1000));
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return nowSeconds;
}
