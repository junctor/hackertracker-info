import {
  ClockIcon,
  CalendarIcon,
  SewingPinIcon,
  Share2Icon,
} from "@radix-ui/react-icons";
import React from "react";
import Link from "next/link";

import cal from "@/lib/cal";
import { eventTime } from "@/lib/dates";
import Markdown from "../markdown/Markdown";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ScheduleEvent } from "@/types/scheduleTypes";

export default function Event({ event }: { event: ScheduleEvent }) {
  const icsHref = `data:text/calendar;charset=utf8,${encodeURIComponent(
    cal(event)
  )}`;

  return (
    <div className="mx-5">
      {/* Header + Breadcrumb */}
      <div className="flex flex-wrap justify-between items-start">
        <div className="my-2 flex-auto">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/schedule">Schedule</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </BreadcrumbList>
          </Breadcrumb>
          <h1
            className="font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl my-4"
            style={{ color: event?.color ?? "#000" }}
          >
            {event.title}
          </h1>
        </div>
        <div className="hidden md:flex items-center gap-3 mt-2">
          <a href={icsHref} download={`DEF_CON_33-${event.id}.ics`}>
            <CalendarIcon className="h-6 w-6 lg:h-7 lg:w-7" />
          </a>
          {typeof navigator.share === "function" && (
            <Share2Icon
              className="h-6 w-6 lg:h-7 lg:w-7 cursor-pointer"
              onClick={async () => {
                try {
                  await navigator.share({
                    title: event.title,
                    url: `/event/?id=${event.id}`,
                  });
                } catch (err) {
                  console.error("Share failed:", err);
                }
              }}
            />
          )}
        </div>
      </div>

      {/* Time + Location */}
      <div className="font-bold">
        <div className="flex items-center my-2">
          <a
            href={icsHref}
            download={`DEF_CON_33-${event.id}.ics`}
            className="flex items-center"
          >
            <ClockIcon className="h-5 w-5 mr-2" />
            <time className="text-xs md:text-sm lg:text-base">
              {event.endTimestampSeconds !== event.beginTimestampSeconds
                ? `${eventTime(new Date(event.begin), false)} - ${eventTime(
                    new Date(event.end),
                    true
                  )}`
                : eventTime(new Date(event.begin), true)}
            </time>
          </a>
        </div>

        {event.location && (
          <div className="flex items-center my-2">
            <SewingPinIcon className="h-5 w-5 mr-2" />
            <p className="text-xs md:text-sm lg:text-base">{event.location}</p>
          </div>
        )}

        {/* Tags */}
        <div className="inline-grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-2 md:gap-y-3 w-10/12">
          {event.tags
            .sort((a, b) =>
              a.sort_order !== b.sort_order
                ? a.sort_order - b.sort_order
                : a.label.localeCompare(b.label)
            )
            .map((tag) => (
              <div key={tag.id} className="flex items-center mr-3">
                <span
                  className="rounded-full h-3 w-3 md:h-4 md:w-4 mr-2 flex-none"
                  style={{ backgroundColor: tag.color_background }}
                />
                <p className="text-xs md:text-sm">{tag.label}</p>
              </div>
            ))}
        </div>
      </div>

      {/* Description & Links */}
      <div className="mt-10 text-sm md:text-base">
        <Markdown content={event.description} />
        {event.links.length > 0 && (
          <div className="mt-5 text-left">
            <h2 className="font-bold text-base sm:text-lg md:text-xl lg:text-2xl">
              Links
            </h2>
            <ul className="list-disc text-xs sm:text-sm md:text-base lg:text-lg ml-5 mt-2">
              {event.links.map((link) => (
                <li key={link.url}>
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Speakers */}
      {event.speaker_details.length > 0 && (
        <div className="mt-10 text-left">
          <h2 className="font-bold text-base sm:text-lg md:text-xl lg:text-2xl">
            People
          </h2>
          <div className="mt-2 space-y-3">
            {event.speaker_details
              .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
              .map((speaker) => (
                <div key={speaker.id} className="ml-3">
                  <Link href={`/person?person=${speaker.id}`}>
                    <div className="ml-2">
                      <p className="font-bold text-sm sm:text-md md:text-base lg:text-lg">
                        {speaker.name}
                      </p>
                      {speaker.title && (
                        <p className="text-xs md:text-sm text-muted-foreground">
                          {speaker.title}
                        </p>
                      )}
                    </div>
                  </Link>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
