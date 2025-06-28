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
import { ScheduleEvent } from "@/types/info";
import { useBookmarks } from "@/hooks/useBookmarks";
import { Bookmark } from "lucide-react";

export default function Event({
  event,
  isBookmarked,
}: {
  event: ScheduleEvent;
  isBookmarked: boolean;
}) {
  const icsHref = `data:text/calendar;charset=utf8,${encodeURIComponent(
    cal(event)
  )}`;

  const [bookmark, toggleBookmark] = useBookmarks(event.id, isBookmarked);

  return (
    <div className="min-h-screen text-gray-100 container mx-5 py-8">
      {/* Header + Breadcrumb */}
      <div className="flex flex-wrap justify-between items-start">
        <div className="flex-auto space-y-2">
          <Breadcrumb className="text-gray-500">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/schedule" className="hover:text-gray-100">
                    Schedule
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="mx-2" />
            </BreadcrumbList>
          </Breadcrumb>

          <h1
            className="font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl"
            style={{ color: event.color ?? "#fff" }}
          >
            {event.title}
          </h1>
        </div>

        <div className="hidden md:flex items-center gap-4 mt-2 text-gray-400">
          <a href={icsHref} download={`DEF_CON_33-${event.id}.ics`}>
            <CalendarIcon className="h-6 w-6 hover:text-gray-200" />
          </a>
          {typeof navigator.share === "function" && (
            <Share2Icon
              className="h-6 w-6 cursor-pointer hover:text-gray-200"
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
          <Bookmark
            onClick={(e) => {
              e.stopPropagation();
              toggleBookmark();
            }}
            aria-label={bookmark ? "Remove bookmark" : "Add bookmark"}
            className={`h-6 w-6 cursor-pointer ${
              bookmark
                ? "fill-current text-indigo-400"
                : "stroke-current text-gray-500"
            }`}
          />
        </div>
      </div>

      {/* Time + Location */}
      <div className="mt-6 space-y-4">
        <div className="flex items-center text-gray-300">
          <a
            href={icsHref}
            download={`DEF_CON_33-${event.id}.ics`}
            className="flex items-center hover:text-gray-100"
          >
            <ClockIcon className="h-5 w-5 mr-2" />
            <time className="text-sm md:text-base">
              {event.endTimestampSeconds !== event.beginTimestampSeconds
                ? `${eventTime(new Date(event.begin), false)} – ${eventTime(
                    new Date(event.end),
                    true
                  )}`
                : eventTime(new Date(event.begin), true)}
            </time>
          </a>
        </div>

        {event.location && (
          <div className="flex items-center text-gray-300">
            <SewingPinIcon className="h-5 w-5 mr-2" />
            <p className="text-sm md:text-base">{event.location}</p>
          </div>
        )}

        {/* Tags */}
        <div className="mt-4 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {event.tags
            .sort((a, b) =>
              a.sort_order !== b.sort_order
                ? a.sort_order - b.sort_order
                : a.label.localeCompare(b.label)
            )
            .map((tag) => (
              <div key={tag.id} className="flex items-center">
                <span
                  className="rounded-full h-3 w-3 md:h-4 md:w-4 mr-2 flex-none"
                  style={{ backgroundColor: tag.color_background }}
                />
                <p className="text-xs md:text-sm text-gray-200">{tag.label}</p>
              </div>
            ))}
        </div>
      </div>

      {/* Description & Links */}
      <div className="mt-10">
        <div className="prose prose-invert max-w-none text-gray-100">
          <Markdown content={event.description} />
        </div>
        {event.links.length > 0 && (
          <div className="mt-6">
            <h2 className="font-bold text-lg sm:text-xl md:text-2xl mb-3 text-gray-100">
              Links
            </h2>
            <ul className="list-disc ml-5 space-y-2">
              {event.links.map((link) => (
                <li key={link.url}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:text-indigo-200 hover:underline"
                  >
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
        <div className="mt-10">
          <h2 className="font-bold text-lg sm:text-xl md:text-2xl mb-3 text-gray-100">
            People
          </h2>
          <div className="space-y-4">
            {event.speaker_details
              .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
              .map((speaker) => (
                <Link
                  key={speaker.id}
                  href={`/person?id=${speaker.id}`}
                  className="block hover:bg-gray-800 p-2 rounded-md transition"
                >
                  <p className="font-bold text-sm sm:text-base text-gray-100">
                    {speaker.name}
                  </p>
                  {speaker.title && (
                    <p className="text-xs sm:text-sm text-gray-400">
                      {speaker.title}
                    </p>
                  )}
                </Link>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
