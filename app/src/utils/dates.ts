export function timeDisplayParts(
  time: string,
  eventTimeZone: string,
  localTime: boolean
): string[] {
  const date = new Date(time);
  const options: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    timeZoneName: "short",
    hour12: true,
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
    day: "numeric",
    year: "numeric",
    month: "numeric",
    hour12: false,
  };

  if (!localTime) {
    options.timeZone = eventTimeZone;
  }

  const date = time
    .toLocaleTimeString(navigator.language, options)
    .split(",")
    .slice(0, 1)
    .join();
  return date;
}

export function tabDateTitle(
  day: string,
  localTime: boolean,
  eventTimeZone: string
): string {
  const time = new Date(day);

  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
  };

  if (!localTime) {
    options.timeZone = eventTimeZone;
  }

  const date = time
    .toLocaleTimeString(navigator.language, options)
    .split(",")
    .slice(0, 1)
    .join();

  return date;
}

export function dateGroupTitle(
  day: string,
  localTime: boolean,
  eventTimeZone: string
): string {
  const time = new Date(day);

  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
  };

  if (!localTime) {
    options.timeZone = eventTimeZone;
  }

  const date = time
    .toLocaleTimeString(navigator.language, options)
    .split(",")
    .slice(0, 1)
    .join();

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
  localTime: boolean,
  timeZone: string
): Map<string, HTEvent[]> =>
  events
    .sort((a, b) => a.begin_timestamp.seconds - b.begin_timestamp.seconds)
    .reduce((group, e) => {
      const day = eventDay(new Date(e.begin), timeZone, localTime);
      const dayEvents = group.get(day) ?? [];
      dayEvents.push(e);
      group.set(day, dayEvents);
      return group;
    }, new Map<string, HTEvent[]>());
