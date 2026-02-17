import React, { useMemo } from "react";
import Link from "next/link";
import Markdown from "@/components/markdown/Markdown";
import {
  ShareIcon,
  UserIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";
import ContentSession from "./ContentSession";
import type { ConferenceManifest } from "@/lib/conferences";
import type {
  ContentEntity,
  EventEntity,
  LocationEntity,
  PersonEntity,
  TagEntity,
} from "@/lib/types/ht-types";

type Props = {
  content: ContentEntity;
  sessions: EventEntity[];
  locations: LocationEntity[];
  people: PersonEntity[];
  related_content: ContentEntity[];
  tags: TagEntity[];
  bookmarks: number[];
  conference: ConferenceManifest;
};

function safeParseMs(iso: string): number {
  const ms = Date.parse(iso);
  return Number.isFinite(ms) ? ms : Number.MAX_SAFE_INTEGER;
}

export default function ContentDetails(props: Props) {
  const { content, sessions, locations, people, tags, bookmarks, conference } =
    props;

  const peopleBasePath = `/${conference.slug}/people`;
  const contentsBasePath = `/${conference.slug}/content`;

  const locationNameById = useMemo(
    () => new Map<number, string>(locations.map((l) => [l.id, l.name])),
    [locations],
  );

  // Deterministic accent color: earliest session.
  const primarySession = useMemo(() => {
    if (sessions.length === 0) return undefined;
    return [...sessions].sort(
      (a, b) => safeParseMs(a.beginIso) - safeParseMs(b.beginIso),
    )[0];
  }, [sessions]);

  const barStyle = useMemo(
    () =>
      ({
        "--event-color": primarySession?.color ?? "#9ca3af",
      }) as React.CSSProperties,
    [primarySession?.color],
  );

  const canShare =
    typeof navigator !== "undefined" && typeof navigator.share === "function";

  const handleShare = async () => {
    const url = `${contentsBasePath}?id=${content.id}`;

    try {
      if (canShare) {
        await navigator.share({ title: content.title, url });
        return;
      }
    } catch {
      // fall through
    }

    try {
      await navigator.clipboard.writeText(
        new URL(url, window.location.origin).toString(),
      );
    } catch {
      console.error("Copy link failed");
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 space-y-10">
      {/* Title block (bar only here) */}
      <header
        style={barStyle}
        className="flex items-start justify-between gap-4"
      >
        <div className="relative min-w-0 pl-5">
          <span
            aria-hidden="true"
            className="
              pointer-events-none absolute left-0 top-1 bottom-1
              w-[clamp(0.3rem,2vw,0.9rem)]
              rounded-r-md
              bg-(--event-color)
            "
          />
          <span
            aria-hidden="true"
            className="
              pointer-events-none absolute left-0 top-1 bottom-1
              w-[clamp(0.3rem,2vw,0.9rem)]
              rounded-r-md
              bg-linear-to-b from-white/0 to-indigo-600/20
              mix-blend-multiply opacity-60
            "
          />

          <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight">
            {content.title}
          </h1>
        </div>

        <div className="shrink-0">
          <button
            type="button"
            onClick={handleShare}
            aria-label="Share"
            className="
              rounded-md p-2 text-gray-400 transition
              hover:text-gray-200
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500
              focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950
            "
          >
            <ShareIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </header>

      {/* Sessions */}
      {sessions.length > 0 && (
        <section aria-labelledby="sessions-title">
          <h2
            id="sessions-title"
            className="text-2xl font-semibold text-gray-200 mb-4"
          >
            Sessions
          </h2>

          <ul className="space-y-4">
            {sessions.map((s) => (
              <ContentSession
                key={s.id}
                conferenceSlug={conference.slug}
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
      {tags.length > 0 && (
        <section aria-labelledby="tags-title">
          <h2 id="tags-title" className="sr-only">
            Tags
          </h2>

          <ul className="flex flex-wrap gap-2 list-none p-0 m-0">
            {tags.map((tag) => (
              <li key={tag.id}>
                <Link
                  href={`/${conference.slug}/tag?id=${tag.id}`}
                  className="
                    inline-flex items-center gap-2 rounded-full
                    bg-gray-700/50 px-3 py-1 text-sm text-gray-200 transition
                    hover:bg-indigo-600/50
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500
                    focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950
                  "
                >
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: tag.colorBackground }}
                    aria-hidden="true"
                  />
                  <span className="max-w-[16rem] truncate">{tag.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Description */}
      {content.description && (
        <section aria-labelledby="description-title">
          <h2
            id="description-title"
            className="text-2xl font-semibold text-gray-200 mb-4"
          >
            Description
          </h2>
          <div className="prose prose-invert max-w-none text-gray-300">
            <Markdown content={content.description} />
          </div>
        </section>
      )}

      {/* Links */}
      {content.links && content.links.length > 0 && (
        <section aria-labelledby="links-title">
          <h2
            id="links-title"
            className="text-2xl font-semibold text-gray-200 mb-4"
          >
            Links
          </h2>
          <ul className="space-y-2">
            {content.links.map((l) => (
              <li key={l.url} className="group">
                <a
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    inline-flex items-center gap-2
                    text-indigo-300 underline-offset-2 decoration-indigo-500/40
                    transition-colors
                    hover:text-indigo-200 hover:decoration-indigo-400 hover:underline
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500
                    focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950
                  "
                >
                  <ArrowTopRightOnSquareIcon
                    className="h-4 w-4 shrink-0"
                    aria-hidden="true"
                  />
                  <span className="truncate">{l.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* People */}
      {people.length > 0 && (
        <section aria-labelledby="people-title">
          <h2
            id="people-title"
            className="text-2xl font-semibold text-gray-200 mb-4"
          >
            People
          </h2>
          <ul className="flex flex-wrap gap-2 list-none p-0 m-0">
            {people.map((p) => (
              <li key={p.id}>
                <Link
                  href={`${peopleBasePath}/?id=${p.id}`}
                  className="
                    inline-flex items-center gap-2 rounded-full
                    bg-gray-700/50 px-3 py-1 text-sm text-gray-200 transition
                    hover:bg-indigo-600/50
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500
                    focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950
                  "
                  title={p.name}
                >
                  <UserIcon
                    className="h-4 w-4 text-indigo-300"
                    aria-hidden="true"
                  />
                  <span className="truncate max-w-56">{p.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
