export function timeDisplayParts(
  time: Date,
  eventTimeZone: string,
  localTime: boolean
): string[] {
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

  return time
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
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };

  if (!localTime) {
    options.timeZone = eventTimeZone;
  }

  return time.toLocaleTimeString(navigator.language, options);
}

export function eventWeekday(
  time: Date,
  eventTimeZone: string,
  localTime: boolean
): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
  };

  if (!localTime) {
    options.timeZone = eventTimeZone;
  }

  return time.toLocaleString(navigator.language, options);
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

export function addBookmark(eventId: string) {
  const bookmarks: string[] =
    JSON.parse(localStorage.getItem("bookmarks") ?? "[]") ?? [];
  const newBookmarks = [...bookmarks, eventId];
  localStorage.setItem("bookmarks", JSON.stringify(newBookmarks));
}

export function removeBookmark(eventId: string) {
  const bookmarks: string[] =
    JSON.parse(localStorage.getItem("bookmarks") ?? "[]") ?? [];
  const newBookmarks = bookmarks.filter((b) => b !== eventId);
  localStorage.setItem("bookmarks", JSON.stringify(newBookmarks));
}
