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
  const bookmarkLabel = bookmark
    ? `Remove bookmark for ${session.title}`
    : `Add bookmark for ${session.title}`;

  return (
    <li
      className="ui-card ui-card-interactive group relative overflow-hidden p-3 sm:p-4"
      style={
        {
          "--event-color": session.color ?? "#9ca3af",
        } as CSSProperties
      }
    >
      {/* Accent bar: matches list row style, full height of the card */}
      <span
        aria-hidden="true"
        className="ui-accent-rail"
      />
      <span
        aria-hidden="true"
        className="ui-accent-rail-overlay"
      />

      <div className="relative z-10 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Left: time + location */}
        <div className="min-w-0 pl-4">
          <div className="text-sm font-medium text-slate-100 sm:text-base">{timeLabel}</div>
          {locationName && (
            <div className="mt-1 flex min-w-0 items-center gap-2 text-sm text-slate-400">
              <MapPinIcon className="h-5 w-5 shrink-0" aria-hidden="true" />
              <span className="truncate">{locationName}</span>
            </div>
          )}
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-2 pl-4 md:gap-3 md:pl-0">
          <a
            href={icsHref}
            download={`DEF_CON_${content.id}-${session.id}.ics`}
            title={`Download calendar invite for session: ${content.title}`}
            aria-label={`Download calendar invite for session: ${content.title}`}
            className="ui-icon-btn ui-focus-ring h-11 w-11 border-transparent bg-transparent text-slate-400 hover:text-white focus-visible:outline-none"
          >
            <CalendarIcon className="h-6 w-6" aria-hidden="true" />
          </a>

          <button
            type="button"
            onClick={handleBookmarkClick}
            aria-label={bookmarkLabel}
            aria-pressed={bookmark}
            className="ui-icon-btn ui-focus-ring h-11 w-11 border-transparent bg-transparent text-slate-500 hover:text-[#6CCDBB] focus-visible:outline-none"
          >
            {bookmark ? (
              <BookmarkIconSolid className="h-5 w-5 text-[#6CCDBB]" aria-hidden="true" />
            ) : (
              <BookmarkIconOutline className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    </li>
  );
}
