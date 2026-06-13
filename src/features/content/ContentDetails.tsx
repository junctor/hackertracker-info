import { ArrowTopRightOnSquareIcon, ShareIcon, UserIcon } from "@heroicons/react/24/outline";
import { useMemo } from "react";
import { Link } from "react-router";

import type { ConferenceManifest } from "@/lib/conferences";
import type {
  ContentEntity,
  EventEntity,
  LocationEntity,
  PersonEntity,
  TagEntity,
} from "@/lib/types/ht-types";

import Markdown from "@/components/markdown/Markdown";
import PageHeader from "@/components/ui/PageHeader";
import { getToneFromColor } from "@/lib/tone";
import { getSafeExternalHref } from "@/lib/url";

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

  const accentTone = getToneFromColor(primarySession?.color);
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

  const sessionCountLabel =
    sessions.length === 0
      ? undefined
      : `${sessions.length} session${sessions.length === 1 ? "" : "s"}`;

  return (
    <article className="ui-container ui-page-content ui-detail-stack">
      <div className={`ui-detail-header-accent ui-tone-${accentTone}`}>
        <span aria-hidden="true" className="ui-accent-rail" />
        <span aria-hidden="true" className="ui-accent-rail-overlay" />

        <PageHeader
          title={content.title}
          resultLabel={sessionCountLabel}
          actions={
            <button
              type="button"
              onClick={handleShare}
              aria-label="Share content link"
              className="ui-icon-plain"
            >
              <ShareIcon className="ui-icon-sm" aria-hidden="true" />
            </button>
          }
        />
      </div>

      {sessions.length > 0 && (
        <section aria-labelledby="sessions-title" className="ui-detail-section">
          <h2 id="sessions-title" className="ui-section-label">
            Sessions
          </h2>
          <ul className="ui-list-stack">
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
        <section aria-labelledby="tags-title" className="ui-detail-section">
          <h2 id="tags-title" className="ui-section-label">
            Tags
          </h2>
          <ul className="ui-chip-list">
            {tags.map((tag) => (
              <li key={tag.id}>
                <Link
                  to={`/${conference.slug}/tag?id=${tag.id}`}
                  className="ui-focus-ring ui-pill-link"
                >
                  <span
                    className={`ui-tag-dot ui-tag-dot-mark ui-tone-${getToneFromColor(tag.colorBackground)}`}
                    aria-hidden="true"
                  />
                  <span className="ui-pill-label ui-clip-text">{tag.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {content.description && (
        <section aria-labelledby="description-title" className="ui-detail-section">
          <h2 id="description-title" className="ui-section-label">
            Description
          </h2>
          <div className="ui-document-body ui-detail-body-panel">
            <Markdown content={content.description} />
          </div>
        </section>
      )}

      {content.links && content.links.length > 0 && (
        <section aria-labelledby="links-title" className="ui-detail-section">
          <h2 id="links-title" className="ui-section-label">
            Links
          </h2>
          <ul className="ui-detail-link-list">
            {content.links.map((l) => {
              const safeHref = getSafeExternalHref(l.url);

              return (
                <li key={l.url}>
                  {safeHref ? (
                    <a
                      href={safeHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ui-focus-ring ui-detail-link-row"
                    >
                      <div className="ui-item-main">
                        <p className="ui-card-title ui-clip-text">{l.label}</p>
                      </div>
                      <ArrowTopRightOnSquareIcon
                        className="ui-icon-xs ui-card-external-icon"
                        aria-hidden="true"
                      />
                    </a>
                  ) : (
                    <div className="ui-detail-link-row ui-detail-link-row-disabled">
                      <div className="ui-item-main">
                        <p className="ui-card-title ui-clip-text">{l.label}</p>
                        <p className="ui-card-meta ui-clip-text">{l.url}</p>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {people.length > 0 && (
        <section aria-labelledby="people-title" className="ui-detail-section">
          <h2 id="people-title" className="ui-section-label">
            People
          </h2>
          <ul className="ui-chip-list">
            {people.map((p) => (
              <li key={p.id}>
                <Link
                  to={`${peopleBasePath}/?id=${p.id}`}
                  className="ui-focus-ring ui-pill-link"
                  title={p.name}
                >
                  <UserIcon className="ui-icon-xs ui-card-external-icon" aria-hidden="true" />
                  <span className="ui-pill-label-narrow ui-clip-text">{p.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
