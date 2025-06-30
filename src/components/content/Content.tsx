import React from "react";
import Link from "next/link";
import Markdown from "../markdown/Markdown";
import type { ProcessedContentId } from "@/types/info";
import { eventTime } from "@/lib/dates";
import cal from "@/lib/cal";
import { CalendarIcon, Share2Icon } from "@radix-ui/react-icons";

interface Props {
  content: ProcessedContentId;
}

export default function Content({ content }: Props) {
  const handleShare = async () => {
    try {
      await navigator.share({
        title: content.title,
        url: `/content/?id=${content.id}`,
      });
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

  return (
    <div className="space-y-8 my-10 mx-5">
      <h1 className="text-4xl font-extrabold text-gray-100">{content.title}</h1>

      {typeof navigator.share === "function" && (
        <div className="hidden md:flex items-center gap-4 mt-2 text-gray-400">
          <Share2Icon
            className="h-6 w-6 cursor-pointer hover:text-gray-200"
            onClick={handleShare}
          />
        </div>
      )}

      {content.sessions.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-200 mb-4">
            Sessions
          </h2>
          <ul className="space-y-4">
            {content.sessions
              .slice()
              .sort(
                (a, b) =>
                  new Date(a.begin_tsz).getTime() -
                  new Date(b.begin_tsz).getTime()
              )
              .map((s) => {
                const begin = new Date(s.begin_tsz);
                const end = new Date(s.end_tsz);
                const sameTime = s.end_tsz === s.begin_tsz;

                return (
                  <li
                    key={s.session_id}
                    className="flex flex-col md:flex-row md:items-center md:justify-between bg-gray-800/50 p-4 rounded-lg shadow hover:bg-gray-700/50 transition"
                  >
                    <div className="flex-1">
                      <div className="text-base text-gray-200 font-medium">
                        {sameTime
                          ? eventTime(begin, true)
                          : `${eventTime(begin, false)} – ${eventTime(end, true)}`}
                      </div>
                      {s.location_name && (
                        <div className="text-sm text-gray-400 mt-1">
                          {s.location_name}
                        </div>
                      )}
                    </div>
                    <div className="mt-3 md:mt-0 md:ml-4">
                      <a
                        href={`data:text/calendar;charset=utf8,${encodeURIComponent(
                          cal(content, s)
                        )}`}
                        download={`DEF_CON_33-${s.session_id}.ics`}
                        title="Download ICS"
                        aria-label={`Download calendar invite for session: ${
                          content.title
                        }`}
                        className="text-gray-400 hover:text-white"
                      >
                        <CalendarIcon className="h-6 w-6" />
                      </a>
                    </div>
                  </li>
                );
              })}
          </ul>
        </div>
      )}

      <div className="mt-4 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {content.tags
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

      {content.description && (
        <div className="prose prose-invert max-w-none text-gray-100">
          <Markdown content={content.description} />
        </div>
      )}

      {content.links.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold text-gray-200 mb-2">Links</h2>
          <ul className="list-disc list-inside space-y-1 text-gray-300">
            {content.links.map((link) => (
              <li key={link.url}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:underline"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {content.people.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold text-gray-200 mb-2">People</h2>
          <ul className="list-disc list-inside space-y-1 text-gray-300">
            {content.people.map((p) => (
              <li key={p.person_id}>
                <Link
                  href={`/person?id=${p.person_id}`}
                  className="text-gray-100 hover:underline"
                >
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
