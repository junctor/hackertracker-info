import { useBookmarks } from "@/lib/hooks/useBookmarks";
import cal from "@/lib/cal";
import { eventTime, formatSessionTime } from "@/lib/dates";
import { ContentEntity, EventEntity } from "@/lib/types/ht-types";
import {
  BookmarkIcon as BookmarkIconOutline,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkIconSolid } from "@heroicons/react/24/solid";
import React from "react";

export default function ContentSession({
  session,
  content,
  isBookmarked,
  locationName,
  timezone,
}: {
  session: EventEntity;
  content: ContentEntity;
  isBookmarked: boolean;
  locationName?: string;
  timezone: string;
}) {
  const begin = new Date(session.begin);
  const end = new Date(session.end);
  const sameTime = session.end === session.begin;

  const [bookmark, toggleBookmark] = useBookmarks(session.id, isBookmarked);

  return (
    <li
      key={session.id}
      className="group flex flex-col md:flex-row md:items-center md:justify-between bg-gray-800 p-4 rounded-lg transition-shadow hover:shadow-lg"
    >
      <div className="flex-1">
        <div className="text-base text-gray-200 font-medium">
          {sameTime
            ? eventTime(begin, true, timezone)
            : formatSessionTime(begin, end, timezone)}
        </div>
        {locationName && (
          <div className="text-sm text-gray-400 mt-1">{locationName}</div>
        )}
      </div>
      <div className="mt-3 md:mt-0 md:ml-4 flex items-center md:gap-5 gap-3">
        <a
          href={`data:text/calendar;charset=utf8,${encodeURIComponent(
            cal(content, session, locationName),
          )}`}
          download={`DEF_CON_${content.id}-${session.id}.ics`}
          role="button"
          title={`Download calendar invite for session: ${content.title}`}
          aria-label={`Download calendar invite for session: ${content.title}`}
          className="text-gray-400 hover:text-white"
        >
          <CalendarIcon className="h-6 w-6" />
        </a>
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleBookmark();
          }}
          aria-label={bookmark ? "Remove bookmark" : "Add bookmark"}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition hover:text-indigo-300"
        >
          {bookmark ? (
            <BookmarkIconSolid className="h-5 w-5 text-indigo-400" />
          ) : (
            <BookmarkIconOutline className="h-5 w-5" />
          )}
        </button>
      </div>
    </li>
  );
}
