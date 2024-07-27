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
        <TableCell className="max-w-96 sm:max-w-[640px] md:max-w-full">
          <h1
            className={`text-base md:text-lg lg:text-xl font-bold text-left break-words hover:text-[${event.color}]`}
          >
            {event.title}
          </h1>
          <p className="text-xs md:text-sm lg:text-base font-bold mt-1">
            {event.speakers}
          </p>
          <p className="text-xs md:text-sm lg:text-base text-gray-400 mt-1">
            {event.location}
          </p>
          <div>
            <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-0.5 md:gap-1 lg:gap-2 mt-2">
              {event.tags
                ?.sort((a, b) => (a.sort_order > b.sort_order ? 1 : -1))
                ?.map((tag) => (
                  <div className="flex items-center mx-2" key={tag.id}>
                    <span
                      className={`rounded-full h-2 w-2 md:h-3 md:w-3 lg:h-4 lg:w-4 green inline-flex flex-none mr-1 bg-[${tag.color_background}]`}
                    />
                    <p className={`text-xs md:text-sm lg:text-base`}>
                      {tag.label}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </TableCell>
      </Link>
    </div>
  );
}
