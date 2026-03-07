const LOCALE = "en-US";

type Dateish = string | Date;

function toDate(value: Dateish): Date {
  return typeof value === "string" ? new Date(value) : value;
}

export function eventTimeTable(value: Dateish, showTz = true, tz: string): string {
  const date = toDate(value);
  return date.toLocaleTimeString(LOCALE, {
    timeZone: tz,
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: showTz ? "short" : undefined,
  });
}

export function eventDayTable(day: string, tz: string): string {
  const [y, m, d] = day.split("-").map(Number);
  const safe = new Date(Date.UTC(y, m - 1, d, 12, 0, 0)); // noon UTC

  return safe.toLocaleDateString(LOCALE, {
    timeZone: tz,
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function tabDateTitle(day: string, tz: string): string {
  const [y, m, d] = day.split("-").map(Number);
  const safe = new Date(Date.UTC(y, m - 1, d, 12, 0, 0)); // noon UTC

  return safe.toLocaleDateString(LOCALE, {
    timeZone: tz,
    month: "short",
    day: "numeric",
  });
}

export function eventTime(value: Dateish, showTz = true, tz: string): string {
  const date = toDate(value);
  return date.toLocaleTimeString(LOCALE, {
    timeZone: tz,
    hour12: false,
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: showTz ? "short" : undefined,
  });
}

export function newsTime(
  time: Date,
  tz: string,
  opts?: { showYear?: "auto" | boolean; showTz?: boolean },
): string {
  const { showYear = "auto", showTz = false } = opts ?? {};

  const now = new Date();
  const includeYear = showYear === "auto" ? time.getFullYear() !== now.getFullYear() : showYear;

  const fmt = new Intl.DateTimeFormat(LOCALE, {
    timeZone: tz,
    month: "short", // Oct
    day: "numeric", // 21
    year: includeYear ? "numeric" : undefined,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZoneName: showTz ? "short" : undefined,
  });

  // Default output: "Oct 21, 07:43" (or "Oct 21, 2025, 07:43" if not this year)
  return fmt.format(time);
}

export function newsAgo(time: Date, now: Date = new Date()): string {
  const diffMs = time.getTime() - now.getTime(); // future => positive
  const absMs = Math.abs(diffMs);

  const sec = Math.round(absMs / 1000);
  if (sec < 45) return diffMs < 0 ? `${sec}s ago` : `in ${sec}s`;

  const min = Math.round(sec / 60);
  if (min < 45) return diffMs < 0 ? `${min}m ago` : `in ${min}m`;

  const hr = Math.round(min / 60);
  if (hr < 22) return diffMs < 0 ? `${hr}h ago` : `in ${hr}h`;

  const day = Math.round(hr / 24);
  if (day === 1) return diffMs < 0 ? "yesterday" : "tomorrow";
  if (day < 7) return diffMs < 0 ? `${day}d ago` : `in ${day}d`;

  const wk = Math.round(day / 7);
  if (wk < 5) return diffMs < 0 ? `${wk}w ago` : `in ${wk}w`;

  const mo = Math.round(day / 30);
  if (mo < 12) return diffMs < 0 ? `${mo}mo ago` : `in ${mo}mo`;

  const yr = Math.round(day / 365);
  return diffMs < 0 ? `${yr}y ago` : `in ${yr}y`;
}

export function formatSessionTime(begin: Date, end: Date, tz: string): string {
  // Compare the *local date in tz*, not the host machine timezone.
  const dayKey = (d: Date) =>
    new Intl.DateTimeFormat("en-CA", {
      timeZone: tz,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(d);

  const sameDate = dayKey(begin) === dayKey(end);

  if (sameDate) {
    const dateStr = begin.toLocaleDateString(LOCALE, {
      timeZone: tz,
      weekday: "short",
      month: "short",
      day: "numeric",
    });

    const startTime = begin.toLocaleTimeString(LOCALE, {
      timeZone: tz,
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });

    const endTime = end.toLocaleTimeString(LOCALE, {
      timeZone: tz,
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    });

    return `${dateStr} at ${startTime} – ${endTime}`;
  }

  return `${eventTime(begin, false, tz)} – ${eventTime(end, true, tz)}`;
}
