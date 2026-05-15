import { BookmarkIcon as BookmarkIconOutline } from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkIconSolid } from "@heroicons/react/24/solid";
import React from "react";
import { Link } from "react-router";

import { ConferenceManifest } from "@/lib/conferences";
import { useBookmarks } from "@/lib/hooks/useBookmarks";
import { getToneFromColor } from "@/lib/tone";

import type { ScheduleEventViewModel } from "./ScheduleEvents";

type Props = {
  conf: ConferenceManifest;
  event: ScheduleEventViewModel;
  isBookmarked: boolean;
  nowSeconds: number;
};

const ScheduleEventItem = React.memo(function ScheduleEventItem({
  conf,
  event,
  isBookmarked,
  nowSeconds,
}: Props) {
  const [bookmark, toggleBookmark] = useBookmarks(event.id, isBookmarked);

  const href = `/${conf.slug}/content/?id=${event.contentId}`;
  const eventTone = getToneFromColor(event.color);

  const handleBookmarkClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    toggleBookmark();
  };

  const isLive =
    event.beginTimestampSeconds <= nowSeconds && nowSeconds < event.endTimestampSeconds;
  const isNext =
    !isLive &&
    event.beginTimestampSeconds > nowSeconds &&
    event.beginTimestampSeconds - nowSeconds <= 30 * 60;
  const bookmarkLabel = bookmark
    ? `Remove bookmark for ${event.title}`
    : `Add bookmark for ${event.title}`;
  const visibleTags = event.tags.slice(0, 4);
  const hiddenTagCount = event.tags.length - visibleTags.length;

  return (
    <article className={`ui-card ui-card-interactive ui-accent-card ui-tone-${eventTone}`}>
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

        <button
          type="button"
          onClick={handleBookmarkClick}
          aria-label={bookmarkLabel}
          aria-pressed={bookmark}
          className="ui-icon-plain"
        >
          {bookmark ? (
            <BookmarkIconSolid className="ui-icon-sm" aria-hidden="true" />
          ) : (
            <BookmarkIconOutline className="ui-icon-sm" aria-hidden="true" />
          )}
        </button>
      </div>
    </article>
  );
});

ScheduleEventItem.displayName = "ScheduleEventItem";

export default ScheduleEventItem;
