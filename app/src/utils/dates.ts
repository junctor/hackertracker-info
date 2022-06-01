export function timeDisplayParts(
  time: string,
  eventTimeZone: string,
  localTime: boolean
): string[] {
  const date = new Date(time);
  const options: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
    hour12: false,
    weekday: "short",
  };

  if (!localTime) {
    options.timeZone = eventTimeZone;
  }

  return date
    .toLocaleTimeString(navigator.language, options)
    .replace(",", "")
    .split(" ");
}

export function eventDay(
  time: Date,
  eventTimeZone: string,
  localTime: boolean
): string {
  const options: Intl.DateTimeFormatOptions = {
    timeZoneName: "short",
    weekday: "long",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };

  if (!localTime) {
    options.timeZone = eventTimeZone;
  }

  const date = time
    .toLocaleTimeString(navigator.language, options)
    .split(",")
    .slice(0, 2)
    .join(", ")
    .toUpperCase();

  return date;
}

export function eventWeekday(
  time: string,
  eventTimeZone: string,
  localTime: boolean
): string {
  const date = new Date(time);
  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
  };

  if (!localTime) {
    options.timeZone = eventTimeZone;
  }

  return date.toLocaleString(navigator.language, options);
}

export function eventTime(
  time: Date,
  eventTimeZone: string,
  localTime: boolean
): string {
  const options: Intl.DateTimeFormatOptions = {
    timeZoneName: "short",
    hour12: false,
    weekday: "long",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  };

  if (!localTime) {
    options.timeZone = eventTimeZone;
  }

  return time.toLocaleTimeString(navigator.language, options);
}

export const groupedDates = (
  events: HTEvent[],
  localTime: boolean = false
): Map<string, HTEvent[]> =>
  events.reduce((group, e) => {
    const day = eventDay(new Date(e.begin), "America/Los_Angeles", localTime);
    const dayEvents = group.get(day) ?? [];
    dayEvents.push(e);
    group.set(day, dayEvents);
    return group;
  }, new Map<string, HTEvent[]>());

export function pageScroll() {
  window.scrollBy({
    top: 45,
    left: 0,
    behavior: "smooth",
  });
}
