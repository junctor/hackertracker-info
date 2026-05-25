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
      <mark className="ui-search-highlight">{text.slice(idx, idx + q.length)}</mark>
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
        <label className="ui-control-label">
          <span className="ui-visually-hidden">Sort people</span>
          <select
            value={sortMode}
            onChange={(e) => setSortMode(e.currentTarget.value as SortMode)}
            className="ui-input-base ui-select-control ui-focus-ring"
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
              className="ui-btn-base ui-btn-secondary ui-focus-ring ui-empty-state-action"
            >
              Clear search
            </button>
          ) : null}
        </div>
      ) : (
        <ul className="ui-people-grid">
          {filtered.map((person) => {
            const personName = getDisplayName(person.name);
            const personTitle = getDisplayTitle(person.title);
            const personInitials = getPersonInitials(person.name);
            const avatarUrl = getPersonAvatarUrl(person);
            const showAvatarImage = Boolean(avatarUrl) && !brokenAvatarIds[person.id];
            const accentClassName = getPersonAccentClassName(person.name);

            return (
              <li key={person.id} className="ui-grid-card-item">
                <article
                  className={`ui-card ui-card-interactive ui-accent-card ui-person-list-card ${accentClassName}`}
                >
                  <span aria-hidden="true" className="ui-accent-rail" />
                  <span aria-hidden="true" className="ui-accent-rail-overlay" />

                  <Link
                    to={`/${conference.slug}/people/?id=${person.id}`}
                    className="ui-focus-ring ui-person-list-link"
                  >
                    <div className="ui-person-list-row">
                      <div className="ui-person-avatar ui-inset-highlight-soft ui-person-avatar-small">
                        <div className="ui-person-avatar-rule" />
                        <div className="ui-person-avatar-inner">
                          {showAvatarImage && avatarUrl ? (
                            <Image
                              src={avatarUrl}
                              alt={personName}
                              fillContainer
                              sizes="48px"
                              className="ui-image-cover"
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
                                className="ui-avatar-fallback-glow ui-fill-layer"
                              />
                              {personInitials ? (
                                <span className="ui-person-initials">{personInitials}</span>
                              ) : (
                                <UserIcon
                                  className="ui-icon-sm ui-layer-above"
                                  aria-hidden="true"
                                />
                              )}
                            </>
                          )}
                        </div>
                      </div>

                      <div className="ui-person-card-copy">
                        <h2 className="ui-card-title">
                          <span className="ui-clamp-two">{highlight(personName, query)}</span>
                        </h2>
                        {personTitle ? (
                          <p className="ui-card-meta ui-clamp-two">{personTitle}</p>
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
