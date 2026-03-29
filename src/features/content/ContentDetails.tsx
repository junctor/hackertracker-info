import { ShareIcon, UserIcon, ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import React, { useMemo, type CSSProperties } from "react";

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

  const accentStyle = {
    "--event-color": primarySession?.color ?? "#64748b",
  } as CSSProperties;

  const canShare = typeof navigator !== "undefined" && typeof navigator.share === "function";
  const canCopyToClipboard =
    typeof navigator !== "undefined" && typeof navigator.clipboard?.writeText === "function";

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
      if (!canCopyToClipboard || typeof window === "undefined") {
        return;
      }
      await navigator.clipboard.writeText(new URL(url, window.location.origin).toString());
    } catch {
      console.error("Copy link failed");
    }
  };

  return (
    <div className="ui-container ui-page-content space-y-10">
      <header className="flex items-start justify-between gap-4 sm:gap-5">
        <div style={accentStyle} className="relative min-w-0 flex-1 py-1 pl-5 sm:pl-6">
          <span aria-hidden="true" className="ui-accent-rail top-1 bottom-1" />
          <span aria-hidden="true" className="ui-accent-rail-overlay top-1 bottom-1" />
          <h1 className="ui-heading-1">{content.title}</h1>
        </div>

        <button
          type="button"
          onClick={handleShare}
          aria-label="Share content link"
          className="ui-icon-btn ui-focus-ring shrink-0 self-start focus-visible:outline-none"
        >
          <ShareIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      </header>

      {sessions.length > 0 && (
        <section aria-labelledby="sessions-title" className="space-y-4">
          <h2 id="sessions-title" className="ui-heading-2">
            Sessions
          </h2>
          <ul className="space-y-4">
            {sessions.map((s) => (
              <ContentSession
                key={s.id}
                conference={conference}
                session={s}
                contentEntity={content}
                isBookmarked={bookmarkSet.has(s.id)}
                locationName={locationNameById.get(s.locationId)}
              />
            ))}
          </ul>
        </section>
      )}

      {tags.length > 0 && (
        <section aria-labelledby="tags-title" className="space-y-4">
          <h2 id="tags-title" className="ui-heading-2">
            Tags
          </h2>
          <ul className="m-0 flex list-none flex-wrap gap-2.5 p-0">
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

      {content.description && (
        <section aria-labelledby="description-title" className="space-y-4">
          <h2 id="description-title" className="ui-heading-2">
            Description
          </h2>
          <div className="prose prose-invert max-w-none text-slate-300">
            <Markdown content={content.description} />
          </div>
        </section>
      )}

      {content.links && content.links.length > 0 && (
        <section aria-labelledby="links-title" className="space-y-4">
          <h2 id="links-title" className="ui-heading-2">
            Links
          </h2>
          <ul className="space-y-2.5">
            {content.links.map((l) => (
              <li key={l.url}>
                <a
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ui-focus-ring inline-flex min-w-0 items-center gap-2 rounded-md px-1 py-1 text-[#6CCDBB] decoration-[#017FA4]/45 underline-offset-2 transition-colors hover:text-white hover:underline hover:decoration-[#6CCDBB] focus-visible:outline-none"
                >
                  <ArrowTopRightOnSquareIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span className="truncate">{l.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {people.length > 0 && (
        <section aria-labelledby="people-title" className="space-y-4">
          <h2 id="people-title" className="ui-heading-2">
            People
          </h2>
          <ul className="m-0 flex list-none flex-wrap gap-2.5 p-0">
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
