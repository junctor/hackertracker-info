import { updatedDate } from "./fb";
import { HTEvent } from "./ht";

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

export function toggleSetting(
  setting: "hideCompleted" | "localTime",
  on: boolean
) {
  localStorage.setItem(setting, `${on}`);
}

export function getSetting(setting: "hideCompleted" | "localTime") {
  return localStorage.getItem(setting);
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

function removeCache() {
  localStorage.removeItem("updated");
  localStorage.removeItem("events");
  localStorage.removeItem("speakers");
}

export async function invalidateCache() {
  if (!navigator.onLine) {
    return;
  }

  const cacheUpdatedDate = localStorage.getItem("updated");

  if (!cacheUpdatedDate) {
    removeCache();
    return;
  }

  const cacheUpdatedTime = parseInt(cacheUpdatedDate, 10);

  const now = new Date().getTime();
  const deltaTime = now - cacheUpdatedTime;
  const hourMs = 3600000;
  const thirtyMinMs = hourMs / 3;

  if (deltaTime > thirtyMinMs) {
    try {
      const fbUpdated = await updatedDate();
      const fbUpdatedTime = fbUpdated.toMillis();

      if (fbUpdatedTime > cacheUpdatedTime || deltaTime > hourMs) {
        removeCache();
      }
      // eslint-disable-next-line no-empty
    } catch (e) {}
  }
}

/* eslint-disable no-param-reassign */
export const groupedDates = (
  events: HTEvent[],
  localTime: boolean = false
): Record<string, [HTEvent]> =>
  events.reduce((group, e) => {
    const day = eventDay(new Date(e.begin), "America/Los_Angeles", localTime);
    group[day] = group[day] || [];
    group[day].push(e);
    return group;
  }, {} as Record<string, [HTEvent]>);
/* eslint-disable no-param-reassign */

export function filterEvents(events: HTEvent[]) {
  const includedCats = [
    "DEF CON Official Talk",
    "DEF CON Music",
    "DEF CON Policy Team Supplementary Programming",
    "DEF CON Workshop",
    "Parties & Meetups",
    "Misc",
    "Demo Lab",
  ];
  return groupedDates(
    events.filter((e) => {
      if (!includedCats.includes(e.type.name)) {
        return false;
      }

      const future = new Date();
      future.setHours(future.getHours() + 5);

      const now = new Date();

      const end = new Date(e.end).getTime();

      if (end > now.getTime() && end < future.getTime()) {
        return true;
      }

      return false;
    })
  );
}

export function pageScroll() {
  window.scrollBy({
    top: 45,
    left: 0,
    behavior: "smooth",
  });
}
