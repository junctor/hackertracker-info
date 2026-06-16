import {
  BookmarkIcon as BookmarkIconOutline,
  CalendarIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkIconSolid } from "@heroicons/react/24/solid";
import { useMemo, type MouseEvent } from "react";
import { Link } from "react-router";

import type { ConferenceManifest } from "@/lib/conferences";
import type { ContentEntity, EventEntity } from "@/lib/types/ht-types";

import cal, { encodeICalDataUri } from "@/lib/cal";
import { eventTime, formatSessionTime } from "@/lib/dates";
import { useBookmarks } from "@/lib/hooks/useBookmarks";
import { useTransientStatus } from "@/lib/hooks/useTransientStatus";
import { getToneFromColor } from "@/lib/tone";

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
  const actionStatusId = `content-session-action-status-${session.id}`;
  const [actionStatus, setActionStatus] = useTransientStatus();

  const begin = useMemo(() => new Date(session.begin), [session.begin]);
  const end = useMemo(() => new Date(session.end), [session.end]);
  const sameTime = session.end === session.begin;

  const timeLabel = sameTime
    ? eventTime(begin, true, conference.timezone)
    : formatSessionTime(begin, end, conference.timezone);

  const icsHref = useMemo(() => {
    const ics = cal(conference.slug, contentEntity, session, locationName);
    return encodeICalDataUri(ics);
  }, [conference.slug, contentEntity, session, locationName]);

  const handleBookmarkClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const nextBookmarked = !bookmark;
    toggleBookmark();
    setActionStatus(nextBookmarked ? "Bookmark added." : "Bookmark removed.");
  };

  const handleCalendarClick = () => {
    setActionStatus("Calendar download started.");
  };
  const bookmarkLabel = bookmark
    ? `Remove bookmark for ${session.title}`
    : `Add bookmark for ${session.title}`;
  const accentTone = getToneFromColor(session.color);
  const titleLabel = title?.trim() || null;

  const sessionContent = (
    <div className="ui-item-main ui-item-copy-compact">
      {titleLabel ? (
        <p className="ui-card-title ui-accent-card-title-md ui-clamp-two">{titleLabel}</p>
      ) : null}
      <p className="ui-event-time-primary">{timeLabel}</p>
      {locationName ? (
        <div className="ui-card-meta ui-content-session-location">
          <MapPinIcon className="ui-icon-xs" aria-hidden="true" />
          <span className="ui-clip-text">{locationName}</span>
        </div>
      ) : null}
    </div>
  );

  return (
    <li
      className={`ui-card ui-card-interactive ui-accent-card ui-content-session-card ui-tone-${accentTone}`}
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
          <a
            href={icsHref}
            download={`DEF_CON_${contentEntity.id}-${session.id}.ics`}
            title={`Download calendar invite for ${contentEntity.title}`}
            aria-label={`Download calendar invite for ${contentEntity.title}`}
            aria-describedby={actionStatus ? actionStatusId : undefined}
            onClick={handleCalendarClick}
            className="ui-icon-plain"
          >
            <CalendarIcon className="ui-icon-sm" aria-hidden="true" />
          </a>

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
