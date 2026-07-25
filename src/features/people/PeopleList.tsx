import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router";

import Image from "@/components/Image";
import PageHeader from "@/components/ui/PageHeader";
import { ConferenceManifest } from "@/lib/conferences";
import { getDirectorySectionInitial } from "@/lib/directoryText";
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

type PersonCardProps = {
  brokenAvatarIds: Record<number, true>;
  conference: ConferenceManifest;
  onAvatarError: (personId: number) => void;
  person: PeopleCardsView[number];
  query: string;
};

const PEOPLE_SEARCH_DEBOUNCE_MS = 300;

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

function groupPeopleByInitial(people: PeopleCardsView) {
  const groups: Array<{ initial: string; people: PeopleCardsView }> = [];

  for (const person of people) {
    const initial = getDirectorySectionInitial(getDisplayName(person.name));
    const lastGroup = groups.at(-1);

    if (lastGroup?.initial === initial) {
      lastGroup.people.push(person);
    } else {
      groups.push({ initial, people: [person] });
    }
  }

  return groups;
}

function PersonCard({
  brokenAvatarIds,
  conference,
  onAvatarError,
  person,
  query,
}: PersonCardProps) {
  const personName = getDisplayName(person.name);
  const personTitle = getDisplayTitle(person.title);
  const personInitials = getPersonInitials(person.name) || getPersonInitials(personName);
  const avatarUrl = getPersonAvatarUrl(person);
  const showAvatarImage = Boolean(avatarUrl) && !brokenAvatarIds[person.id];

  return (
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
              onError={() => onAvatarError(person.id)}
            />
          ) : (
            <span className="ui-person-initials" aria-hidden="true">
              {personInitials}
            </span>
          )}
        </div>

        <div className="ui-person-card-copy">
          <h2 className="ui-card-title">
            <span className="ui-clamp-two">{highlight(personName, query)}</span>
          </h2>
          {personTitle ? <p className="ui-card-meta ui-clamp-two">{personTitle}</p> : null}
        </div>
      </article>
    </Link>
  );
}

export default function PeopleList({ people, conference }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const resultsStartRef = useRef<HTMLDivElement | null>(null);
  const previousQueryRef = useRef(query);
  const [brokenAvatarIds, setBrokenAvatarIds] = useState<Record<number, true>>({});
  const trimmedQuery = query.trim();
  const submitSearch = useCallback(
    (nextQuery: string) => {
      const value = nextQuery.trim();
      if (query === value) return;

      setSearchParams(
        (currentParams) => {
          const nextParams = new URLSearchParams(currentParams);
          const currentValue = currentParams.get("q") ?? "";

          if (currentValue === value) return currentParams;

          if (value) {
            nextParams.set("q", value);
          } else {
            nextParams.delete("q");
          }

          return nextParams;
        },
        { replace: true },
      );
    },
    [query, setSearchParams],
  );

  const sortedPeople = useMemo(
    () => people.toSorted((a, b) => alphaSort(getDisplayName(a.name), getDisplayName(b.name))),
    [people],
  );

  const searchablePeople = useMemo(
    () =>
      sortedPeople.map((person) => ({
        person,
        searchableName: getDisplayName(person.name).toLowerCase(),
        searchableTitle: getDisplayTitle(person.title)?.toLowerCase() ?? "",
      })),
    [sortedPeople],
  );

  const filtered = useMemo(() => {
    const q = trimmedQuery.toLowerCase();
    if (!q) return sortedPeople;

    return searchablePeople
      .filter(
        ({ searchableName, searchableTitle }) =>
          searchableName.includes(q) || searchableTitle.includes(q),
      )
      .map(({ person }) => person);
  }, [searchablePeople, sortedPeople, trimmedQuery]);
  const hasSearch = trimmedQuery.length > 0;
  const resultCountLabel = `${filtered.length} ${filtered.length === 1 ? "person" : "people"}`;
  const groupedPeople = useMemo(() => groupPeopleByInitial(filtered), [filtered]);

  const handleAvatarError = useCallback((personId: number) => {
    setBrokenAvatarIds((current) =>
      current[personId] ? current : { ...current, [personId]: true },
    );
  }, []);

  useEffect(() => {
    if (previousQueryRef.current === query) return;

    previousQueryRef.current = query;

    if (window.scrollY > (resultsStartRef.current?.offsetTop ?? 0)) {
      resultsStartRef.current?.scrollIntoView({ block: "start", inline: "nearest" });
    }
  }, [query]);

  return (
    <section className="ui-container ui-section">
      <PageHeader
        title="People"
        description="Find speakers, contributors, and other people by name or title."
        resultLabel={hasSearch ? `${resultCountLabel} found` : undefined}
        search={{
          label: "Search people",
          placeholder: "Search people...",
          value: query,
          debounceMs: PEOPLE_SEARCH_DEBOUNCE_MS,
          onDebouncedSubmit: submitSearch,
          onSubmit: submitSearch,
        }}
      />

      <div ref={resultsStartRef} />

      {filtered.length === 0 ? (
        <div role="status" className="ui-empty-state ui-page-empty-offset">
          <p>
            {trimmedQuery ? `No people found for "${trimmedQuery}".` : "No people are listed yet."}
          </p>
          {trimmedQuery ? (
            <button
              type="button"
              onClick={() => submitSearch("")}
              className="ui-btn-base ui-btn-secondary ui-focus-ring ui-empty-state-action"
            >
              Clear search
            </button>
          ) : null}
        </div>
      ) : (
        <div className="ui-people-directory">
          {groupedPeople.map((group, groupIndex) => {
            const headingId = `people-initial-${groupIndex}`;

            return (
              <section
                key={`${group.initial}-${groupIndex}`}
                aria-labelledby={headingId}
                className="ui-people-group"
              >
                <h2 id={headingId} className="ui-people-group-heading">
                  {group.initial}
                </h2>

                <ul className="ui-people-grid ui-people-group-list">
                  {group.people.map((person) => (
                    <li key={person.id} className="ui-grid-card-item">
                      <PersonCard
                        brokenAvatarIds={brokenAvatarIds}
                        conference={conference}
                        onAvatarError={handleAvatarError}
                        person={person}
                        query={query}
                      />
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      )}
    </section>
  );
}
