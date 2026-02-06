import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BookmarkIcon as BookmarkIconOutline } from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkIconSolid } from "@heroicons/react/24/solid";
import { addBookmark, getBookmarks, removeBookmark } from "@/lib/storage";
import type { ScheduleEventViewModel } from "./ScheduleEvents";
import { ConferenceManifest } from "@/lib/conferences";

const ScheduleEventItem = React.memo(function ScheduleEventItem({
  conf,
  event,
  isBookmarked,
}: {
  conf: ConferenceManifest;
  event: ScheduleEventViewModel;
  isBookmarked: boolean;
}) {
  const [bookmark, setBookmark] = useState(() => {
    if (typeof window === "undefined") return isBookmarked;
    return getBookmarks().includes(event.id);
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = getBookmarks().includes(event.id);
    setBookmark((prev) => (prev === stored ? prev : stored));
  }, [event.id, isBookmarked]);

  const href = useMemo(
    () => `/${conf.slug}/content/?id=${event.contentId}`,
    [conf.slug, event.contentId],
  );

  const barStyle = useMemo(
    () => ({ "--event-color": event.color ?? "#fff" }) as React.CSSProperties,
    [event.color],
  );

  const tagPills = useMemo(
    () =>
      event.tags.map((tag) => ({
        id: tag.id,
        label: tag.label,
        style: {
          backgroundColor: tag.colorBackground,
          color: tag.colorForeground ?? "#fff",
        } as React.CSSProperties,
      })),
    [event.tags],
  );

  const toggleBookmark = useCallback(() => {
    setBookmark((prev) => {
      const next = !prev;
      if (next) {
        addBookmark(event.id);
      } else {
        removeBookmark(event.id);
      }
      return next;
    });
  }, [event.id]);

  const handleBookmarkClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      toggleBookmark();
    },
    [toggleBookmark],
  );

  return (
    <article
      style={barStyle}
      className="group relative flex w-full flex-col gap-4 rounded-lg border border-gray-800 bg-gray-900/40 px-4 py-3 transition hover:border-gray-700 hover:bg-gray-900 focus-within:outline-2 focus-within:outline-indigo-500 focus-within:outline-offset-2 before:absolute before:top-3 before:bottom-3 before:left-3 before:w-[clamp(0.25rem,2vw,1rem)] before:rounded before:bg-(--event-color) before:transition-all before:duration-200 group-hover:before:w-[clamp(0.4rem,3vw,1.2rem)]"
    >
      <Link
        href={href}
        className="flex w-full flex-col gap-3 md:flex-row md:items-start md:justify-between pr-10"
      >
        <div className="min-w-0 md:w-48">
          <p className="text-base font-semibold text-gray-100">
            <time dateTime={event.beginIso}>{event.beginDisplay}</time>
          </p>
          <p className="text-sm text-gray-400">
            <time dateTime={event.endIso}>{event.endDisplay}</time>
          </p>
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-xl font-bold text-gray-100 line-clamp-2">
            {event.title}
          </h3>
          {event.speakers && (
            <p className="italic mt-1 text-gray-300">{event.speakers}</p>
          )}
          <p className="mt-1 text-gray-300">{event.locationName}</p>
          <div className="mt-2 flex flex-wrap gap-1 uppercase text-sm">
            {tagPills.map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
                style={tag.style}
              >
                {tag.label}
              </span>
            ))}
          </div>
        </div>
      </Link>

      <button
        onClick={handleBookmarkClick}
        aria-label={bookmark ? "Remove bookmark" : "Add bookmark"}
        aria-pressed={bookmark}
        className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition hover:text-indigo-300 focus-visible:ring-2 focus-visible:ring-indigo-500"
      >
        {bookmark ? (
          <BookmarkIconSolid className="h-5 w-5 text-indigo-400" />
        ) : (
          <BookmarkIconOutline className="h-5 w-5" />
        )}
      </button>
    </article>
  );
});

ScheduleEventItem.displayName = "ScheduleEventItem";

export default ScheduleEventItem;
