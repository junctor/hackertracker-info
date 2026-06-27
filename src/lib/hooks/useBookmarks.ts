import { useCallback, useEffect, useState } from "react";

import { addBookmark, getBookmarks, removeBookmark } from "@/lib/storage";

export function useBookmarks(sessionId: number, initial: boolean) {
  const [bookmarked, setBookmarked] = useState<boolean>(() =>
    typeof window === "undefined" ? initial : getBookmarks().includes(sessionId),
  );

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const syncBookmark = () => {
      setBookmarked(getBookmarks().includes(sessionId));
    };

    syncBookmark();
    window.addEventListener("storage", syncBookmark);
    window.addEventListener("bookmarks:changed", syncBookmark);

    return () => {
      window.removeEventListener("storage", syncBookmark);
      window.removeEventListener("bookmarks:changed", syncBookmark);
    };
  }, [sessionId]);

  const toggle = useCallback(() => {
    if (bookmarked) {
      removeBookmark(sessionId);
    } else {
      addBookmark(sessionId);
    }
    setBookmarked(getBookmarks().includes(sessionId));
  }, [bookmarked, sessionId]);
  return [bookmarked, toggle] as const;
}
