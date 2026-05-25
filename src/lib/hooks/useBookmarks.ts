import { useCallback, useEffect, useState } from "react";

import { addBookmark, getBookmarks, removeBookmark } from "@/lib/storage";

export function useBookmarks(eventId: number, initial: boolean) {
  const [bookmarked, setBookmarked] = useState<boolean>(() =>
    typeof window === "undefined" ? initial : getBookmarks().includes(eventId),
  );

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const syncBookmark = () => {
      setBookmarked(getBookmarks().includes(eventId));
    };

    syncBookmark();
    window.addEventListener("storage", syncBookmark);
    window.addEventListener("bookmarks:changed", syncBookmark);

    return () => {
      window.removeEventListener("storage", syncBookmark);
      window.removeEventListener("bookmarks:changed", syncBookmark);
    };
  }, [eventId]);

  const toggle = useCallback(() => {
    if (bookmarked) {
      removeBookmark(eventId);
    } else {
      addBookmark(eventId);
    }
    setBookmarked(getBookmarks().includes(eventId));
  }, [bookmarked, eventId]);
  return [bookmarked, toggle] as const;
}
