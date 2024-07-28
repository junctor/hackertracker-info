import { eventTime } from "@/lib/utils/dates";
import React from "react";

function TVEventCell({ event }: { event: EventData }) {
  return (
    <div className="my-3 ml-2 mr-3">
      <div className="items-center h-min-36 table">
        <div
          className={`table-cell px-2 h-full w-3 bg-[${event.color}] rounded-md`}
        />
        <div className="ml-5">
          <div className="w-full table-cell">
            <h1 className="text-3xl font-bold text-left break-words">
              {event.title}
            </h1>

            <p className="text-lg">{event.speakers}</p>

            <p className="text-xl text-gray-400">{event.location}</p>
            <div
              className={`rounded-full h-3 w-3 inline-flex mr-2 bg-[${event.color}]`}
            />
            <p className="text-base inline-flex">{event.category}</p>
            <p className="text-xl text-dc-yellow font-bold">
              {`${eventTime(new Date(event.begin), false)} - ${eventTime(
                new Date(event.end)
              )}`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TVEventCell;
