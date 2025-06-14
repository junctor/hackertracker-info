const LAS_VEGAS_TZ = "America/Los_Angeles";

export function eventTimeTable(date: string, tz = true): string {
  const time = new Date(date);
  const options: Intl.DateTimeFormatOptions = {
    timeZoneName: tz ? "short" : undefined,
    hour12: false,
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: LAS_VEGAS_TZ,
  };

  return time.toLocaleTimeString("en-US", options);
}

export function eventDayTable(date: string): string {
  const time = new Date(date);
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: LAS_VEGAS_TZ,
  };

  return time.toLocaleString("en-US", options);
}

export function timeDisplayParts(time: string): string[] {
  const date = new Date(time);
  const options: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    timeZoneName: "short",
    hour12: false,
    timeZone: LAS_VEGAS_TZ,
  };

  return date.toLocaleTimeString("en-US", options).replace(",", "").split(" ");
}

export function upcomingTimeDisplayParts(time: string): string[] {
  const date = new Date(time);
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    timeZoneName: "short",
    hour12: false,
    timeZone: LAS_VEGAS_TZ,
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
    timeZone: LAS_VEGAS_TZ,
  };

  return time.toLocaleDateString("en-US", options);
}

export function newsDate(timestampSeconds: number): string {
  const time = new Date(timestampSeconds * 1000);
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZoneName: "short",
    timeZone: LAS_VEGAS_TZ,
  };

  return time.toLocaleDateString("en-US", options);
}

export function tabDateTitle(day: string): string {
  const date = new Date(day);
  date.setHours(8, 0, 0); // normalize for display

  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    timeZone: LAS_VEGAS_TZ,
  };

  return date.toLocaleDateString("en-US", options);
}

export function dateGroupTitle(day: string): string {
  const date = new Date(day);
  date.setHours(8, 0, 0);

  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    timeZone: LAS_VEGAS_TZ,
  };

  return date.toLocaleDateString("en-US", options);
}

export function eventWeekday(time: string): string {
  const date = new Date(time);
  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    timeZone: LAS_VEGAS_TZ,
  };

  return date.toLocaleDateString("en-US", options);
}

export function eventTime(time: Date, includeTz = true): string {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: LAS_VEGAS_TZ,
    timeZoneName: includeTz ? "short" : undefined,
    weekday: "short",
    hour12: false,
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  };

  return time.toLocaleTimeString("en-US", options);
}

export function newsTime(time: Date, includeTz = true): string {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: LAS_VEGAS_TZ,
    timeZoneName: includeTz ? "short" : undefined,
    hour12: false,
    day: "numeric",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  };

  return time.toLocaleTimeString("en-US", options);
}
