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
    "--event-color": event.color ?? "#fff",
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

  return (
    <article
      style={barStyle}
      className="group relative flex w-full min-w-0 flex-col gap-4 overflow-hidden rounded-lg border border-white/10 bg-slate-900/45 py-3 pr-4 pl-4 transition-colors focus-within:border-[#017FA4]/70 hover:border-slate-700/80 hover:bg-slate-900"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-0 bottom-0 left-0 w-[clamp(0.3rem,2vw,0.9rem)] bg-(--event-color) transition-[width] duration-200 group-hover:w-[clamp(0.4rem,3vw,1.1rem)]"
      />

      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-0 bottom-0 left-0 w-[clamp(0.3rem,2vw,0.9rem)] bg-linear-to-b from-white/0 to-[#017FA4]/22 opacity-60 mix-blend-multiply transition-[width] duration-200 group-hover:w-[clamp(0.4rem,3vw,1.1rem)]"
      />

      <Link
        href={href}
        className="ui-focus-ring relative z-10 flex w-full flex-col gap-3 rounded-md pr-10 pl-5 focus-visible:outline-none md:flex-row md:items-start md:justify-between"
      >
        <div className="min-w-0 md:w-48">
          {(isLive || isNext) && (
            <span
              className={`mb-1 inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-[0.08em] uppercase ${
                isLive
                  ? "border-[#E0004E] bg-[#E0004E]/16 text-[#ffb4c9]"
                  : "border-[#F1B435]/75 bg-[#F1B435]/16 text-[#F1B435]"
              }`}
            >
              {isLive ? "Live" : "Next"}
            </span>
          )}
          <p className="text-base font-semibold text-slate-100">
            <time dateTime={event.beginIso}>{event.beginDisplay}</time>
          </p>
          <p className="text-sm text-slate-400">
            <time dateTime={event.endIso}>{event.endDisplay}</time>
          </p>
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 text-xl font-bold text-slate-100">{event.title}</h3>

          {event.speakers && <p className="mt-1 text-slate-300 italic">{event.speakers}</p>}

          <p className="mt-1 text-slate-300">{event.locationName}</p>

          <ul className="m-0 mt-2 flex list-none flex-wrap gap-1 p-0 text-sm uppercase">
            {event.tags.map((tag) => (
              <li
                key={tag.id}
                className="inline-flex items-center rounded-full border border-white/15 px-2 py-0.5 text-xs font-medium"
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
        className="ui-focus-ring absolute top-3 right-3 z-10 inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition hover:text-[#017FA4] focus-visible:outline-none"
      >
        {bookmark ? (
          <BookmarkIconSolid className="h-5 w-5 text-[#6CCDBB]" aria-hidden="true" />
        ) : (
          <BookmarkIconOutline className="h-5 w-5" aria-hidden="true" />
        )}
      </button>
    </article>
  );
});

ScheduleEventItem.displayName = "ScheduleEventItem";

export default ScheduleEventItem;
