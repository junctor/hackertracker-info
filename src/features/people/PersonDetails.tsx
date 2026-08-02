import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import { UserIcon } from "@heroicons/react/24/solid";
import { useEffect, useMemo, useState } from "react";

import Image from "@/components/Image";
import Markdown from "@/components/markdown/Markdown";
import PageHeader from "@/components/ui/PageHeader";
import { ConferenceManifest } from "@/lib/conferences";
import { contentPath } from "@/lib/routes";
import { getBookmarks } from "@/lib/storage";
import { PersonDetailView } from "@/lib/types/ht-types";
import { getSafeExternalHref, getSafeImageHref } from "@/lib/url";

import ContentSession from "../content/ContentSession";
import { getPersonInitials } from "./personInitials";

type Props = {
  person: PersonDetailView["person"];
  sessions: PersonDetailView["sessions"];
  conference: ConferenceManifest;
};
type PersonLinkView = NonNullable<PersonDetailView["person"]["links"]>[number] & {
  title: string;
  url: string;
};

const PERSON_ACCENT_CLASS_NAMES = [
  "ui-person-accent-0",
  "ui-person-accent-1",
  "ui-person-accent-2",
  "ui-person-accent-3",
  "ui-person-accent-4",
];

type AvatarRecord = {
  avatar?: { url?: string | null } | string | null;
  avatarUrl?: string | null;
  image?: string | null;
  imageUrl?: string | null;
  name?: string | null;
};

function getTrimmedText(value?: string | null): string {
  return typeof value === "string" ? value.trim() : "";
}

function getPersonName(name?: string | null): string {
  return getTrimmedText(name).replace(/\s+/g, " ");
}

function getDisplayName(name?: string | null): string {
  return getPersonName(name) || "Unknown person";
}

function getOptionalText(value?: string | null): string | null {
  return getTrimmedText(value) || null;
}

function getPersonAvatarUrl(person: AvatarRecord): string | null {
  const nestedAvatar = person.avatar;
  const nestedAvatarUrl =
    typeof nestedAvatar === "string"
      ? nestedAvatar
      : nestedAvatar && typeof nestedAvatar.url === "string"
        ? nestedAvatar.url
        : null;

  const candidates = [person.avatarUrl, person.imageUrl, person.image, nestedAvatarUrl];

  for (const candidate of candidates) {
    const normalized = getTrimmedText(candidate);
    const safeUrl = getSafeImageHref(normalized);
    if (safeUrl) return safeUrl;
  }

  return null;
}

function getPersonAccentClassName(name?: string | null): string {
  const normalizedName = getDisplayName(name);
  let hash = 0;
  for (const char of normalizedName) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }
  return (
    PERSON_ACCENT_CLASS_NAMES[hash % PERSON_ACCENT_CLASS_NAMES.length] ??
    PERSON_ACCENT_CLASS_NAMES[0]
  );
}

export default function PersonDetails({ person, sessions, conference }: Props) {
  const [hasAvatarError, setHasAvatarError] = useState(false);
  const personName = getDisplayName(person.name);
  const personInitials = getPersonInitials(person.name);
  const personAvatarUrl = getPersonAvatarUrl(person);
  const personPronouns = getOptionalText(person.pronouns);
  const personDescription = getOptionalText(person.description);
  const accentClassName = getPersonAccentClassName(person.name);
  const headerAccentClassName = accentClassName;
  const affiliations = useMemo(
    () =>
      (person.affiliations ?? [])
        .map((affiliation): { organization: string | null; title: string | null } => ({
          organization: getOptionalText(affiliation),
          title: null,
        }))
        .filter(
          (affiliation): affiliation is { organization: string | null; title: string | null } =>
            Boolean(affiliation.organization || affiliation.title),
        ),
    [person.affiliations],
  );
  const bookmarkSet = useMemo(() => new Set(getBookmarks()), []);
  const sortedLinks = useMemo(
    () =>
      [...(person.links ?? [])]
        .map((link) => ({
          ...link,
          title: getOptionalText(link.label) ?? getOptionalText(link.url) ?? "External link",
          url: getSafeExternalHref(link.url),
        }))
        .filter((link): link is PersonLinkView => Boolean(link.url)),
    [person.links],
  );

  useEffect(() => {
    setHasAvatarError(false);
  }, [personAvatarUrl]);

  return (
    <article className="ui-container ui-page-content ui-detail-stack ui-detail-page">
      <div className={`ui-detail-header-accent ${headerAccentClassName}`}>
        <span aria-hidden="true" className="ui-accent-rail" />
        <span aria-hidden="true" className="ui-accent-rail-overlay" />

        <PageHeader
          title={
            <div className="ui-person-details-row">
              <div
                className={`ui-person-avatar ui-inset-highlight ui-person-avatar-large ${accentClassName}`}
              >
                {personAvatarUrl && !hasAvatarError ? (
                  <Image
                    src={personAvatarUrl}
                    alt={personName}
                    fillContainer
                    sizes="(min-width: 640px) 112px, 96px"
                    className="ui-image-cover"
                    onError={() => setHasAvatarError(true)}
                  />
                ) : (
                  <>
                    <div aria-hidden="true" className="ui-avatar-fallback-glow ui-fill-layer" />
                    {personInitials ? (
                      <span className="ui-layer-above">{personInitials}</span>
                    ) : (
                      <UserIcon className="ui-icon-lg ui-layer-above" aria-hidden="true" />
                    )}
                  </>
                )}
              </div>

              <div className="ui-person-header-copy">
                <div className="ui-person-title-line">
                  <div className="ui-person-title-row">
                    <h1 className="ui-heading-1">{personName}</h1>
                    {personPronouns ? (
                      <span className="ui-person-pronouns">{personPronouns}</span>
                    ) : null}
                  </div>

                  {affiliations.length > 0 ? (
                    <ul className="ui-person-affiliations">
                      {affiliations.map((affiliation) => (
                        <li
                          key={`${affiliation.organization ?? "organization"}:${affiliation.title ?? "title"}`}
                        >
                          {affiliation.title ? (
                            <span className="ui-muted-strong">{affiliation.title}</span>
                          ) : null}
                          {affiliation.title && affiliation.organization ? (
                            <span className="ui-inline-separator">@</span>
                          ) : null}
                          {affiliation.organization ? (
                            <span>{affiliation.organization}</span>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </div>
            </div>
          }
        />
      </div>

      {personDescription && (
        <section aria-labelledby="about-title" className="ui-detail-section">
          <h2 id="about-title" className="ui-section-label">
            About
          </h2>
          <div className="ui-document-body ui-detail-body-panel">
            <Markdown content={personDescription} />
          </div>
        </section>
      )}

      {sortedLinks.length > 0 ? (
        <section aria-labelledby="person-links-title" className="ui-detail-section">
          <h2 id="person-links-title" className="ui-section-label">
            Links
          </h2>
          <ul className="ui-detail-link-list">
            {sortedLinks.map((link) => (
              <li key={link.url}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ui-focus-ring ui-detail-link-row"
                >
                  <div className="ui-item-main">
                    <p className="ui-card-title ui-clip-text">{link.title}</p>
                  </div>
                  <ArrowTopRightOnSquareIcon
                    className="ui-icon-xs ui-card-external-icon"
                    aria-hidden="true"
                  />
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {sessions.length > 0 && (
        <section aria-labelledby="sessions-title" className="ui-detail-section">
          <h2 id="sessions-title" className="ui-section-label">
            Sessions
          </h2>
          <ul className="ui-list-stack">
            {sessions.map((session) => (
              <ContentSession
                key={session.id}
                conference={conference}
                session={session}
                isBookmarked={bookmarkSet.has(session.id)}
                accentColor={session.color}
                href={contentPath(conference, session.contentId)}
                title={session.title}
              />
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
