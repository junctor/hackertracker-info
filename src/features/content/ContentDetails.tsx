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
    <div className="ui-container ui-page-content space-y-10">
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

          <h1 className="ui-heading-1">{content.title}</h1>
        </div>

        <div className="shrink-0">
          <button
            type="button"
            onClick={handleShare}
            aria-label="Share content link"
            className="ui-focus-ring rounded-md p-2 text-slate-400 transition hover:text-slate-200 focus-visible:outline-none"
          >
            <ShareIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </header>

      {/* Sessions */}
      {sessions.length > 0 && (
        <section aria-labelledby="sessions-title">
          <h2 id="sessions-title" className="ui-heading-2 mb-4">
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
                  className="ui-focus-ring ui-pill-link focus-visible:outline-none"
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
          <h2 id="description-title" className="ui-heading-2 mb-4">
            Description
          </h2>
          <div className="prose prose-invert max-w-none text-slate-300">
            <Markdown content={content.description} />
          </div>
        </section>
      )}

      {/* Links */}
      {content.links && content.links.length > 0 && (
        <section aria-labelledby="links-title">
          <h2 id="links-title" className="ui-heading-2 mb-4">
            Links
          </h2>
          <ul className="space-y-2">
            {content.links.map((l) => (
              <li key={l.url} className="group">
                <a
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ui-focus-ring inline-flex items-center gap-2 text-[#6CCDBB] decoration-[#017FA4]/45 underline-offset-2 transition-colors hover:text-white hover:underline hover:decoration-[#6CCDBB] focus-visible:outline-none"
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
          <h2 id="people-title" className="ui-heading-2 mb-4">
            People
          </h2>
          <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
            {people.map((p) => (
              <li key={p.id}>
                <Link
                  href={`${peopleBasePath}/?id=${p.id}`}
                  className="ui-focus-ring ui-pill-link focus-visible:outline-none"
                  title={p.name}
                >
                  <UserIcon className="h-4 w-4 text-[#6CCDBB]" aria-hidden="true" />
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
