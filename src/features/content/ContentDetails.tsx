import { ArrowTopRightOnSquareIcon, ShareIcon, UserIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useMemo, type CSSProperties } from "react";

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
  const sharePath = `${contentsBasePath}/?id=${content.id}`;
  const shareUrl =
    typeof window === "undefined"
      ? sharePath
      : new URL(sharePath, window.location.origin).toString();

  const canShare = typeof navigator !== "undefined" && typeof navigator.share === "function";
  const canCopyToClipboard =
    typeof navigator !== "undefined" && typeof navigator.clipboard?.writeText === "function";

  const handleShare = async () => {
    try {
      if (canShare) {
        await navigator.share({ title: content.title, url: shareUrl });
        return;
      }
    } catch {
      // fall through
    }

    try {
      if (!canCopyToClipboard) {
        return;
      }
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      console.error("Copy link failed");
    }
  };

  return (
    <div className="ui-container ui-page-content space-y-10">
      <header style={accentStyle} className="ui-card relative overflow-hidden">
        <span aria-hidden="true" className="ui-accent-rail" />
        <span aria-hidden="true" className="ui-accent-rail-overlay" />

        <div className="relative z-10 flex flex-col gap-6 px-5 py-5 pl-6 sm:px-6 sm:py-6 sm:pl-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1">
              <h1 className="ui-heading-1">{content.title}</h1>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={handleShare}
                aria-label="Share content link"
                className="ui-icon-btn ui-focus-ring shrink-0 self-start focus-visible:outline-none"
              >
                <ShareIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {sessions.length > 0 && (
        <section aria-labelledby="sessions-title" className="space-y-4">
          <h2
            id="sessions-title"
            className="text-sm font-semibold tracking-[0.02em] text-slate-300"
          >
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
        <section aria-labelledby="tags-title" className="space-y-3">
          <h2 id="tags-title" className="text-sm font-semibold tracking-[0.02em] text-slate-300">
            Tags
          </h2>
          <div className="ui-card px-4 py-4 sm:px-5">
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
          </div>
        </section>
      )}

      {content.description && (
        <section aria-labelledby="description-title" className="space-y-4">
          <h2
            id="description-title"
            className="text-sm font-semibold tracking-[0.02em] text-slate-300"
          >
            Description
          </h2>
          <div className="ui-card px-5 py-5 sm:px-6">
            <div className="prose prose-invert prose-headings:text-slate-100 prose-p:leading-7 prose-a:ui-link max-w-none text-slate-300">
              <Markdown content={content.description} />
            </div>
          </div>
        </section>
      )}

      {content.links && content.links.length > 0 && (
        <section aria-labelledby="links-title" className="space-y-4">
          <h2 id="links-title" className="text-sm font-semibold tracking-[0.02em] text-slate-300">
            Links
          </h2>
          <ul className="space-y-2.5">
            {content.links.map((l) => (
              <li key={l.url}>
                <a
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ui-focus-ring ui-card ui-card-interactive group flex min-w-0 items-center justify-between gap-4 px-4 py-3.5 focus-visible:outline-none sm:px-5"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-[#6CCDBB] transition-colors group-hover:text-white sm:text-[0.95rem]">
                      {l.label}
                    </p>
                  </div>
                  <ArrowTopRightOnSquareIcon
                    className="h-4 w-4 shrink-0 text-[#6CCDBB] transition-colors group-hover:text-white"
                    aria-hidden="true"
                  />
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {people.length > 0 && (
        <section aria-labelledby="people-title" className="space-y-3">
          <h2 id="people-title" className="text-sm font-semibold tracking-[0.02em] text-slate-300">
            People
          </h2>
          <div className="ui-card px-4 py-4 sm:px-5">
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
          </div>
        </section>
      )}
    </div>
  );
}
