import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

import Markdown from "@/components/markdown/Markdown";
import { ConferenceManifest } from "@/lib/conferences";
import { eventTime } from "@/lib/dates";
import { EventEntity, LocationEntity, PersonEntity } from "@/lib/types/ht-types";

type Props = {
  person: PersonEntity;
  events: EventEntity[];
  locations: LocationEntity[];
  conference: ConferenceManifest;
};

export default function PersonDetails({ person, events, locations, conference }: Props) {
  const contentsBasePath = `/${conference.slug}/content`;
  const locationNameById = useMemo(() => {
    const entries = locations.map((location) => [location.id, location.name] as const);
    return new Map<number, string>(entries);
  }, [locations]);

  return (
    <div className="ui-container ui-page-content space-y-10">
      {/* Hero */}
      <section className="ui-card flex flex-col items-center gap-6 p-6 md:flex-row">
        {person.avatarUrl ? (
          <div className="h-32 w-32 overflow-hidden rounded-full bg-slate-800 shadow-lg">
            <Image
              src={person.avatarUrl}
              alt={person.name}
              width={128}
              height={128}
              className="object-cover"
            />
          </div>
        ) : (
          <div className="flex h-32 w-32 items-center justify-center rounded-full bg-slate-800 text-3xl text-white">
            {person.name
              .split(" ")
              .map((w) => w[0])
              .slice(0, 2)
              .join("")}
          </div>
        )}
        <div className="flex-1 space-y-3">
          <h1 className="ui-heading-1">{person.name}</h1>
          <ul className="m-0 list-none space-y-1 p-0 text-slate-300">
            {person.affiliations?.map((a) => (
              <li key={a.organization} className="text-sm">
                {a.title} @ {a.organization}
              </li>
            ))}
          </ul>
          {person.links.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {person.links
                .toSorted((a, b) => a.sortOrder - b.sortOrder)
                .map((l) => (
                  <a
                    key={l.url}
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ui-focus-ring text-sm text-[#6CCDBB] transition hover:underline focus-visible:outline-none"
                  >
                    {l.title}
                  </a>
                ))}
            </div>
          )}
        </div>
      </section>

      {/* About */}
      {person.description && (
        <section>
          <h2 className="ui-heading-2 mb-4">About</h2>
          <div className="prose prose-invert max-w-none text-slate-300">
            <Markdown content={person.description} />
          </div>
        </section>
      )}

      {/* Events */}
      {events.length > 0 && (
        <section>
          <h2 className="ui-heading-2 mb-4">Events</h2>
          <div className="relative">
            <ul className="space-y-4">
              {events.map((e) => (
                <li key={e.id}>
                  <Link
                    href={`${contentsBasePath}?id=${e.contentId}`}
                    className="ui-focus-ring group block w-full rounded-lg focus-visible:outline-none"
                  >
                    <div className="ui-card ui-card-interactive h-full border-l-4 border-[#017FA4] pl-5 transition-shadow duration-200 ease-out group-hover:border-[#6CCDBB]">
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-slate-100">{e.title}</h3>
                        <p className="mt-1 text-sm text-slate-400">
                          {`${eventTime(new Date(e.begin), false, conference.timezone)} – ${eventTime(new Date(e.end), true, conference.timezone)}`}
                        </p>
                        <p className="text-sm text-slate-400">
                          {locationNameById.get(e.locationId)}
                        </p>
                      </div>
                    </div>
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
