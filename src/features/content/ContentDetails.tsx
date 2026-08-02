import { ArrowTopRightOnSquareIcon, ShareIcon, UserIcon } from "@heroicons/react/24/outline";
import { useId, useMemo, useState } from "react";
import { Link } from "react-router";

import type { ConferenceManifest } from "@/lib/conferences";
import type { ContentCardsView, ContentDetailView } from "@/lib/types/ht-types/views";

import Image from "@/components/Image";
import Markdown from "@/components/markdown/Markdown";
import PageHeader from "@/components/ui/PageHeader";
import { getAccentStyle } from "@/lib/color";
import { useTransientStatus } from "@/lib/hooks/useTransientStatus";
import { contentPath, personPath, tagPath } from "@/lib/routes";
import { buildAbsoluteAppUrlFromPath, getSafeExternalHref } from "@/lib/url";

import ContentCard from "./ContentCard";
import { getVisibleContentLogoUrl } from "./contentLogo";
import ContentSession from "./ContentSession";

type Props = {
  accentColor?: string;
  content: ContentDetailView["content"];
  sessions: ContentDetailView["sessions"];
  people: ContentDetailView["people"];
  tags: ContentDetailView["tags"];
  relatedContent: ContentCardsView;
  bookmarks: number[];
  conference: ConferenceManifest;
};

export default function ContentDetails(props: Props) {
  const { accentColor, content, sessions, people, tags, relatedContent, bookmarks, conference } =
    props;
  const shareStatusId = useId();
  const [shareStatus, setShareStatus] = useTransientStatus();
  const [failedLogoUrl, setFailedLogoUrl] = useState<string | null>(null);

  const visibleLogoUrl = getVisibleContentLogoUrl(content.logoUrl, failedLogoUrl);

  const bookmarkSet = useMemo(() => new Set(bookmarks), [bookmarks]);
  const accentStyle = getAccentStyle(accentColor);
  const shareUrl = buildAbsoluteAppUrlFromPath(contentPath(conference, content.id));
  const detailHeaderClassName = [
    "ui-detail-header-accent",
    "ui-detail-header-inline",
    "ui-content-detail-header",
    visibleLogoUrl ? "ui-content-detail-header-with-media" : "ui-content-detail-header-no-media",
  ].join(" ");

  const canShare = typeof navigator !== "undefined" && typeof navigator.share === "function";
  const canCopyToClipboard =
    typeof navigator !== "undefined" && typeof navigator.clipboard?.writeText === "function";

  const handleShare = async () => {
    try {
      if (canShare) {
        await navigator.share({ title: content.title, url: shareUrl });
        setShareStatus("Shared.");
        return;
      }
    } catch {
      // fall through
    }

    try {
      if (!canCopyToClipboard) {
        setShareStatus("Copy unavailable.");
        return;
      }
      await navigator.clipboard.writeText(shareUrl);
      setShareStatus("Link copied.");
    } catch {
      setShareStatus("Could not copy link.");
    }
  };

  const sessionCountLabel =
    sessions.length === 0
      ? undefined
      : `${sessions.length} session${sessions.length === 1 ? "" : "s"}`;

  return (
    <article className="ui-container ui-page-content ui-detail-stack ui-detail-page">
      <div style={accentStyle} className={detailHeaderClassName}>
        <span aria-hidden="true" className="ui-accent-rail" />
        <span aria-hidden="true" className="ui-accent-rail-overlay" />

        <PageHeader
          title={content.title}
          resultLabel={sessionCountLabel}
          actionsInline
          media={
            visibleLogoUrl ? (
              <div aria-label={`${content.title} logo`} className="ui-content-detail-header-media">
                <Image
                  src={visibleLogoUrl}
                  alt=""
                  className="ui-image-contain ui-content-detail-logo"
                  onError={() => setFailedLogoUrl(visibleLogoUrl)}
                />
              </div>
            ) : null
          }
          actions={
            <>
              <button
                type="button"
                onClick={handleShare}
                aria-label={`Share link to ${content.title}`}
                aria-describedby={shareStatus ? shareStatusId : undefined}
                className="ui-icon-plain"
              >
                <ShareIcon className="ui-icon-sm" aria-hidden="true" />
              </button>
              {shareStatus ? (
                <span id={shareStatusId} role="status" className="ui-action-status">
                  {shareStatus}
                </span>
              ) : null}
            </>
          }
        />
      </div>

      {tags.length > 0 && (
        <section aria-labelledby="tags-title" className="ui-detail-section">
          <h2 id="tags-title" className="ui-section-label">
            Tags
          </h2>
          <ul className="ui-chip-list-tight">
            {tags.map((tag) => (
              <li key={tag.id}>
                <Link
                  to={tagPath(conference, tag.id)}
                  aria-label={`Show schedule for ${tag.label}`}
                  className="ui-focus-ring ui-tag-chip ui-tag-chip-strong ui-tag-link ui-tag-link-detail"
                  style={{ backgroundColor: tag.colorBackground, color: tag.colorForeground }}
                >
                  {tag.label}
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
                isBookmarked={bookmarkSet.has(s.id)}
                accentColor={s.color || accentColor}
                calendarDescription={content.description}
                calendarTitle={content.title}
              />
            ))}
          </ul>
        </section>
      )}

      {people.length > 0 && (
        <section aria-labelledby="people-title" className="ui-detail-section">
          <h2 id="people-title" className="ui-section-label">
            People
          </h2>
          <ul className="ui-detail-identity-list">
            {people.map((p) => (
              <li key={p.id}>
                <Link
                  to={personPath(conference, p.id)}
                  className="ui-focus-ring ui-detail-identity-link"
                  title={p.name}
                >
                  <UserIcon className="ui-icon-xs ui-detail-identity-icon" aria-hidden="true" />
                  <span className="ui-detail-identity-label">{p.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {relatedContent.length > 0 && (
        <section aria-labelledby="related-content-title" className="ui-detail-section">
          <h2 id="related-content-title" className="ui-section-label">
            Related Content
          </h2>
          <ul className="ui-list-stack-sm">
            {relatedContent.map((item) => (
              <li key={item.id}>
                <ContentCard conference={conference} item={item} />
              </li>
            ))}
          </ul>
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
    </article>
  );
}
