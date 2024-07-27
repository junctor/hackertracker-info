import {
  ClockIcon,
  MapIcon,
  CalendarDaysIcon,
  ArrowUpOnSquareIcon,
} from "@heroicons/react/24/outline";
import cal from "../../lib/utils/cal";
import { eventTime } from "../../lib/utils/dates";
import ReactMarkdown from "react-markdown";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { BASEURL } from "@/lib/utils/const";
import React from "react";

function Event({ event, tags }: { event: HTEvent; tags: HTTag[] }) {
  const allTags = tags?.flatMap((t) => t.tags) ?? [];

  const eventTags =
    event.tag_ids
      .map((t) => allTags.find((a) => a.id === t))
      .filter((tag) => tag !== undefined) ?? [];

  return (
    <div className="mx-5">
      <div className="flex">
        <div className="my-2 justify-start flex-auto">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="../events">Schedule</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </BreadcrumbList>
          </Breadcrumb>
          <div className="my-3">
            <h1
              className={`font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-5 mr-3 text-[${event.type.color}]`}
            >
              {event.title}
            </h1>
          </div>
        </div>
        <div className="mr-10 ml-5 content-center justify-end flex-none hidden md:block">
          <div className="flex">
            <a
              href={`data:text/calendar;charset=utf8,${encodeURIComponent(
                cal(event)
              )}`}
              download={`${event.conference}-${event.id}.ics`}
            >
              <CalendarDaysIcon className="h-5 w-5 md:h-7 md:w-7 lg:w-8 lg:h-8 mr-2" />
            </a>
            {typeof navigator.share === "function" && (
              <ArrowUpOnSquareIcon
                className="h-5 w-5 md:h-7 md:w-7 lg:w-8 lg:h-8 mr-2"
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                onClick={async (): Promise<void> => {
                  try {
                    await navigator.share({
                      title: event.title,
                      url: `${BASEURL}/event/?id=${event.id}`,
                    });
                  } catch (e) {
                    return;
                  }
                }}
              />
            )}
          </div>
        </div>
      </div>
      <div className="font-bold">
        <div className="flex items-center w-11/12 my-2 cursor-pointer">
          <a
            className="flex"
            href={`data:text/calendar;charset=utf8,${encodeURIComponent(
              cal(event)
            )}`}
            download={`${event.conference}-${event.id}.ics`}
          >
            <ClockIcon className="h-5 w-5 md:h-7 md:w-7 lg:w-8 lg:h-8 mr-2" />
            <p className="md:text-base lg:text-lg text-xs">
              {event.end_timestamp.seconds !== event.begin_timestamp.seconds
                ? `${eventTime(new Date(event.begin), false)} - ${eventTime(
                    new Date(event.end),
                    true
                  )}`
                : `${eventTime(new Date(event.begin), true)}`}
            </p>
          </a>
        </div>
        <div className="flex items-center w-11/12 my-2">
          <MapIcon className="h-5 w-5 md:h-7 md:w-7 lg:w-8 lg:h-8 mr-2" />
          <p className="md:text-base lg:text-lg text-xs">
            {event.location.name}
          </p>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-1 md:gap-2 lg:gap-3">
          {eventTags
            ?.sort((a, b) => (a.sort_order > b.sort_order ? 1 : -1))
            ?.map((tag) => (
              <div
                className="flex items-center mr-4 md:mr-5 lg:mr-6"
                key={tag.id}
              >
                <span
                  className={`rounded-full h-4 w-4 md:h-5 md:w-5 lg:w-6 lg:h-6 mr-2 green inline-flex flex-none bg-[${tag.color_background}]`}
                />
                <p className={`text-xs md:text-sm lg:text-base`}>{tag.label}</p>
              </div>
            ))}
        </div>
      </div>

      <div className="mt-10">
        <div className="text-sm md:text-base lg:text-lg w-11/12">
          <div className="prose lg:prose-xl whitespace-pre-wrap">
            <ReactMarkdown>{event.description}</ReactMarkdown>
          </div>
          {(event.links ?? []).length > 0 && (
            <div className="mt-5 text-left">
              <h2 className="font-bold text-base sm:text-lg md:text-xl lg:text-2xl">
                Links
              </h2>
              <ul className="list-disc text-xs sm:text-sm md:text-base lg:text-lg ml-5 mt-2">
                {(event.links ?? []).map((l) => (
                  <li key={l.url}>
                    <a href={l.url}>{l.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      {event.speakers.length > 0 && (
        <div className="mt-10 text-left">
          <h2 className="font-bold text-base sm:text-lg md:text-xl lg:text-2xl">
            Speakers
          </h2>
          <div className="items-center w-11/12 mt-1 mb-2 pt-2 pb-2">
            {event.speakers
              .sort(
                (a) =>
                  (findSortOrder(event.people, a.id) ?? 0) -
                  (findSortOrder(event.people, a.id) ?? 0)
              )
              .map((s) => (
                <div
                  key={s.id}
                  className="ml-3 table mt-2 mb-2 align-middle items-center"
                >
                  <div
                    className={`ml-1 table-cell h-full w-1 sm:w-2 mr-3 rounded-md`}
                  />
                  <Link href={`/speaker?id=${s.id}`}>
                    <div className="inline-block text-left ml-2">
                      <p className="font-bold text-sm sm:text-md md:text-base lg:text-lg">
                        {s.name}
                      </p>

                      {s.title != null && (
                        <p className="text-xs sm:text-xs md:text-xs lg:text-sm">
                          {s.title}
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

function findSortOrder(people: HTPeople[], id: number) {
  return people.find((p) => p.person_id === id)?.sort_order;
}

export default Event;
