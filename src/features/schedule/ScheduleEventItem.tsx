import React, { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { BookmarkIcon as BookmarkIconOutline } from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkIconSolid } from "@heroicons/react/24/solid";
import { useBookmarks } from "@/lib/hooks/useBookmarks";
import { eventTimeTable } from "@/lib/dates";
import type { ScheduleEventViewModel } from "./ScheduleEvents";
import { ConferenceManifest } from "@/lib/conferences";

export default function ScheduleEventItem({
  conf,
  event,
  isBookmarked,
}: {
  conf: ConferenceManifest;
  event: ScheduleEventViewModel;
  isBookmarked: boolean;
}) {
  const [bookmark, toggleBookmark] = useBookmarks(event.id, isBookmarked);

  const router = useRouter();
  const confCode = useMemo(() => {
    const confParam = router.query.conf;
    const confValue = Array.isArray(confParam) ? confParam[0] : confParam;
    return typeof confValue === "string" ? confValue : null;
  }, [router.query.conf]);

  const href = confCode
    ? `/${confCode}/content/?id=${event.contentId}`
    : `/content/?id=${event.contentId}`;

  const barStyle = useMemo(
    () => ({ "--event-color": event.color ?? "#fff" }) as React.CSSProperties,
    [event.color],
  );

  return (
    <li>
      <Link
        href={href}
        style={barStyle}
        className="group relative flex w-full flex-col gap-4 rounded-lg border border-gray-800 bg-gray-900/40 px-4 py-3 transition hover:border-gray-700 hover:bg-gray-900 focus-visible:outline-2 focus-visible:outline-indigo-500 focus-visible:outline-offset-2 before:absolute before:top-3 before:bottom-3 before:left-3 before:w-[clamp(0.25rem,2vw,1rem)] before:rounded before:bg-(--event-color) before:transition-all before:duration-200 group-hover:before:w-[clamp(0.4rem,3vw,1.2rem)]"
      >
        <article className="flex w-full flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0 md:w-48">
            <p className="text-base font-semibold text-gray-100">
              <time dateTime={new Date(event.begin).toISOString()}>
                {eventTimeTable(event.begin, true, conf.timezone)}
              </time>
            </p>
            <p className="text-sm text-gray-400">
              {eventTimeTable(event.end, false, conf.timezone)}
            </p>
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-xl font-bold text-gray-100 line-clamp-2">
              {event.title}
            </h3>
            {event.speakers && (
              <p className="italic mt-1 text-gray-300">{event.speakers}</p>
            )}
            <p className="mt-1 text-gray-300">{event.locationName}</p>
            <div className="mt-2 flex flex-wrap gap-1 uppercase text-sm">
              {event.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
                  style={{
                    backgroundColor: tag.colorBackground,
                    color: tag.colorForeground ?? "#fff",
                  }}
                >
                  {tag.label}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-start justify-end md:w-12">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleBookmark();
              }}
              aria-label={bookmark ? "Remove bookmark" : "Add bookmark"}
              aria-pressed={bookmark}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition hover:text-indigo-300 focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              {bookmark ? (
                <BookmarkIconSolid className="h-5 w-5 text-indigo-400" />
              ) : (
                <BookmarkIconOutline className="h-5 w-5" />
              )}
            </button>
          </div>
        </article>
      </Link>
    </li>
  );
}
