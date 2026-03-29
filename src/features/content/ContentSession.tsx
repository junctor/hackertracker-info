import {
  BookmarkIcon as BookmarkIconOutline,
  CalendarIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkIconSolid } from "@heroicons/react/24/solid";
import Link from "next/link";
import { useMemo, type CSSProperties, type MouseEvent } from "react";

import type { ConferenceManifest } from "@/lib/conferences";
import type { ContentEntity, EventEntity } from "@/lib/types/ht-types";

import cal from "@/lib/cal";
import { eventTime, formatSessionTime } from "@/lib/dates";
import { useBookmarks } from "@/lib/hooks/useBookmarks";

export type ContentSessionProps = {
  conference: ConferenceManifest;
  session: EventEntity;
  contentEntity: ContentEntity;
  isBookmarked: boolean;
  locationName?: string;
  href?: string;
  title?: string;
};

function ContentSessionCard({
  conference,
  session,
  contentEntity,
  isBookmarked,
  locationName,
  href,
  title,
}: ContentSessionProps) {
  const [bookmark, toggleBookmark] = useBookmarks(session.id, isBookmarked);

  const begin = useMemo(() => new Date(session.begin), [session.begin]);
  const end = useMemo(() => new Date(session.end), [session.end]);
  const sameTime = session.end === session.begin;

  const timeLabel = sameTime
    ? eventTime(begin, true, conference.timezone)
    : formatSessionTime(begin, end, conference.timezone);

  const icsHref = useMemo(() => {
    const ics = cal(conference.slug, contentEntity, session, locationName);
    return `data:text/calendar;charset=utf8,${encodeURIComponent(ics)}`;
  }, [conference.slug, contentEntity, session, locationName]);

  const handleBookmarkClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    toggleBookmark();
  };
  const bookmarkLabel = bookmark
    ? `Remove bookmark for ${session.title}`
    : `Add bookmark for ${session.title}`;
  const accentStyle = {
    "--event-color": session.color ?? "#64748b",
  } as CSSProperties;
  const titleLabel = title?.trim() || null;

  const sessionContent = (
    <div className="min-w-0 flex-1 space-y-1.5">
      {titleLabel ? (
        <p className="line-clamp-2 text-base leading-6 font-semibold tracking-[-0.01em] text-slate-100 transition-colors group-hover:text-white sm:text-lg">
          {titleLabel}
        </p>
      ) : null}
      <p className="text-sm font-semibold text-slate-100 sm:text-base">{timeLabel}</p>
      {locationName ? (
        <div className="flex min-w-0 items-center gap-2 text-sm text-slate-400">
          <MapPinIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="truncate">{locationName}</span>
        </div>
      ) : null}
    </div>
  );

  return (
    <li className="ui-card ui-card-interactive group relative overflow-hidden" style={accentStyle}>
      <span aria-hidden="true" className="ui-accent-rail" />
      <span aria-hidden="true" className="ui-accent-rail-overlay" />

      <div className="relative z-10 flex flex-col gap-4 px-4 py-4 pl-5 sm:px-5 sm:py-5 sm:pl-6 md:flex-row md:items-start md:justify-between">
        {href ? (
          <Link
            href={href}
            className="ui-focus-ring min-w-0 flex-1 rounded-[inherit] focus-visible:outline-none"
          >
            {sessionContent}
          </Link>
        ) : (
          sessionContent
        )}

        <div className="flex shrink-0 items-center gap-2 md:self-start">
          <a
            href={icsHref}
            download={`DEF_CON_${contentEntity.id}-${session.id}.ics`}
            title={`Download calendar invite for session: ${contentEntity.title}`}
            aria-label={`Download calendar invite for session: ${contentEntity.title}`}
            className="ui-icon-btn ui-focus-ring h-11 w-11 focus-visible:outline-none"
          >
            <CalendarIcon className="h-5 w-5" aria-hidden="true" />
          </a>

          <button
            type="button"
            onClick={handleBookmarkClick}
            aria-label={bookmarkLabel}
            aria-pressed={bookmark}
            className="ui-icon-btn ui-focus-ring h-11 w-11 focus-visible:outline-none"
          >
            {bookmark ? (
              <BookmarkIconSolid className="h-5 w-5" aria-hidden="true" />
            ) : (
              <BookmarkIconOutline className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    </li>
  );
}

export default ContentSessionCard;
