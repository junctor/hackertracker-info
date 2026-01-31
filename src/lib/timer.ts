export function getCountdown(kickoffDateMs: number): Timer {
  const now = Date.now();
  const diff = kickoffDateMs - now;
  const d = diff / (24 * 60 * 60 * 1e3);
  const h = (d % 1) * 24;
  const m = (h % 1) * 60;
  const s = (m % 1) * 60;

  return {
    days: Math.max(0, Math.floor(d)),
    hours: Math.max(0, Math.floor(h)),
    minutes: Math.max(0, Math.floor(m)),
    seconds: Math.max(0, Math.floor(s)),
  };
}
