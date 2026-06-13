import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import { UserIcon } from "@heroicons/react/24/solid";
import { useEffect, useMemo, useState } from "react";

import Image from "@/components/Image";
import Markdown from "@/components/markdown/Markdown";
import PageHeader from "@/components/ui/PageHeader";
import { ConferenceManifest } from "@/lib/conferences";
import { getBookmarks } from "@/lib/storage";
import { getToneFromColor } from "@/lib/tone";
import { ContentEntity, EventEntity, LocationEntity, PersonEntity } from "@/lib/types/ht-types";
import { getSafeExternalHref } from "@/lib/url";

import ContentSession from "../content/ContentSession";
import { getPersonInitials } from "./personInitials";

type Props = {
  person: PersonEntity;
  events: EventEntity[];
  locations: LocationEntity[];
  conference: ConferenceManifest;
};
type PersonLinkView = NonNullable<PersonEntity["links"]>[number] & {
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
    if (normalized) return normalized;
  }

  return null;
}

function safeParseMs(value?: string | null): number {
  if (!value) return Number.MAX_SAFE_INTEGER;
  const ms = Date.parse(value);
  return Number.isFinite(ms) ? ms : Number.MAX_SAFE_INTEGER;
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

export default function PersonDetails({ person, events, locations, conference }: Props) {
  const [hasAvatarError, setHasAvatarError] = useState(false);
  const contentsBasePath = `/${conference.slug}/content`;
  const personName = getDisplayName(person.name);
  const personInitials = getPersonInitials(person.name);
  const personAvatarUrl = getPersonAvatarUrl(person);
  const personPronouns = getOptionalText(person.pronouns);
  const personDescription = getOptionalText(person.description);
  const locationNameById = useMemo(() => {
    const entries = locations.map(
      (location) => [location.id, getTrimmedText(location.name) || "Location TBD"] as const,
    );
    return new Map<number, string>(entries);
  }, [locations]);
  const sortedEvents = useMemo(
    () => events.toSorted((a, b) => safeParseMs(a.beginIso) - safeParseMs(b.beginIso)),
    [events],
  );
  const accentClassName = getPersonAccentClassName(person.name);
  const primaryEventColor = sortedEvents[0]?.color;
  const headerAccentClassName = primaryEventColor
    ? `ui-tone-${getToneFromColor(primaryEventColor)}`
    : accentClassName;
  const affiliations = useMemo(
    () =>
      (person.affiliations ?? [])
        .map((affiliation) => ({
          organization: getOptionalText(affiliation.organization),
          title: getOptionalText(affiliation.title),
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
          title: getOptionalText(link.title) ?? getOptionalText(link.url) ?? "External link",
          url: getSafeExternalHref(link.url),
        }))
        .filter((link): link is PersonLinkView => Boolean(link.url))
        .toSorted((a, b) => a.sort_order - b.sort_order),
    [person.links],
  );
  const contentEntityByEventId = useMemo(() => {
    const entries = sortedEvents.map(
      (event) =>
        [
          event.id,
          {
            id: event.contentId,
            title: event.title,
            tagIds: [],
          } satisfies ContentEntity,
        ] as const,
    );
    return new Map<number, ContentEntity>(entries);
  }, [sortedEvents]);

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
                      <span className="ui-meta-pill ui-person-pronouns">{personPronouns}</span>
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

      {sortedEvents.length > 0 && (
        <section aria-labelledby="events-title" className="ui-detail-section">
          <h2 id="events-title" className="ui-section-label">
            Sessions
          </h2>
          <ul className="ui-list-stack">
            {sortedEvents.map((event) => {
              const contentEntity = contentEntityByEventId.get(event.id);
              if (!contentEntity) return null;

              return (
                <ContentSession
                  key={event.id}
                  conference={conference}
                  session={event}
                  contentEntity={contentEntity}
                  isBookmarked={bookmarkSet.has(event.id)}
                  locationName={locationNameById.get(event.locationId)}
                  href={`${contentsBasePath}/?id=${event.contentId}`}
                  title={event.title}
                />
              );
            })}
          </ul>
        </section>
      )}
    </article>
  );
}
