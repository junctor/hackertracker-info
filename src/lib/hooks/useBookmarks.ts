import { useCallback, useState } from "react";

import { addBookmark, removeBookmark } from "@/lib/storage";

export function useBookmarks(eventId: number, initial: boolean) {
  const [bookmarked, setBookmarked] = useState<boolean>(initial);
  const toggle = useCallback(() => {
    setBookmarked((prev) => {
      const next = !prev;
      if (next) {
        addBookmark(eventId);
      } else {
        removeBookmark(eventId);
      }
      return next;
    });
  }, [eventId]);
  return [bookmarked, toggle] as const;
}
