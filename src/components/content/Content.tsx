import React from "react";
import Link from "next/link";
import Markdown from "../markdown/Markdown";
import type { ProcessedContentId } from "@/types/info";
import { Share2Icon } from "@radix-ui/react-icons";
import Session from "./Session";

interface Props {
  content: ProcessedContentId;
  bookmarks: number[];
}

export default function Content({ content, bookmarks }: Props) {
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
    <article className="relative my-5 mx-5">
      {/* header with share */}
      <div className="pt-4 pb-2 flex items-center justify-end">
        {typeof navigator.share === "function" && (
          <button
            onClick={handleShare}
            aria-label="Share this content"
            className="text-gray-400 hover:text-gray-200 p-1"
          >
            <Share2Icon className="h-6 w-6" />
          </button>
        )}
      </div>

      <header>
        <h1 className="mt-4 text-4xl font-extrabold text-gray-100">
          {content.title}
        </h1>
      </header>

      {content.sessions.length > 0 && (
        <section className="mt-8">
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
              .map((s) => (
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

      <section className="mt-4">
        <div className="flex flex-wrap gap-2">
          {content.tags
            .sort((a, b) =>
              a.sort_order !== b.sort_order
                ? a.sort_order - b.sort_order
                : a.label.localeCompare(b.label)
            )
            .map((tag) => (
              <Link
                key={tag.id}
                href={`/tag?id=${tag.id}`}
                className="inline-flex items-center bg-gray-700/50 hover:bg-indigo-600/50 rounded-full px-3 py-1 space-x-2 transition"
              >
                <span
                  className="rounded-full h-3 w-3 md:h-4 md:w-4 flex-none"
                  style={{ backgroundColor: tag.color_background }}
                />
                <p className="text-xs md:text-sm text-gray-200">{tag.label}</p>
              </Link>
            ))}
        </div>
      </section>

      {content.description && (
        <section className="mt-8 prose prose-invert max-w-none text-gray-100">
          <Markdown content={content.description} />
        </section>
      )}

      {content.links.length > 0 && (
        <section className="mt-8">
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
        </section>
      )}

      {content.people.length > 0 && (
        <section className="mt-8">
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
        </section>
      )}
    </article>
  );
}
