import React from "react";
import Link from "next/link";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Bookmark } from "lucide-react";
import { ScheduleEvent } from "@/types/info";
import { useBookmarks } from "@/hooks/useBookmarks";
import { eventTimeTable } from "@/lib/dates";

function EventCell({
  event,
  isBookmarked,
}: {
  event: ScheduleEvent;
  isBookmarked: boolean;
}) {
  const [bookmark, toggleBookmark] = useBookmarks(event.id, isBookmarked);

  return (
    <TableRow className="hover:bg-gray-800 focus-within:ring-2 focus-within:ring-indigo-500 transition-colors">
      <Link
        href={`../event?id=${event.id}`}
        className="contents cursor-pointer"
      >
        <TableCell
          style={
            { "--event-color": event.color ?? "#fff" } as React.CSSProperties
          }
          className="relative px-2 py-1 before:absolute before:top-1 before:bottom-1 before:left-1 before:w-1 before:rounded before:bg-[var(--event-color)]"
        />
        <TableCell className="px-2 py-1 whitespace-normal break-words min-w-0">
          <div className="space-y-0.5">
            <p className="text-base font-semibold text-gray-100">
              {eventTimeTable(event.begin)}
            </p>
            <p className="text-sm text-gray-400">{eventTimeTable(event.end)}</p>
          </div>
        </TableCell>
        <TableCell className="px-2 py-2 whitespace-normal break-words min-w-0">
          <h3 className="text-xl font-bold text-gray-100">{event.title}</h3>
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
      </Link>

      <TableCell className="px-2 py-1 text-right">
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
      </TableCell>
    </TableRow>
  );
}

export default React.memo(EventCell);
