import { Clock, MapPin } from "lucide-react";
import { eventTime, formatSessionTime } from "@/lib/dates";
import { ScheduleEvent } from "@/types/info";
import React from "react";

export default function TVEventCell({ event }: { event: ScheduleEvent }) {
  return (
    <div className="p-4 flex space-x-4">
      <div
        className="w-2 rounded"
        style={{ backgroundColor: event.color || "#FFD700" }}
      />

      {/* Main content */}
      <div className="flex-1 text-white">
        {/* Title */}
        <h2 className="text-2xl font-semibold leading-snug break-words">
          {event.title}
        </h2>

        {/* Speakers */}
        {event.speakers && (
          <p className="mt-1 text-lg text-gray-200">{event.speakers}</p>
        )}

        {/* Time & location row */}
        <div className="mt-2 flex flex-wrap items-center text-gray-400 space-x-4">
          <div className="flex items-center space-x-1">
            <Clock size={16} />
            <span className="text-sm">
              {dateConvert(event.begin, event.end)}
            </span>
          </div>

          {event.location && (
            <div className="flex items-center space-x-1">
              <MapPin size={16} />
              <span className="text-sm">{event.location}</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {event.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {event.tags.map((tag) => (
              <span
                key={tag.id}
                className="px-2 py-1 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: tag.color_background,
                  color: tag.color_foreground,
                }}
              >
                {tag.label}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function dateConvert(start: string, end: string) {
  const beginDate = new Date(start);
  const endDate = new Date(end);
  const sameTime = beginDate.getTime() === endDate.getTime();

  return sameTime
    ? eventTime(beginDate, true)
    : formatSessionTime(beginDate, endDate);
}
