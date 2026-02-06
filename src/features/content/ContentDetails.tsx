import { useMemo } from "react";
import Link from "next/link";
import Markdown from "@/components/markdown/Markdown";
import { ShareIcon, UserIcon } from "@heroicons/react/24/outline";
import ContentSession from "./ContentSession";
import { ConferenceManifest } from "@/lib/conferences";
import {
  ContentEntity,
  EventEntity,
  LocationEntity,
  PersonEntity,
  TagEntity,
} from "@/lib/types/ht-types";

export default function ContentDetails({
  content,
  sessions,
  locations,
  people,
  related_content: _relatedContent,
  tags,
  bookmarks,
  conference,
}: {
  content: ContentEntity;
  sessions: EventEntity[];
  locations: LocationEntity[];
  people: PersonEntity[];
  related_content: ContentEntity[];
  tags: TagEntity[];
  bookmarks: number[];
  conference: ConferenceManifest;
}) {
  const peopleBasePath = `/${conference.slug}/people`;
  const contentsBasePath = `/${conference.slug}/content`;

  const locationNameById = useMemo(() => {
    const entries = locations.map(
      (location) => [location.id, location.name] as [number, string],
    );
    return new Map<number, string>(entries);
  }, [locations]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: content.title,
          url: `${contentsBasePath}?id=${content.id}`,
        });
      } catch {
        console.error("Share failed");
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
      {/* Share + Title */}
      <div className="flex items-center justify-between">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white">
          {content.title}
        </h1>
        {typeof navigator !== "undefined" && "share" in navigator && (
          <button
            type="button"
            onClick={handleShare}
            aria-label="Share"
            className="rounded-md p-2 text-gray-400 transition hover:text-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950"
          >
            <ShareIcon className="h-6 w-6" aria-hidden="true" />
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
              <ContentSession
                key={s.id}
                session={s}
                content={content}
                isBookmarked={bookmarks.includes(s.id)}
                locationName={locationNameById.get(s.locationId)}
                timezone={conference.timezone}
              />
            ))}
          </ul>
        </section>
      )}

      {/* Tags */}
      <section>
        <ul className="flex flex-wrap gap-2 list-none p-0 m-0">
          {tags.map((tag) => (
            <li key={tag.id}>
              <Link
                href={`/${conference.slug}/tag?id=${tag.id}`}
                className="inline-flex items-center space-x-2 rounded-full bg-gray-700/50 px-3 py-1 text-sm text-gray-200 transition hover:bg-indigo-600/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950"
              >
                <span
                  className="block h-3 w-3 rounded-full"
                  style={{ backgroundColor: tag.colorBackground }}
                />
                <span>{tag.label}</span>
              </Link>
            </li>
          ))}
        </ul>
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
      {content.links && content.links.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold text-gray-200 mb-4">Links</h2>
          <ul className="space-y-2">
            {content.links.map((l) => (
              <li key={l.url}>
                <a
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 transition hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* People */}
      {people.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold text-gray-200 mb-4">People</h2>
          <ul className="flex flex-wrap gap-2 list-none p-0 m-0">
            {people.map((p) => (
              <li key={p.id}>
                <Link
                  href={`${peopleBasePath}/?id=${p.id}`}
                  className="inline-flex items-center space-x-2 rounded-full bg-gray-700/50 px-3 py-1 text-sm text-gray-200 transition hover:bg-indigo-600/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950"
                >
                  <UserIcon className="h-4 w-4 text-indigo-300" aria-hidden />
                  <span>{p.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Related Content */}
      {/* {related_content.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold text-gray-200 mb-4">
            Related Content
          </h2>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
            {related_content.map((rc) => (
              <li key={rc.id}>
                <Link
                  href={`${contentsBasePath}?id=${rc.id}`}
                  className="group block rounded-2xl bg-gray-800 p-6 shadow-lg hover:scale-105 transition-transform"
                >
                  <h3 className="text-lg font-bold text-gray-100 group-hover:text-white">
                    {rc.title}
                  </h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {rc.tags.map((tag) => (
                      <span
                        key={tag.id}
                        style={{
                          backgroundColor: tag.color_background,
                          color: tag.color_foreground,
                        }}
                        className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium"
                      >
                        <span className="inline-block max-w-[10rem] md:max-w-[12rem] lg:max-w-[15rem] truncate">
                          {tag.label}
                        </span>
                      </span>
                    ))}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )} */}
    </div>
  );
}
