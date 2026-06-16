import { BookmarkIcon as BookmarkIconOutline, CalendarIcon } from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkIconSolid } from "@heroicons/react/24/solid";
import React, { useMemo } from "react";
import { Link } from "react-router";

import cal, { encodeICalDataUri } from "@/lib/cal";
import { ConferenceManifest } from "@/lib/conferences";
import { useBookmarks } from "@/lib/hooks/useBookmarks";
import { useTransientStatus } from "@/lib/hooks/useTransientStatus";
import { getToneFromColor } from "@/lib/tone";

import type { ScheduleEventViewModel } from "./ScheduleEvents";

import { isScheduleEventLive, isScheduleEventStartingSoon } from "./scheduleTime";

type Props = {
  conf: ConferenceManifest;
  event: ScheduleEventViewModel;
  isBookmarked: boolean;
  nowSeconds: number;
  isHighlighted?: boolean;
};

function stopCalendarClickPropagation(e: React.MouseEvent<HTMLAnchorElement>) {
  e.stopPropagation();
}

const ScheduleEventItem = React.memo(function ScheduleEventItem({
  conf,
  event,
  isBookmarked,
  nowSeconds,
  isHighlighted = false,
}: Props) {
  const [bookmark, toggleBookmark] = useBookmarks(event.id, isBookmarked);
  const actionStatusId = `schedule-event-action-status-${event.id}`;
  const [actionStatus, setActionStatus] = useTransientStatus();

  const href = `/${conf.slug}/content/?id=${event.contentId}`;
  const eventTone = getToneFromColor(event.color);

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
    if (!event.contentEntity) return null;
    return { ...event.contentEntity, title: event.title };
  }, [event.contentEntity, event.title]);

  const icsHref = useMemo(() => {
    if (!calendarContent) return null;
    const ics = cal(conf.slug, calendarContent, event.session, event.locationName);
    return encodeICalDataUri(ics);
  }, [calendarContent, conf.slug, event.locationName, event.session]);

  const isLive = isScheduleEventLive(event, nowSeconds);
  const isNext = isScheduleEventStartingSoon(event, nowSeconds);
  const bookmarkLabel = bookmark
    ? `Remove bookmark for ${event.title}`
    : `Add bookmark for ${event.title}`;
  const visibleTags = event.tags.slice(0, 4);
  const hiddenTagCount = event.tags.length - visibleTags.length;

  return (
    <article
      data-schedule-event-id={event.id}
      className={`ui-card ui-card-interactive ui-accent-card ui-tone-${eventTone}${isHighlighted ? " ui-schedule-event-jump-highlight" : ""}`}
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
              <p className="ui-event-time-primary">
                <time dateTime={event.beginIso}>{event.beginDisplay}</time>
              </p>
              <p className="ui-card-meta">
                <time dateTime={event.endIso}>{event.endDisplay}</time>
              </p>
            </div>

            <div className="ui-accent-card-main">
              <h3 className="ui-card-title ui-accent-card-title-lg ui-clamp-two">{event.title}</h3>

              {event.speakers && (
                <p className="ui-card-meta ui-clamp-two">
                  <em>{event.speakers}</em>
                </p>
              )}

              <p className="ui-card-meta ui-clamp-one">{event.locationName}</p>

              {visibleTags.length > 0 && (
                <ul className="ui-chip-list-tight">
                  {visibleTags.map((tag) => (
                    <li
                      key={tag.id}
                      className={`ui-tag-chip ui-tag-chip-strong ui-tone-${getToneFromColor(tag.colorBackground)}`}
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
              download={`DEF_CON_${event.contentId}-${event.id}.ics`}
              title={`Download calendar invite for ${event.title}`}
              aria-label={`Download calendar invite for ${event.title}`}
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

ScheduleEventItem.displayName = "ScheduleEventItem";

export default ScheduleEventItem;
