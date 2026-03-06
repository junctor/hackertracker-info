const BOOKMARKS_KEY = "bookmarks";

function readBookmarks(): number[] {
  try {
    const raw = JSON.parse(localStorage.getItem(BOOKMARKS_KEY) ?? "[]");
    if (!Array.isArray(raw)) return [];

    const seen = new Set<number>();
    const normalized: number[] = [];

    for (const value of raw) {
      const parsed = typeof value === "number" ? value : Number.parseInt(String(value), 10);
      if (!Number.isInteger(parsed) || seen.has(parsed)) continue;
      seen.add(parsed);
      normalized.push(parsed);
    }

    return normalized;
  } catch {
    return [];
  }
}

function writeBookmarks(bookmarks: number[]) {
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
  window.dispatchEvent(new Event("bookmarks:changed"));
}

export const addBookmark = (eventId: number) => {
  if (typeof window === "undefined") return;

  const bookmarks = readBookmarks();
  if (bookmarks.includes(eventId)) return;

  writeBookmarks([...bookmarks, eventId]);
};

export const removeBookmark = (eventId: number) => {
  if (typeof window === "undefined") return;

  const bookmarks = readBookmarks();
  const nextBookmarks = bookmarks.filter((b) => b !== eventId);
  if (nextBookmarks.length === bookmarks.length) return;

  writeBookmarks(nextBookmarks);
};

export const getBookmarks = (): number[] => {
  if (typeof window === "undefined") return [];
  return readBookmarks();
};
