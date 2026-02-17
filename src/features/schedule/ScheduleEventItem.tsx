import React, { useState } from "react";
import Link from "next/link";
import { BookmarkIcon as BookmarkIconOutline } from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkIconSolid } from "@heroicons/react/24/solid";
import { addBookmark, getBookmarks, removeBookmark } from "@/lib/storage";
import type { ScheduleEventViewModel } from "./ScheduleEvents";
import { ConferenceManifest } from "@/lib/conferences";

type Props = {
  conf: ConferenceManifest;
  event: ScheduleEventViewModel;
  isBookmarked: boolean;
};

const ScheduleEventItem = React.memo(function ScheduleEventItem({
  conf,
  event,
  isBookmarked,
}: Props) {
  const [bookmark, setBookmark] = useState<boolean>(() => {
    if (typeof window === "undefined") return isBookmarked;
    return getBookmarks().includes(event.id);
  });

  const href = `/${conf.slug}/content/?id=${event.contentId}`;
  const barStyle = {
    "--event-color": event.color ?? "#fff",
  } as React.CSSProperties;

  const toggleBookmark = () => {
    setBookmark((prev) => {
      const next = !prev;
      if (next) addBookmark(event.id);
      else removeBookmark(event.id);
      return next;
    });
  };

  const handleBookmarkClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    toggleBookmark();
  };

  return (
    <article
      style={barStyle}
      className="
        group relative overflow-hidden
        flex w-full flex-col gap-4
        rounded-lg border border-gray-800 bg-gray-900/40
        pl-4 pr-4 py-3
        transition-colors
        hover:border-gray-700 hover:bg-gray-900
        focus-within:border-indigo-500/70
      "
    >
      <span
        aria-hidden="true"
        className="
          pointer-events-none absolute left-0 top-0 bottom-0
          w-[clamp(0.3rem,2vw,0.9rem)]
          bg-(--event-color)
          transition-[width] duration-200
          group-hover:w-[clamp(0.4rem,3vw,1.1rem)]
        "
      />

      <span
        aria-hidden="true"
        className="
          pointer-events-none absolute left-0 top-0 bottom-0
          w-[clamp(0.3rem,2vw,0.9rem)]
          bg-linear-to-b from-white/0 to-indigo-600/20
          mix-blend-multiply opacity-60
          transition-[width] duration-200
          group-hover:w-[clamp(0.4rem,3vw,1.1rem)]
        "
      />

      <Link
        href={href}
        className="
        relative z-10
        flex w-full flex-col gap-3 rounded-md pr-10
        pl-5
        md:flex-row md:items-start md:justify-between
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500
        focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900
      "
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
            <p className="mt-1 italic text-gray-300">{event.speakers}</p>
          )}

          <p className="mt-1 text-gray-300">{event.locationName}</p>

          <ul className="mt-2 flex flex-wrap gap-1 list-none p-0 m-0 uppercase text-sm">
            {event.tags.map((tag) => (
              <li
                key={tag.id}
                className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
                style={{
                  backgroundColor: tag.colorBackground,
                  color: tag.colorForeground ?? "#fff",
                }}
              >
                {tag.label}
              </li>
            ))}
          </ul>
        </div>
      </Link>

      <button
        type="button"
        onClick={handleBookmarkClick}
        aria-label={bookmark ? "Remove bookmark" : "Add bookmark"}
        aria-pressed={bookmark}
        className="
          absolute right-3 top-3 z-10
          inline-flex h-8 w-8 items-center justify-center
          rounded-md text-gray-500 transition
          hover:text-indigo-300
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500
          focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900
        "
      >
        {bookmark ? (
          <BookmarkIconSolid
            className="h-5 w-5 text-indigo-400"
            aria-hidden="true"
          />
        ) : (
          <BookmarkIconOutline className="h-5 w-5" aria-hidden="true" />
        )}
      </button>
    </article>
  );
});

ScheduleEventItem.displayName = "ScheduleEventItem";

export default ScheduleEventItem;
