import { ShareIcon, UserIcon, ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import React, { useMemo } from "react";

import type { ConferenceManifest } from "@/lib/conferences";
import type {
  ContentEntity,
  EventEntity,
  LocationEntity,
  PersonEntity,
  TagEntity,
} from "@/lib/types/ht-types";

import Markdown from "@/components/markdown/Markdown";

import ContentSession from "./ContentSession";

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
  const { content, sessions, locations, people, tags, bookmarks, conference } = props;

  const peopleBasePath = `/${conference.slug}/people`;
  const contentsBasePath = `/${conference.slug}/content`;

  const locationNameById = useMemo(
    () => new Map<number, string>(locations.map((l) => [l.id, l.name])),
    [locations],
  );
  const bookmarkSet = useMemo(() => new Set(bookmarks), [bookmarks]);

  // Deterministic accent color from the earliest session without sorting.
  const primarySession = useMemo(() => {
    if (sessions.length === 0) return undefined;
    let earliest = sessions[0];
    let earliestMs = safeParseMs(earliest.beginIso);
    for (let i = 1; i < sessions.length; i += 1) {
      const session = sessions[i];
      const ms = safeParseMs(session.beginIso);
      if (ms < earliestMs) {
        earliest = session;
        earliestMs = ms;
      }
    }
    return earliest;
  }, [sessions]);

  const barStyle = {
    "--event-color": primarySession?.color ?? "#9ca3af",
  } as React.CSSProperties;

  const canShare = typeof navigator !== "undefined" && typeof navigator.share === "function";

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
      await navigator.clipboard.writeText(new URL(url, window.location.origin).toString());
    } catch {
      console.error("Copy link failed");
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-10 px-4 py-10">
      {/* Title block (bar only here) */}
      <header style={barStyle} className="flex items-start justify-between gap-4">
        <div className="relative min-w-0 pl-5">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-1 bottom-1 left-0 w-[clamp(0.3rem,2vw,0.9rem)] rounded-r-md bg-(--event-color)"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-1 bottom-1 left-0 w-[clamp(0.3rem,2vw,0.9rem)] rounded-r-md bg-linear-to-b from-white/0 to-indigo-600/20 opacity-60 mix-blend-multiply"
          />

          <h1 className="text-4xl leading-tight font-extrabold tracking-tight text-white md:text-5xl">
            {content.title}
          </h1>
        </div>

        <div className="shrink-0">
          <button
            type="button"
            onClick={handleShare}
            aria-label="Share content link"
            className="rounded-md p-2 text-gray-400 transition hover:text-gray-200 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 focus-visible:outline-none"
          >
            <ShareIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </header>

      {/* Sessions */}
      {sessions.length > 0 && (
        <section aria-labelledby="sessions-title">
          <h2 id="sessions-title" className="mb-4 text-2xl font-semibold text-gray-200">
            Sessions
          </h2>

          <ul className="space-y-4">
            {sessions.map((s) => (
              <ContentSession
                key={s.id}
                conferenceSlug={conference.slug}
                session={s}
                content={content}
                isBookmarked={bookmarkSet.has(s.id)}
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

          <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
            {tags.map((tag) => (
              <li key={tag.id}>
                <Link
                  href={`/${conference.slug}/tag?id=${tag.id}`}
                  className="inline-flex items-center gap-2 rounded-full bg-gray-700/50 px-3 py-1 text-sm text-gray-200 transition hover:bg-indigo-600/50 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 focus-visible:outline-none"
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
          <h2 id="description-title" className="mb-4 text-2xl font-semibold text-gray-200">
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
          <h2 id="links-title" className="mb-4 text-2xl font-semibold text-gray-200">
            Links
          </h2>
          <ul className="space-y-2">
            {content.links.map((l) => (
              <li key={l.url} className="group">
                <a
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-indigo-300 decoration-indigo-500/40 underline-offset-2 transition-colors hover:text-indigo-200 hover:underline hover:decoration-indigo-400 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 focus-visible:outline-none"
                >
                  <ArrowTopRightOnSquareIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
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
          <h2 id="people-title" className="mb-4 text-2xl font-semibold text-gray-200">
            People
          </h2>
          <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
            {people.map((p) => (
              <li key={p.id}>
                <Link
                  href={`${peopleBasePath}/?id=${p.id}`}
                  className="inline-flex items-center gap-2 rounded-full bg-gray-700/50 px-3 py-1 text-sm text-gray-200 transition hover:bg-indigo-600/50 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 focus-visible:outline-none"
                  title={p.name}
                >
                  <UserIcon className="h-4 w-4 text-indigo-300" aria-hidden="true" />
                  <span className="max-w-56 truncate">{p.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
