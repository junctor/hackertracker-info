import { UserIcon } from "@heroicons/react/24/solid";
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

function getInitials(name?: string | null): string {
  const normalizedName = getPersonName(name);
  if (!normalizedName) return "";

  return normalizedName
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function getPersonAccent(name?: string | null): string {
  const normalizedName = getDisplayName(name);
  let hash = 0;
  for (const char of normalizedName) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }
  return PERSON_ACCENT_COLORS[hash % PERSON_ACCENT_COLORS.length] ?? PERSON_ACCENT_COLORS[0];
}

export default function PeopleList({ people, conference }: Props) {
  const [query, setQuery] = useState("");
  const [brokenAvatarIds, setBrokenAvatarIds] = useState<Record<number, true>>({});
  const trimmedQuery = query.trim();
  const filtered = useMemo(() => {
    const q = trimmedQuery.toLowerCase();
    if (!q) return people;

    return people.filter((person) => {
      const personName = getDisplayName(person.name).toLowerCase();
      const personTitle = getDisplayTitle(person.title)?.toLowerCase() ?? "";
      return personName.includes(q) || personTitle.includes(q);
    });
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
            const personName = getDisplayName(person.name);
            const personTitle = getDisplayTitle(person.title);
            const personInitials = getInitials(person.name);
            const avatarUrl = getPersonAvatarUrl(person);
            const showAvatarImage = Boolean(avatarUrl) && !brokenAvatarIds[person.id];
            const accentColor = getPersonAccent(person.name);
            const accentStyle = {
              "--event-color": accentColor,
            } as CSSProperties;
            const avatarStyle = {
              backgroundImage: `linear-gradient(135deg, ${accentColor}22 0%, rgba(15, 23, 42, 0.9) 100%)`,
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
                      <div
                        style={avatarStyle}
                        className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                      >
                        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/8" />
                        <div className="relative z-10 flex h-full w-full items-center justify-center overflow-hidden">
                          {showAvatarImage && avatarUrl ? (
                            <Image
                              src={avatarUrl}
                              alt={personName}
                              fill
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
                                className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16),transparent_62%)]"
                              />
                              {personInitials ? (
                                <span className="relative text-xs font-semibold tracking-[0.08em] text-slate-100 uppercase">
                                  {personInitials}
                                </span>
                              ) : (
                                <UserIcon
                                  className="relative h-5 w-5 text-slate-100"
                                  aria-hidden="true"
                                />
                              )}
                            </>
                          )}
                        </div>
                      </div>

                      <div className="min-w-0 flex-1 space-y-1">
                        <h2 className="text-[1rem] leading-6 font-semibold tracking-[-0.01em] text-slate-100 transition-colors group-hover:text-white">
                          <span className="line-clamp-2">{personName}</span>
                        </h2>
                        {personTitle ? (
                          <p className="line-clamp-2 text-sm leading-5 text-slate-400">
                            {personTitle}
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
