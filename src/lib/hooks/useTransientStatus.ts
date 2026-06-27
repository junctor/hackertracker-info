import { useCallback, useEffect, useRef, useState } from "react";

export function useTransientStatus(timeoutMs = 2400) {
  const [status, setStatus] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setTransientStatus = useCallback(
    (message: string) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      setStatus(message);
      timeoutRef.current = setTimeout(() => {
        setStatus(null);
        timeoutRef.current = null;
      }, timeoutMs);
    },
    [timeoutMs],
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return [status, setTransientStatus] as const;
}
