import {
  BookmarkIcon as BookmarkIconOutline,
  CalendarIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkIconSolid } from "@heroicons/react/24/solid";
import { useMemo, type MouseEvent } from "react";
import { Link } from "react-router";

import type { ConferenceManifest } from "@/lib/conferences";
import type { DetailSessionView } from "@/lib/types/ht-types";

import { addSessionToCalendar } from "@/lib/cal";
import { getAccentStyle } from "@/lib/color";
import { sessionTime, formatSessionTime } from "@/lib/dates";
import { useBookmarks } from "@/lib/hooks/useBookmarks";
import { useTransientStatus } from "@/lib/hooks/useTransientStatus";

export type ContentSessionProps = {
  conference: ConferenceManifest;
  session: DetailSessionView;
  isBookmarked: boolean;
  accentColor?: string;
  calendarDescription?: string;
  calendarTitle?: string;
  href?: string;
  title?: string;
};

function ContentSessionCard({
  conference,
  session,
  isBookmarked,
  accentColor,
  calendarDescription,
  calendarTitle,
  href,
  title,
}: ContentSessionProps) {
  const [bookmark, toggleBookmark] = useBookmarks(session.id, isBookmarked);
  const actionStatusId = `content-session-action-status-${session.id}`;
  const [actionStatus, setActionStatus] = useTransientStatus();

  const begin = useMemo(() => new Date(session.begin), [session.begin]);
  const end = useMemo(() => new Date(session.end), [session.end]);
  const sameTime = session.end === session.begin;

  const timeLabel = sameTime
    ? sessionTime(begin, true, conference.timezone)
    : formatSessionTime(begin, end, conference.timezone);

  const handleBookmarkClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const nextBookmarked = !bookmark;
    toggleBookmark();
    setActionStatus(nextBookmarked ? "Bookmark added." : "Bookmark removed.");
  };

  const handleCalendarClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    addSessionToCalendar(
      conference.slug,
      {
        description: calendarDescription,
        id: session.contentId,
        title: calendarTitle ?? session.title,
      },
      session,
      session.locationName,
      `DEF_CON_${session.contentId}-${session.id}.ics`,
      setActionStatus,
    );
  };
  const bookmarkLabel = bookmark
    ? `Remove bookmark for ${session.title}`
    : `Add bookmark for ${session.title}`;
  const accentStyle = getAccentStyle(accentColor);
  const titleLabel = title?.trim() || null;

  const sessionContent = (
    <div className="ui-item-main ui-item-copy-compact">
      {titleLabel ? (
        <p className="ui-card-title ui-accent-card-title-md ui-clamp-two">{titleLabel}</p>
      ) : null}
      <p className="ui-session-time-primary">{timeLabel}</p>
      {session.locationName ? (
        <div className="ui-card-meta ui-content-session-location">
          <MapPinIcon className="ui-icon-xs" aria-hidden="true" />
          <span className="ui-clip-text">{session.locationName}</span>
        </div>
      ) : null}
    </div>
  );

  return (
    <li
      style={accentStyle}
      className="ui-card ui-card-interactive ui-accent-card ui-content-session-card"
    >
      <span aria-hidden="true" className="ui-accent-rail" />
      <span aria-hidden="true" className="ui-accent-rail-overlay" />

      <div className="ui-content-session-row">
        {href ? (
          <Link to={href} className="ui-focus-ring ui-radius-inherit ui-item-main">
            {sessionContent}
          </Link>
        ) : (
          sessionContent
        )}

        <div className="ui-content-session-actions">
          <button
            type="button"
            title={`Add to calendar for ${calendarTitle ?? session.title}`}
            aria-label={`Add to calendar for ${calendarTitle ?? session.title}`}
            aria-describedby={actionStatus ? actionStatusId : undefined}
            onClick={handleCalendarClick}
            className="ui-icon-plain"
          >
            <CalendarIcon className="ui-icon-sm" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={handleBookmarkClick}
            aria-label={bookmarkLabel}
            aria-pressed={bookmark}
            aria-describedby={actionStatus ? actionStatusId : undefined}
            className="ui-icon-plain"
          >
            {bookmark ? (
              <BookmarkIconSolid className="ui-icon-sm" aria-hidden="true" />
            ) : (
              <BookmarkIconOutline className="ui-icon-sm" aria-hidden="true" />
            )}
          </button>
          {actionStatus ? (
            <span id={actionStatusId} role="status" className="ui-action-status">
              {actionStatus}
            </span>
          ) : null}
        </div>
      </div>
    </li>
  );
}

export default ContentSessionCard;
