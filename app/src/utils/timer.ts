export function getCountdown(): Timer {
  const now = new Date().valueOf();
  const dc30 = new Date("2023-08-11T00:00:00.000-07:00").valueOf();
  const d = (dc30 - now) / (24 * 60 * 60 * 1000);
  const h = (d % 1) * 24;
  const m = (h % 1) * 60;
  const s = (m % 1) * 60;

  const timer: Timer = {
    days: Math.floor(d),
    hours: Math.floor(h),
    minutes: Math.floor(m),
    seconds: Math.floor(s),
  };

  return timer;
}
