import { upcomongTimeDisplayParts } from "../../lib/utils/dates";
import { TableCell, TableRow } from "@/components/ui/table";
import React from "react";
import { useRouter } from "next/router";

export default function UpcomingCell({ event }: { event: EventData }) {
  const router = useRouter();

  return (
    <TableRow
      id={`e-${event.id}`}
      className="cursor-pointer"
      onClick={() => router.push(`../event?id=${event.id}`)}
    >
      <TableCell className="text-center align-middle">
        {upcomongTimeDisplayParts(event.begin).map((part) => (
          <p
            key={part}
            className="text-xs sm:text-xs md:text-sm lg:text-base font-bold"
          >
            {part}
          </p>
        ))}
      </TableCell>
      <TableCell className="text-center align-middle">
        <p className="text-xs sm:text-xs md:text-sm lg:text-base font-bold">
          to
        </p>
      </TableCell>
      <TableCell className="text-center align-middle">
        {upcomongTimeDisplayParts(event.end).map((part) => (
          <p
            key={part}
            className="text-xs sm:text-xs md:text-sm lg:text-base font-bold"
          >
            {part}
          </p>
        ))}
      </TableCell>
      <TableCell className="max-w-96 sm:max-w-60 md:max-w-full">
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 mt-2">
            {event.tags
              ?.sort((a, b) => (a.sort_order > b.sort_order ? 1 : -1))
              ?.map((tag) => (
                <div className="flex items-center mr-2" key={tag.id}>
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
    </TableRow>
  );
}
