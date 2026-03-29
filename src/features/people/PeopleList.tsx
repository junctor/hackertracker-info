import Image from "next/image";
import Link from "next/link";
import { useState, useMemo, type CSSProperties } from "react";

import SearchHeader from "@/components/ui/SearchHeader";
import { ConferenceManifest } from "@/lib/conferences";
import { PeopleCardsView } from "@/lib/types/ht-types";

type Props = {
  people: PeopleCardsView;
  conference: ConferenceManifest;
};

const PERSON_ACCENT_COLORS = ["#017FA4", "#2D7FF9", "#0F766E", "#7C3AED", "#C2410C", "#0E7490"];

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

export default function PeopleList({ people, conference }: Props) {
  const [query, setQuery] = useState("");
  const trimmedQuery = query.trim();
  const filtered = useMemo(() => {
    const q = trimmedQuery.toLowerCase();
    return people.filter((p) => p.name.toLowerCase().includes(q));
  }, [people, trimmedQuery]);
  const showResultCount = trimmedQuery.length > 0;
  const resultCountLabel = `${filtered.length} ${filtered.length === 1 ? "person" : "people"}`;

  return (
    <section className="ui-container ui-section">
      <SearchHeader
        title="People"
        searchLabel="Search people"
        searchPlaceholder="Search people..."
        searchValue={query}
        onSearchChange={setQuery}
      />
      {showResultCount ? (
        <p
          role="status"
          aria-live="polite"
          className="mb-4 inline-flex items-center rounded-full border border-white/8 bg-white/3 px-3 py-1 text-sm font-medium text-slate-300"
        >
          {resultCountLabel} found
        </p>
      ) : null}

      {filtered.length === 0 ? (
        <div className="ui-empty-state">
          <p className="text-slate-200">
            {trimmedQuery ? `No people found for "${trimmedQuery}".` : "No people are listed yet."}
          </p>
          {trimmedQuery ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="ui-btn-base ui-btn-secondary ui-focus-ring ui-empty-state-action focus-visible:outline-none"
            >
              Clear search
            </button>
          ) : null}
        </div>
      ) : (
        <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((person) => {
            const accentStyle = {
              "--event-color": getPersonAccent(person.name),
            } as CSSProperties;

            return (
              <li key={person.id} className="h-full">
                <article
                  style={accentStyle}
                  className="ui-card ui-card-interactive group relative h-full overflow-hidden"
                >
                  <span aria-hidden="true" className="ui-accent-rail" />
                  <span aria-hidden="true" className="ui-accent-rail-overlay" />

                  <Link
                    href={`/${conference.slug}/people/?id=${person.id}`}
                    className="ui-focus-ring relative z-10 block h-full rounded-[inherit] px-4 py-3.5 pl-5 focus-visible:outline-none sm:px-5 sm:py-4 sm:pl-6"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-[1.1rem] border border-white/10 bg-white/4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/8" />
                        <div className="relative z-10 flex h-full w-full items-center justify-center overflow-hidden">
                          {person.avatarUrl ? (
                            <Image
                              src={person.avatarUrl}
                              alt={person.name}
                              width={48}
                              height={48}
                              sizes="48px"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-xs font-semibold tracking-[0.08em] text-slate-100 uppercase">
                              {getInitials(person.name)}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="min-w-0 flex-1 space-y-1">
                        <h2 className="text-[1rem] leading-6 font-semibold tracking-[-0.01em] text-slate-100 transition-colors group-hover:text-white">
                          <span className="line-clamp-2">{person.name}</span>
                        </h2>
                        {person.title?.trim() ? (
                          <p className="line-clamp-2 text-sm leading-5 text-slate-400">
                            {person.title.trim()}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </Link>
                </article>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
