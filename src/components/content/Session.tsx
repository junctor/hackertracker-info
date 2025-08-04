import { useBookmarks } from "@/hooks/useBookmarks";
import cal from "@/lib/cal";
import { eventTime, formatSessionTime } from "@/lib/dates";
import { ContentSessionLite, ProcessedContentId } from "@/types/info";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Bookmark } from "lucide-react";
import React from "react";

export default function Session({
  session,
  content,
  isBookmarked,
}: {
  session: ContentSessionLite;
  content: ProcessedContentId;
  isBookmarked: boolean;
}) {
  const begin = new Date(session.begin_tsz);
  const end = new Date(session.end_tsz);
  const sameTime = session.end_tsz === session.begin_tsz;

  const [bookmark, toggleBookmark] = useBookmarks(
    session.session_id,
    isBookmarked
  );

  return (
    <li
      key={session.session_id}
      className="group flex flex-col md:flex-row md:items-center md:justify-between bg-gray-800/50 p-4 rounded-lg transition-shadow hover:shadow-lg"
    >
      <div className="flex-1">
        <div className="text-base text-gray-200 font-medium">
          {sameTime ? eventTime(begin, true) : formatSessionTime(begin, end)}
        </div>
        {session.location_name && (
          <div className="text-sm text-gray-400 mt-1">
            {session.location_name}
          </div>
        )}
      </div>
      <div className="mt-3 md:mt-0 md:ml-4 flex items-center md:gap-5 gap-3">
        <a
          href={`data:text/calendar;charset=utf8,${encodeURIComponent(
            cal(content, session)
          )}`}
          download={`DEF_CON_33-${session.session_id}.ics`}
          role="button"
          title={`Download calendar invite for session: ${content.title}`}
          aria-label={`Download calendar invite for session: ${content.title}`}
          className="text-gray-400 hover:text-white"
        >
          <CalendarIcon className="h-6 w-6" />
        </a>
        <Bookmark
          onClick={(e) => {
            e.stopPropagation();
            toggleBookmark();
          }}
          aria-label={bookmark ? "Remove bookmark" : "Add bookmark"}
          className={`h-5 w-5 cursor-pointer ${
            bookmark
              ? "fill-current text-indigo-400"
              : "stroke-current text-gray-500"
          }`}
        />
      </div>
    </li>
  );
}
