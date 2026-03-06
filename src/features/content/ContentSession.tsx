import {
  BookmarkIcon as BookmarkIconOutline,
  CalendarIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkIconSolid } from "@heroicons/react/24/solid";
import { useMemo, type CSSProperties, type MouseEvent } from "react";

import type { ContentEntity, EventEntity } from "@/lib/types/ht-types";

import cal from "@/lib/cal";
import { eventTime, formatSessionTime } from "@/lib/dates";
import { useBookmarks } from "@/lib/hooks/useBookmarks";

export default function ContentSession({
  conferenceSlug,
  session,
  content,
  isBookmarked,
  locationName,
  timezone,
}: {
  conferenceSlug: string;
  session: EventEntity;
  content: ContentEntity;
  isBookmarked: boolean;
  locationName?: string;
  timezone: string;
}) {
  const [bookmark, toggleBookmark] = useBookmarks(session.id, isBookmarked);

  const begin = useMemo(() => new Date(session.begin), [session.begin]);
  const end = useMemo(() => new Date(session.end), [session.end]);
  const sameTime = session.end === session.begin;

  const timeLabel = sameTime
    ? eventTime(begin, true, timezone)
    : formatSessionTime(begin, end, timezone);

  const icsHref = useMemo(() => {
    const ics = cal(conferenceSlug, content, session, locationName);
    return `data:text/calendar;charset=utf8,${encodeURIComponent(ics)}`;
  }, [conferenceSlug, content, session, locationName]);

  const handleBookmarkClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    toggleBookmark();
  };

  return (
    <li
      className="group relative overflow-hidden rounded-lg border border-gray-800 bg-gray-900/40 px-4 py-3 transition-colors focus-within:border-indigo-500/70 hover:border-gray-700 hover:bg-gray-900"
      style={
        {
          "--event-color": session.color ?? "#9ca3af",
        } as CSSProperties
      }
    >
      {/* Accent bar: matches list row style, full height of the card */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-0 bottom-0 left-0 w-[clamp(0.3rem,2vw,0.9rem)] bg-(--event-color) transition-[width] duration-200 group-hover:w-[clamp(0.4rem,3vw,1.1rem)]"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-0 bottom-0 left-0 w-[clamp(0.3rem,2vw,0.9rem)] bg-linear-to-b from-white/0 to-indigo-600/20 opacity-60 mix-blend-multiply transition-[width] duration-200 group-hover:w-[clamp(0.4rem,3vw,1.1rem)]"
      />

      <div className="relative z-10 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Left: time + location */}
        <div className="min-w-0 pl-5">
          <div className="text-base font-medium text-gray-100">{timeLabel}</div>
          {locationName && (
            <div className="mt-1 flex min-w-0 items-center gap-2 text-sm text-gray-400">
              <MapPinIcon className="h-5 w-5 shrink-0" aria-hidden="true" />
              <span className="truncate">{locationName}</span>
            </div>
          )}
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-3 md:gap-4">
          <a
            href={icsHref}
            download={`DEF_CON_${content.id}-${session.id}.ics`}
            title={`Download calendar invite for session: ${content.title}`}
            aria-label={`Download calendar invite for session: ${content.title}`}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-400 transition hover:text-gray-100 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 focus-visible:outline-none"
          >
            <CalendarIcon className="h-6 w-6" aria-hidden="true" />
          </a>

          <button
            type="button"
            onClick={handleBookmarkClick}
            aria-label={bookmark ? "Remove bookmark" : "Add bookmark"}
            aria-pressed={bookmark}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-500 transition hover:text-indigo-300 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 focus-visible:outline-none"
          >
            {bookmark ? (
              <BookmarkIconSolid className="h-5 w-5 text-indigo-400" aria-hidden="true" />
            ) : (
              <BookmarkIconOutline className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    </li>
  );
}
