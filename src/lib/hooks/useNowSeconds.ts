import { useEffect, useState } from "react";

export function useNowSeconds() {
  const [nowSeconds, setNowSeconds] = useState(0);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setNowSeconds(Math.floor(Date.now() / 1000));
    }, 0);

    return () => clearTimeout(timeoutId);
  }, []);

  return nowSeconds;
}
