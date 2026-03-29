import { BookmarkIcon as BookmarkIconOutline } from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkIconSolid } from "@heroicons/react/24/solid";
import Link from "next/link";
import React from "react";

import { ConferenceManifest } from "@/lib/conferences";
import { useBookmarks } from "@/lib/hooks/useBookmarks";

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
  const barStyle = {
    "--event-color": event.color ?? "#64748b",
  } as React.CSSProperties;

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
    <article
      style={barStyle}
      className="ui-card ui-card-interactive group relative w-full min-w-0 overflow-hidden"
    >
      <span aria-hidden="true" className="ui-accent-rail" />
      <span aria-hidden="true" className="ui-accent-rail-overlay" />

      <div className="relative z-10 flex items-start gap-3 px-4 py-4 pl-5 sm:px-5 sm:py-5 sm:pl-6">
        <Link
          href={href}
          className="ui-focus-ring min-w-0 flex-1 rounded-[inherit] focus-visible:outline-none"
        >
          <div className="flex min-w-0 flex-col gap-4 md:flex-row md:items-start md:gap-5">
            <div className="min-w-0 space-y-1.5 md:w-44 md:shrink-0">
              {(isLive || isNext) && (
                <span
                  className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-[0.08em] uppercase ${
                    isLive
                      ? "border-[#E0004E] bg-[#E0004E]/16 text-[#ffb4c9]"
                      : "border-[#F1B435]/75 bg-[#F1B435]/16 text-[#F1B435]"
                  }`}
                >
                  {isLive ? "Live" : "Next"}
                </span>
              )}
              <p className="text-sm font-semibold text-slate-100 sm:text-base">
                <time dateTime={event.beginIso}>{event.beginDisplay}</time>
              </p>
              <p className="text-sm text-slate-300/85">
                <time dateTime={event.endIso}>{event.endDisplay}</time>
              </p>
            </div>

            <div className="min-w-0 flex-1 space-y-2">
              <h3 className="line-clamp-2 text-lg leading-7 font-semibold text-slate-100 transition-colors group-hover:text-white sm:text-xl">
                {event.title}
              </h3>

              {event.speakers && (
                <p className="line-clamp-2 text-sm text-slate-300 italic">{event.speakers}</p>
              )}

              <p className="line-clamp-1 text-sm text-slate-300/90">{event.locationName}</p>

              {visibleTags.length > 0 && (
                <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
                  {visibleTags.map((tag) => (
                    <li
                      key={tag.id}
                      className="ui-tag-chip ui-tag-chip-strong"
                      style={{
                        backgroundColor: tag.colorBackground,
                        color: tag.colorForeground ?? "#fff",
                      }}
                    >
                      {tag.label}
                    </li>
                  ))}
                  {hiddenTagCount > 0 && (
                    <li className="ui-tag-chip bg-white/3 text-slate-300">
                      +{hiddenTagCount} more
                    </li>
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
          className="ui-focus-ring ui-icon-btn h-11 w-11 shrink-0 focus-visible:outline-none"
        >
          {bookmark ? (
            <BookmarkIconSolid className="h-5 w-5" aria-hidden="true" />
          ) : (
            <BookmarkIconOutline className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      </div>
    </article>
  );
});

ScheduleEventItem.displayName = "ScheduleEventItem";

export default ScheduleEventItem;
