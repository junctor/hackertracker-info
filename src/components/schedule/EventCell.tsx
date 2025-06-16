import React from "react";
import Link from "next/link";
import { eventTimeTable } from "@/lib/dates";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Bookmark } from "lucide-react";
import { ScheduleEvent } from "@/types/info";

function EventCellComponent({ event }: { event: ScheduleEvent }) {
  const sortedTags = [...(event.tags ?? [])].sort((a, b) =>
    a.sort_order !== b.sort_order
      ? a.sort_order - b.sort_order
      : a.label.localeCompare(b.label)
  );
  const isBookmarked = false; // TODO: hook up real state

  return (
    <Link href={`../event?id=${event.id}`} className="contents">
      <TableRow
        id={`e-${event.id}`}
        role="link"
        className="cursor-pointer hover:bg-gray-800 transition-colors"
      >
        {/* Color bar */}
        <TableCell className="relative align-middle px-2 py-1">
          <div
            className="absolute top-1 bottom-1 left-1 w-1 md:w-2 lg:w-3 rounded"
            style={{ backgroundColor: event.color ?? "#fff" }}
          />
        </TableCell>

        {/* Time */}
        <TableCell className="px-2 py-1 align-middle whitespace-normal break-words min-w-0">
          <div className="space-y-0.5">
            <p className="text-sm md:text-base lg:text-lg font-semibold text-gray-100">
              {eventTimeTable(event.begin)}
            </p>
            <p className="text-xs md:text-sm lg:text-md text-gray-400">
              {eventTimeTable(event.end)}
            </p>
          </div>
        </TableCell>

        {/* Event */}
        <TableCell className="px-2 py-2 align-top whitespace-normal break-words min-w-0">
          <h3 className="text-base md:text-lg lg:text-xl font-bold drop-shadow-sm text-gray-100">
            {event.title}
          </h3>
          {event.speakers && (
            <p className="text-sm md:text-base lg:text-lg italic mt-1 text-gray-300">
              {event.speakers}
            </p>
          )}
          <p className="text-sm md:text-base lg:text-lg mt-1 text-gray-300">
            {event.location}
          </p>
          <div className="flex flex-wrap text-xs md:text-sm lg:text-base uppercase gap-1 mt-2">
            {sortedTags.map((tag) => (
              <Badge
                key={tag.id}
                className="font-medium"
                style={{
                  backgroundColor: tag.color_background,
                  color: tag.color_foreground || "#ffffff",
                }}
              >
                {tag.label}
              </Badge>
            ))}
          </div>
        </TableCell>

        {/* Bookmark */}
        <TableCell className="px-2 py-1 align-middle">
          <Bookmark
            className={`h-5 w-5 cursor-pointer ${
              isBookmarked
                ? "fill-current text-indigo-400"
                : "stroke-current text-gray-500"
            }`}
            onClick={(e) => e.stopPropagation()}
          />
        </TableCell>
      </TableRow>
    </Link>
  );
}

export default React.memo(EventCellComponent);
