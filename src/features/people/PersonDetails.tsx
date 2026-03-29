import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useMemo, type CSSProperties } from "react";

import Markdown from "@/components/markdown/Markdown";
import { ConferenceManifest } from "@/lib/conferences";
import { getBookmarks } from "@/lib/storage";
import { ContentEntity, EventEntity, LocationEntity, PersonEntity } from "@/lib/types/ht-types";

import ContentSession from "../content/ContentSession";

type Props = {
  person: PersonEntity;
  events: EventEntity[];
  locations: LocationEntity[];
  conference: ConferenceManifest;
};

const PERSON_ACCENT_COLORS = ["#017FA4", "#2D7FF9", "#0F766E", "#7C3AED", "#C2410C", "#0E7490"];

function safeParseMs(value: string): number {
  const ms = Date.parse(value);
  return Number.isFinite(ms) ? ms : Number.MAX_SAFE_INTEGER;
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function getPersonAccent(name: string): string {
  let hash = 0;
  for (const char of name) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }
  return PERSON_ACCENT_COLORS[hash % PERSON_ACCENT_COLORS.length] ?? PERSON_ACCENT_COLORS[0];
}

export default function PersonDetails({ person, events, locations, conference }: Props) {
  const contentsBasePath = `/${conference.slug}/content`;
  const locationNameById = useMemo(() => {
    const entries = locations.map((location) => [location.id, location.name] as const);
    return new Map<number, string>(entries);
  }, [locations]);
  const sortedEvents = useMemo(
    () => events.toSorted((a, b) => safeParseMs(a.beginIso) - safeParseMs(b.beginIso)),
    [events],
  );
  const primaryEventColor = sortedEvents[0]?.color ?? getPersonAccent(person.name);
  const accentStyle = {
    "--event-color": primaryEventColor,
  } as CSSProperties;
  const affiliations = person.affiliations ?? [];
  const bookmarkSet = useMemo(() => new Set(getBookmarks()), []);
  const sortedLinks = useMemo(
    () => [...(person.links ?? [])].toSorted((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
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

  return (
    <div className="ui-container ui-page-content space-y-10">
      <header style={accentStyle} className="ui-card relative overflow-hidden">
        <span aria-hidden="true" className="ui-accent-rail" />
        <span aria-hidden="true" className="ui-accent-rail-overlay" />

        <div className="relative z-10 flex flex-col gap-6 px-5 py-5 pl-6 sm:px-6 sm:py-6 sm:pl-7">
          <div className="flex flex-col gap-5 md:flex-row md:items-start">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/4 text-2xl font-semibold tracking-[0.08em] text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] sm:h-28 sm:w-28 sm:text-3xl">
              {person.avatarUrl ? (
                <Image
                  src={person.avatarUrl}
                  alt={person.name}
                  width={112}
                  height={112}
                  sizes="(min-width: 640px) 112px, 96px"
                  className="h-full w-full object-cover"
                />
              ) : (
                getInitials(person.name)
              )}
            </div>

            <div className="min-w-0 flex-1 space-y-4">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="ui-heading-1">{person.name}</h1>
                  {person.pronouns ? (
                    <span className="inline-flex items-center rounded-full border border-white/8 bg-white/3 px-2.5 py-1 text-xs font-medium text-slate-200">
                      {person.pronouns}
                    </span>
                  ) : null}
                </div>

                {affiliations.length > 0 ? (
                  <ul className="m-0 list-none space-y-1.5 p-0 text-sm leading-6 text-slate-300">
                    {affiliations.map((affiliation) => (
                      <li key={`${affiliation.organization}:${affiliation.title}`}>
                        <span className="font-semibold text-slate-100">{affiliation.title}</span>
                        <span className="mx-2 text-slate-500">@</span>
                        <span>{affiliation.organization}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>

              {sortedLinks.length > 0 ? (
                <ul className="m-0 flex list-none flex-wrap gap-2.5 p-0">
                  {sortedLinks.map((link) => (
                    <li key={link.url}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ui-focus-ring ui-pill-link focus-visible:outline-none"
                      >
                        <span className="max-w-[16rem] truncate">{link.title}</span>
                        <ArrowTopRightOnSquareIcon className="h-4 w-4 shrink-0 text-[#6CCDBB]" />
                      </a>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
        </div>
      </header>

      {person.description && (
        <section aria-labelledby="about-title" className="space-y-4">
          <h2 id="about-title" className="text-sm font-semibold tracking-[0.02em] text-slate-300">
            About
          </h2>
          <div className="ui-card px-5 py-5 sm:px-6">
            <div className="prose prose-invert prose-headings:text-slate-100 prose-p:leading-7 prose-a:ui-link max-w-none text-slate-300">
              <Markdown content={person.description} />
            </div>
          </div>
        </section>
      )}

      {sortedEvents.length > 0 && (
        <section aria-labelledby="events-title" className="space-y-4">
          <h2 id="events-title" className="text-sm font-semibold tracking-[0.02em] text-slate-300">
            Sessions
          </h2>
          <ul className="space-y-4">
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
    </div>
  );
}
