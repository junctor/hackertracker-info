import React, { useMemo } from "react";
import Link from "next/link";
import Markdown from "../markdown/Markdown";
import type { ProcessedContentId } from "@/types/info";
import { Share2Icon, PersonIcon } from "@radix-ui/react-icons";
import Session from "./Session";
import { Badge } from "../ui/badge";

export default function Content({
  content,
  related_content,
  bookmarks,
}: {
  content: ProcessedContentId;
  related_content: ProcessedContentId[];
  bookmarks: number[];
}) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: content.title,
          url: `/content?id=${content.id}`,
        });
      } catch {
        console.error("Share failed");
      }
    }
  };

  const sessions = useMemo(
    () =>
      [...content.sessions].sort(
        (a, b) =>
          new Date(a.begin_tsz).getTime() - new Date(b.begin_tsz).getTime()
      ),
    [content.sessions]
  );
  const tags = useMemo(
    () =>
      [...content.tags].sort(
        (a, b) => a.sort_order - b.sort_order || a.label.localeCompare(b.label)
      ),
    [content.tags]
  );

  return (
    <div className="max-w-screen-lg mx-auto px-4 py-10 space-y-10">
      {/* Share + Title */}
      <div className="flex items-center justify-between">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white">
          {content.title}
        </h1>
        {typeof navigator !== "undefined" && "share" in navigator && (
          <button
            onClick={handleShare}
            aria-label="Share"
            className="p-2 text-gray-400 hover:text-gray-200 transition"
          >
            <Share2Icon className="h-6 w-6" />
          </button>
        )}
      </div>

      {/* Sessions */}
      {sessions.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold text-gray-200 mb-4">
            Sessions
          </h2>
          <ul className="space-y-4">
            {sessions.map((s) => (
              <Session
                key={s.session_id}
                session={s}
                content={content}
                isBookmarked={bookmarks.includes(s.session_id)}
              />
            ))}
          </ul>
        </section>
      )}

      {/* Tags */}
      <section>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Link
              key={tag.id}
              href={`/tag?id=${tag.id}`}
              className="inline-flex items-center space-x-2 rounded-full bg-gray-700/50 px-3 py-1 text-sm text-gray-200 hover:bg-indigo-600/50 transition"
            >
              <span
                className="block h-3 w-3 rounded-full"
                style={{ backgroundColor: tag.color_background }}
              />
              <span>{tag.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Description */}
      {content.description && (
        <section>
          <h2 className="text-2xl font-semibold text-gray-200 mb-4">
            Description
          </h2>
          <div className="prose prose-invert max-w-none text-gray-300">
            <Markdown content={content.description} />
          </div>
        </section>
      )}

      {/* Links */}
      {content.links.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold text-gray-200 mb-4">Links</h2>
          <ul className="space-y-2">
            {content.links.map((l) => (
              <li key={l.url}>
                <a
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:underline transition"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* People */}
      {content.people.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold text-gray-200 mb-4">People</h2>
          <div className="flex flex-wrap gap-2">
            {content.people.map((p) => (
              <Link
                key={p.person_id}
                href={`/person?id=${p.person_id}`}
                className="inline-flex items-center space-x-2 rounded-full bg-gray-700/50 px-3 py-1 text-sm text-gray-200 hover:bg-indigo-600/50 transition"
              >
                <PersonIcon className="h-4 w-4 text-indigo-300" />
                <span>{p.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Related Content */}
      {related_content.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold text-gray-200 mb-4">
            Related Content
          </h2>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
            {related_content.map((rc) => (
              <li key={rc.id}>
                <Link
                  href={`/content?id=${rc.id}`}
                  className="group block rounded-2xl bg-gray-800 p-6 shadow-lg hover:scale-105 transition-transform"
                >
                  <h3 className="text-lg font-bold text-gray-100 group-hover:text-white">
                    {rc.title}
                  </h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {rc.tags.map((tag) => (
                      <Badge
                        key={tag.id}
                        style={{
                          backgroundColor: tag.color_background,
                          color: tag.color_foreground,
                        }}
                        className="px-2 py-1 text-xs font-medium"
                      >
                        <span className="inline-block max-w-[10rem] md:max-w-[12rem] lg:max-w-[15rem] truncate">
                          {tag.label}
                        </span>
                      </Badge>
                    ))}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
