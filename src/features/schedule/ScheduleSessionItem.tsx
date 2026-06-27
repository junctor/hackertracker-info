import { BookmarkIcon as BookmarkIconOutline, CalendarIcon } from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkIconSolid } from "@heroicons/react/24/solid";
import React, { useMemo } from "react";
import { Link } from "react-router";

import cal, { encodeICalDataUri } from "@/lib/cal";
import { getAccentStyle } from "@/lib/color";
import { ConferenceManifest } from "@/lib/conferences";
import { useBookmarks } from "@/lib/hooks/useBookmarks";
import { useTransientStatus } from "@/lib/hooks/useTransientStatus";

import type { ScheduleSessionViewModel } from "./ScheduleSessions";

import { isScheduleSessionLive, isScheduleSessionStartingSoon } from "./scheduleTime";

type Props = {
  conf: ConferenceManifest;
  session: ScheduleSessionViewModel;
  isBookmarked: boolean;
  nowSeconds: number;
  isHighlighted?: boolean;
};

function stopCalendarClickPropagation(e: React.MouseEvent<HTMLAnchorElement>) {
  e.stopPropagation();
}

const ScheduleSessionItem = React.memo(function ScheduleSessionItem({
  conf,
  session,
  isBookmarked,
  nowSeconds,
  isHighlighted = false,
}: Props) {
  const [bookmark, toggleBookmark] = useBookmarks(session.id, isBookmarked);
  const actionStatusId = `schedule-session-action-status-${session.id}`;
  const [actionStatus, setActionStatus] = useTransientStatus();

  const href = `/${conf.slug}/content/?id=${session.contentId}`;
  const accentStyle = getAccentStyle(session.color);

  const handleBookmarkClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const nextBookmarked = !bookmark;
    toggleBookmark();
    setActionStatus(nextBookmarked ? "Bookmark added." : "Bookmark removed.");
  };

  const handleCalendarClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    stopCalendarClickPropagation(e);
    setActionStatus("Calendar download started.");
  };

  const calendarContent = useMemo(() => {
    if (!session.contentEntity) return null;
    return { ...session.contentEntity, title: session.title };
  }, [session.contentEntity, session.title]);

  const icsHref = useMemo(() => {
    if (!calendarContent) return null;
    const ics = cal(conf.slug, calendarContent, session.session, session.locationName);
    return encodeICalDataUri(ics);
  }, [calendarContent, conf.slug, session.locationName, session.session]);

  const isLive = isScheduleSessionLive(session, nowSeconds);
  const isNext = isScheduleSessionStartingSoon(session, nowSeconds);
  const bookmarkLabel = bookmark
    ? `Remove bookmark for ${session.title}`
    : `Add bookmark for ${session.title}`;
  const visibleTags = session.tags.slice(0, 4);
  const hiddenTagCount = session.tags.length - visibleTags.length;

  return (
    <article
      data-schedule-session-id={session.id}
      style={accentStyle}
      className={`ui-card ui-card-interactive ui-accent-card${isHighlighted ? " ui-schedule-session-jump-highlight" : ""}`}
    >
      <span aria-hidden="true" className="ui-accent-rail" />
      <span aria-hidden="true" className="ui-accent-rail-overlay" />

      <div className="ui-accent-card-row">
        <Link to={href} className="ui-focus-ring ui-radius-inherit ui-item-main">
          <div className="ui-accent-card-layout">
            <div className="ui-accent-card-time">
              {(isLive || isNext) && (
                <span
                  className={`ui-status-pill ${isLive ? "ui-status-pill-live" : "ui-status-pill-next"}`}
                >
                  {isLive ? "Live" : "Next"}
                </span>
              )}
              <p className="ui-session-time-primary">
                <time dateTime={session.beginIso}>{session.beginDisplay}</time>
              </p>
              <p className="ui-card-meta">
                <time dateTime={session.endIso}>{session.endDisplay}</time>
              </p>
            </div>

            <div className="ui-accent-card-main">
              <h3 className="ui-card-title ui-accent-card-title-lg ui-clamp-two">
                {session.title}
              </h3>

              {session.speakers && (
                <p className="ui-card-meta ui-clamp-two">
                  <em>{session.speakers}</em>
                </p>
              )}

              <p className="ui-card-meta ui-clamp-one">{session.locationName}</p>

              {visibleTags.length > 0 && (
                <ul className="ui-chip-list-tight">
                  {visibleTags.map((tag) => (
                    <li
                      key={tag.id}
                      className={`ui-tag-chip ui-tag-chip-strong`}
                      style={{ backgroundColor: tag.colorBackground, color: tag.colorForeground }}
                    >
                      {tag.label}
                    </li>
                  ))}
                  {hiddenTagCount > 0 && (
                    <li className="ui-tag-chip ui-tone-muted">+{hiddenTagCount} more</li>
                  )}
                </ul>
              )}
            </div>
          </div>
        </Link>

        <div className="ui-schedule-card-actions">
          {icsHref ? (
            <a
              href={icsHref}
              download={`DEF_CON_${session.contentId}-${session.id}.ics`}
              title={`Download calendar invite for ${session.title}`}
              aria-label={`Download calendar invite for ${session.title}`}
              aria-describedby={actionStatus ? actionStatusId : undefined}
              onClick={handleCalendarClick}
              className="ui-icon-plain"
            >
              <CalendarIcon className="ui-icon-sm" aria-hidden="true" />
            </a>
          ) : null}

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
    </article>
  );
});

ScheduleSessionItem.displayName = "ScheduleSessionItem";

export default ScheduleSessionItem;
