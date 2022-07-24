export function timeDisplayParts(time: string): string[] {
  const date = new Date(time);
  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    timeZoneName: "short",
    hour12: true,
    timeZone: "America/Los_Angeles",
  };

  return date.toLocaleTimeString("en-US", options).replace(",", "").split(" ");
}

export function eventDay(time: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    timeZoneName: "short",
    day: "numeric",
    year: "numeric",
    month: "numeric",
    hour12: false,
    timeZone: "America/Los_Angeles",
  };

  const date = time
    .toLocaleTimeString("en-US", options)
    .split(",")
    .slice(0, 1)
    .join();
  return date;
}

export function tabDateTitle(day: string): string {
  const time = new Date(day);

  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  };

  const date = time.toLocaleDateString("en-US", options);

  return date;
}

export function dateGroupTitle(day: string): string {
  const time = new Date(day);

  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  };

  const date = time.toLocaleDateString("en-US", options);

  return date;
}

export function eventWeekday(time: string): string {
  const date = new Date(time);
  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    timeZone: "UTC",
  };

  return date.toLocaleString("en-US", options);
}

export function eventTime(time: Date, tz = true): string {
  const options: Intl.DateTimeFormatOptions = {
    timeZoneName: tz ? "short" : undefined,
    hour12: true,
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Los_Angeles",
  };

  if (tz) {
    options.timeZoneName = "short";
  }

  return time.toLocaleTimeString("en-US", options);
}

const groupedDates = (events: EventData[]): Map<string, EventData[]> =>
  events
    .sort((a, b) => a.beginTimestampSeconds - b.beginTimestampSeconds)
    .reduce((group, e) => {
      const day = eventDay(new Date(e.begin));
      const dayEvents = group.get(day) ?? [];
      dayEvents.push(e);
      group.set(day, dayEvents);
      return group;
    }, new Map<string, EventData[]>());

export const createDateGroup = (events: EventData[]) =>
  new Map(
    Array.from(groupedDates(events)).map(([d, et]) => [
      d,
      et.sort((a, b) => a.beginTimestampSeconds - b.beginTimestampSeconds),
    ])
  );
