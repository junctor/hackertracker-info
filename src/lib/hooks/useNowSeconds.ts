import { useEffect, useState } from "react";

export function useNowSeconds() {
  const [nowSeconds, setNowSeconds] = useState(0);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const tick = () => {
      const nowMs = Date.now();
      setNowSeconds(Math.floor(nowMs / 1000));
      timeoutId = setTimeout(tick, 1000 - (nowMs % 1000));
    };

    tick();
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  return nowSeconds;
}
