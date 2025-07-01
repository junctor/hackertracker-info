const LOCALE = "en-US";
const TZ = "America/Los_Angeles";

export function eventTimeTable(value: string | Date, showTz = true): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return date.toLocaleTimeString(LOCALE, {
    timeZone: TZ,
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: showTz ? "short" : undefined,
  });
}

export function eventDayTable(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return date.toLocaleDateString(LOCALE, {
    timeZone: TZ,
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function tabDateTitle(day: string): string {
  const date = new Date(day);
  date.setHours(8, 0, 0); // normalize so timezone shifts don’t move the date
  return date.toLocaleDateString(LOCALE, {
    timeZone: TZ,
    month: "short",
    day: "numeric",
  });
}

export function eventTime(value: string | Date, showTz = true): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return date.toLocaleTimeString(LOCALE, {
    timeZone: TZ,
    hour12: false,
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: showTz ? "short" : undefined,
  });
}

export function newsTime(time: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: TZ,
    hour12: false,
    day: "numeric",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  };

  return time.toLocaleTimeString(LOCALE, options);
}

export function formatSessionTime(begin: Date, end: Date): string {
  const sameDate = begin.toDateString() === end.toDateString();

  if (sameDate) {
    const dateStr = begin.toLocaleDateString(LOCALE, {
      timeZone: TZ,
      weekday: "short",
      month: "short",
      day: "numeric",
    });

    const startTime = begin.toLocaleTimeString(LOCALE, {
      timeZone: TZ,
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });

    const endTime = end.toLocaleTimeString(LOCALE, {
      timeZone: TZ,
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    });

    return `${dateStr} at ${startTime} – ${endTime}`;
  }

  return `${eventTime(begin, false)} – ${eventTime(end, true)}`;
}
