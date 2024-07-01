import Link from "next/link";
import { eventTime } from "../../lib/utils/dates";
import Theme from "../../lib/utils/theme";
import ReactMarkdown from "react-markdown";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

function Speaker({ speaker }: { speaker: HTSpeaker }) {
  const theme = new Theme();
  theme.randomisze();

  return (
    <div className="mx-5">
      <div className="mt-2 ml-5 mb-5 justify-start flex-auto">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="../speakers">Schedule</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </BreadcrumbList>
        </Breadcrumb>
        <div className="my-3">
          <h1 className="font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-5 mr-3">
            {speaker.name}
          </h1>
        </div>
      </div>
      <div>
        {speaker.affiliations.length > 0 && (
          <div>
            {speaker.affiliations.map((a) => (
              <div
                key={a.organization}
                className="text-sm md:text-base lg:text-lg"
              >
                <p>{a.organization}</p>
                <p>{a.title}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="mt-8">
        <div className="text-sm md:text-base lg:text-lg w-11/12">
          <div className="prose lg:prose-xl">
            <ReactMarkdown>{speaker.description}</ReactMarkdown>
          </div>
        </div>
      </div>
      {speaker.links.length > 0 && (
        <div className="mt-8 text-left">
          <h2 className="font-bold text-base sm:text-lg md:text-xl lg:text-2xl">
            Links
          </h2>
          <ul className="list-disc text-xs sm:text-sm md:text-base lg:text-lg ml-5 mt-2">
            {speaker.links
              .sort((a, b) => a.sort_order - b.sort_order)
              .map((l) => (
                <li key={l.url}>
                  <a href={l.url}>{l.title}</a>
                </li>
              ))}
          </ul>
        </div>
      )}
      {speaker.events.length > 0 && (
        <div className="mt-8 text-left">
          <h2 className="font-bold text-base sm:text-lg md:text-xl lg:text-2xl">
            Events
          </h2>
          <div className="items-center bg-dc-gray w-11/12 mt-2 rounded-lg mb-10 pt-2 pb-2">
            {speaker.events.map((e) => (
              <div
                key={e.id}
                className="ml-3 table mt-2 mb-2 align-middle items-center"
              >
                <div
                  className={`table-cell h-full w-1 md:w-2 bg-[${e.type.color}] rounded-md`}
                />
                <div className="text-left ml-2">
                  <Link href={`/event?id=${e.id}`}>
                    <button type="button" className="text-left">
                      <p className="font-bold text-xs sm:text-sm md:text-base lg:text-lg">
                        {e.title}
                      </p>

                      <p className="text-xs sm:text-sm md:text-sm lg:text-base text-gray-400">
                        {`${eventTime(new Date(e.begin), false)} - ${eventTime(
                          new Date(e.end)
                        )}`}
                      </p>
                      <p className="text-xs sm:text-sm md:text-sm lg:text-base text-gray-400">
                        {e.location.name}
                      </p>
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Speaker;
