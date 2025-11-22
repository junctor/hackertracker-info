import React, { useMemo } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Bookmark } from "lucide-react";
import { ScheduleEvent } from "@/types/info";
import { useBookmarks } from "@/hooks/useBookmarks";
import { eventTimeTable } from "@/lib/dates";
import { useRouter } from "next/router";

function EventCell({
  event,
  isBookmarked,
}: {
  event: ScheduleEvent;
  isBookmarked: boolean;
}) {
  const [bookmark, toggleBookmark] = useBookmarks(event.id, isBookmarked);

  const router = useRouter();

  const barStyle = useMemo(
    () => ({ "--event-color": event.color ?? "#fff" }) as React.CSSProperties,
    [event.color]
  );

  return (
    <TableRow
      role="button"
      tabIndex={0}
      onClick={() => router.push(`../content?id=${event.content_id}`)}
      className="group cursor-pointer hover:bg-gray-900 focus-visible:bg-gray-900 focus-visible:outline-2 focus-visible:outline-indigo-500 focus-visible:outline-offset-2 transition-colors"
    >
      <TableCell
        style={barStyle}
        className="relative px-2 py-1 before:absolute before:top-1 before:bottom-1 before:left-1 before:rounded before:bg-(--event-color) before:w-[clamp(0.25rem,2vw,1rem)] before:transition-all before:duration-200 group-hover:before:w-[clamp(0.4rem,3vw,1.2rem)]"
      />

      <TableCell className="px-2 py-1 whitespace-normal wrap-break-word min-w-0">
        <div className="space-y-0.5">
          <p className="text-base font-semibold text-gray-100">
            <time dateTime={new Date(event.begin).toISOString()}>
              {eventTimeTable(event.begin)}
            </time>
          </p>
          <p className="text-sm text-gray-400">
            {eventTimeTable(event.end, false)}
          </p>
        </div>
      </TableCell>
      <TableCell className="px-2 py-2 whitespace-normal wrap-break-word min-w-0">
        <h3 className="text-xl font-bold text-gray-100 line-clamp-2">
          {event.title}
        </h3>
        {event.speakers && (
          <p className="italic mt-1 text-gray-300">{event.speakers}</p>
        )}
        <p className="mt-1 text-gray-300">{event.location}</p>
        <div className="flex flex-wrap gap-1 uppercase text-sm mt-2">
          {event.tags.map((tag) => (
            <Badge
              key={tag.id}
              className="font-medium"
              style={{
                backgroundColor: tag.color_background,
                color: tag.color_foreground ?? "#fff",
              }}
            >
              {tag.label}
            </Badge>
          ))}
        </div>
      </TableCell>

      <TableCell className="px-2 py-1 text-right">
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleBookmark();
          }}
          aria-label={bookmark ? "Remove bookmark" : "Add bookmark"}
          aria-pressed={bookmark}
          className="focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          <Bookmark
            className={`h-5 w-5 ${bookmark ? "fill-current text-indigo-400" : "stroke-current text-gray-500"}`}
          />
        </button>
      </TableCell>
    </TableRow>
  );
}

export default React.memo(EventCell);
