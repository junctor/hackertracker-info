import { UserIcon } from "@heroicons/react/24/solid";
import { useState, useMemo } from "react";
import { Link } from "react-router";

import Image from "@/components/Image";
import PageHeader from "@/components/ui/PageHeader";
import { ConferenceManifest } from "@/lib/conferences";
import { PeopleCardsView } from "@/lib/types/ht-types";

import { getPersonInitials } from "./personInitials";

type SortMode = "name-asc" | "name-desc";

type Props = {
  people: PeopleCardsView;
  conference: ConferenceManifest;
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
  title?: string | null;
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

function getDisplayTitle(title?: string | null): string | null {
  return getTrimmedText(title) || null;
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

function highlight(text: string, rawQuery: string) {
  const q = rawQuery.trim();
  if (!q) return text;
  const idx = text.toLowerCase().indexOf(q.toLowerCase());
  if (idx === -1) return text;

  return (
    <>
      {text.slice(0, idx)}
      <mark className="ui-search-highlight rounded px-0.5">{text.slice(idx, idx + q.length)}</mark>
      {text.slice(idx + q.length)}
    </>
  );
}

export default function PeopleList({ people, conference }: Props) {
  const [query, setQuery] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("name-asc");
  const [brokenAvatarIds, setBrokenAvatarIds] = useState<Record<number, true>>({});
  const collator = useMemo(() => new Intl.Collator(undefined, { sensitivity: "base" }), []);
  const trimmedQuery = query.trim();
  const filtered = useMemo(() => {
    const q = trimmedQuery.toLowerCase();
    const base = q
      ? people.filter((person) => {
          const personName = getDisplayName(person.name).toLowerCase();
          const personTitle = getDisplayTitle(person.title)?.toLowerCase() ?? "";
          return personName.includes(q) || personTitle.includes(q);
        })
      : [...people];

    base.sort((a, b) => {
      const cmp = collator.compare(getDisplayName(a.name), getDisplayName(b.name));
      return sortMode === "name-asc" ? cmp : -cmp;
    });

    return base;
  }, [people, trimmedQuery, sortMode, collator]);
  const hasSearch = trimmedQuery.length > 0;
  const resultCountLabel = `${filtered.length} ${filtered.length === 1 ? "person" : "people"}`;

  return (
    <section className="ui-container ui-section">
      <PageHeader
        title="People"
        description="Find speakers, authors, builders, and contributors by name or title."
        resultLabel={hasSearch ? `${resultCountLabel} found` : undefined}
        search={{
          label: "Search people",
          placeholder: "Search people...",
          value: query,
          onChange: setQuery,
        }}
      >
        <label className="block w-full">
          <span className="sr-only">Sort people</span>
          <select
            value={sortMode}
            onChange={(e) => setSortMode(e.currentTarget.value as SortMode)}
            className="ui-input-base ui-select-control ui-focus-ring focus-visible:outline-none"
          >
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
          </select>
        </label>
      </PageHeader>

      {filtered.length === 0 ? (
        <div className="ui-empty-state">
          <p>
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
            const personName = getDisplayName(person.name);
            const personTitle = getDisplayTitle(person.title);
            const personInitials = getPersonInitials(person.name);
            const avatarUrl = getPersonAvatarUrl(person);
            const showAvatarImage = Boolean(avatarUrl) && !brokenAvatarIds[person.id];
            const accentClassName = getPersonAccentClassName(person.name);

            return (
              <li key={person.id} className="h-full">
                <article
                  className={`ui-card ui-card-interactive group relative h-full overflow-hidden ${accentClassName}`}
                >
                  <span aria-hidden="true" className="ui-accent-rail" />
                  <span aria-hidden="true" className="ui-accent-rail-overlay" />

                  <Link
                    to={`/${conference.slug}/people/?id=${person.id}`}
                    className="ui-focus-ring ui-rounded-inherit relative z-10 block h-full px-4 py-3.5 pl-5 focus-visible:outline-none sm:px-5 sm:py-4 sm:pl-6"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="ui-person-avatar ui-inset-highlight-soft relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/4">
                        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/8" />
                        <div className="relative z-10 flex h-full w-full items-center justify-center overflow-hidden">
                          {showAvatarImage && avatarUrl ? (
                            <Image
                              src={avatarUrl}
                              alt={personName}
                              fillContainer
                              sizes="48px"
                              className="object-cover"
                              onError={() =>
                                setBrokenAvatarIds((current) =>
                                  current[person.id] ? current : { ...current, [person.id]: true },
                                )
                              }
                            />
                          ) : (
                            <>
                              <div
                                aria-hidden="true"
                                className="ui-avatar-fallback-glow absolute inset-0"
                              />
                              {personInitials ? (
                                <span className="relative text-xs font-semibold tracking-widest text-(--text-primary) uppercase">
                                  {personInitials}
                                </span>
                              ) : (
                                <UserIcon
                                  className="relative h-5 w-5 text-(--text-primary)"
                                  aria-hidden="true"
                                />
                              )}
                            </>
                          )}
                        </div>
                      </div>

                      <div className="min-w-0 flex-1 space-y-1">
                        <h2 className="ui-card-title text-base">
                          <span className="line-clamp-2">{highlight(personName, query)}</span>
                        </h2>
                        {personTitle ? (
                          <p className="ui-card-meta line-clamp-2">{personTitle}</p>
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
