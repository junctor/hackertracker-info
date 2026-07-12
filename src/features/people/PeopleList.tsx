import { useState, useMemo } from "react";
import { Link } from "react-router";

import Image from "@/components/Image";
import PageHeader from "@/components/ui/PageHeader";
import { ConferenceManifest } from "@/lib/conferences";
import { alphaSort } from "@/lib/misc";
import { PeopleCardsView } from "@/lib/types/ht-types";
import { getSafeImageHref } from "@/lib/url";

import { getPersonInitials } from "./personInitials";

type Props = {
  people: PeopleCardsView;
  conference: ConferenceManifest;
};

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
    const safeUrl = getSafeImageHref(normalized);
    if (safeUrl) return safeUrl;
  }

  return null;
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
  const [brokenAvatarIds, setBrokenAvatarIds] = useState<Record<number, true>>({});
  const trimmedQuery = query.trim();

  const sortedPeople = useMemo(
    () => people.toSorted((a, b) => alphaSort(getDisplayName(a.name), getDisplayName(b.name))),
    [people],
  );

  const filtered = useMemo(() => {
    const q = trimmedQuery.toLowerCase();
    if (!q) return sortedPeople;

    return sortedPeople.filter((person) => {
      const personName = getDisplayName(person.name).toLowerCase();
      const personTitle = getDisplayTitle(person.title)?.toLowerCase() ?? "";
      return personName.includes(q) || personTitle.includes(q);
    });
  }, [sortedPeople, trimmedQuery]);
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
      />

      {filtered.length === 0 ? (
        <div role="status" className="ui-empty-state ui-page-empty-offset">
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
            const personInitials = getPersonInitials(person.name) || getPersonInitials(personName);
            const avatarUrl = getPersonAvatarUrl(person);
            const showAvatarImage = Boolean(avatarUrl) && !brokenAvatarIds[person.id];

            return (
              <li key={person.id} className="ui-grid-card-item">
                <Link
                  to={`/${conference.slug}/people/?id=${person.id}`}
                  className="ui-focus-ring ui-person-list-link"
                >
                  <article className="ui-card ui-card-interactive ui-person-list-card">
                    <div className="ui-person-avatar ui-person-avatar-small">
                      {showAvatarImage && avatarUrl ? (
                        <Image
                          src={avatarUrl}
                          alt={personName}
                          fillContainer
                          sizes="(min-width: 640px) 3.75rem, 3rem"
                          className="ui-image-cover"
                          onError={() =>
                            setBrokenAvatarIds((current) =>
                              current[person.id] ? current : { ...current, [person.id]: true },
                            )
                          }
                        />
                      ) : (
                        <span className="ui-person-initials">{personInitials}</span>
                      )}
                    </div>

                    <div className="ui-person-card-copy">
                      <h2 className="ui-card-title">
                        <span className="ui-clamp-two">{highlight(personName, query)}</span>
                      </h2>
                      {personTitle ? (
                        <p className="ui-card-meta ui-clamp-two">{personTitle}</p>
                      ) : null}
                    </div>
                  </article>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
