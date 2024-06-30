import Link from "next/link";
import { timeDisplayParts } from "../../lib/utils/dates";
import { TableCell } from "@/components/ui/table";
import React from "react";

export default function EventCell({ event }: { event: EventData }) {
  return (
    <div>
      <Link href={`../event?id=${event.id}`} prefetch={false}>
        <TableCell className="text-center align-middle">
          {timeDisplayParts(event.begin).map((part) => (
            <p
              key={part}
              className="text-xs sm:text-sm md:text-sm lg:text-base font-bold"
            >
              {part}
            </p>
          ))}
        </TableCell>
        <TableCell>
          <h1
            className={`text-base md:text-lg lg:text-xl font-bold text-left break-words hover:text-[${event.color}]`}
          >
            {event.title}
          </h1>
          <p className="text-xs md:text-sm lg:text-base font-bold">
            {event.speakers}
          </p>
          <div className="flex items-center">
            <p className="text-xs md:text-sm lg:text-base text-gray-400 mr-5">
              {event.location}
            </p>

            <span
              className={`rounded-full h-2 w-2 md:h-3 md:w-3 lg:h-4 lg:w-4 green inline-flex flex-none mr-2 bg-[${event.color}]`}
            />
            <p className={`text-xs md:text-sm lg:text-base`}>
              {event.category}
            </p>
          </div>
        </TableCell>
      </Link>
    </div>
  );
}
