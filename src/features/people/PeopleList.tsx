import Link from "next/link";
import { useState, useMemo } from "react";

import SearchHeader from "@/components/ui/SearchHeader";
import { ConferenceManifest } from "@/lib/conferences";
import { PeopleCardsView } from "@/lib/types/ht-types";

type Props = {
  people: PeopleCardsView;
  conference: ConferenceManifest;
};

export default function PeopleList({ people, conference }: Props) {
  const [query, setQuery] = useState("");
  const trimmedQuery = query.trim();
  const filtered = useMemo(() => {
    const q = trimmedQuery.toLowerCase();
    return people.filter((p) => p.name.toLowerCase().includes(q));
  }, [people, trimmedQuery]);
  const showResultCount = trimmedQuery.length > 0;

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
        <p role="status" aria-live="polite" className="mb-4 text-sm text-slate-300">
          {filtered.length} found
        </p>
      ) : null}

      {filtered.length === 0 ? (
        <div className="ui-empty-state">
          <p className="text-slate-200">
            {trimmedQuery
              ? `No speakers match "${trimmedQuery}".`
              : "No speakers are listed yet."}
          </p>
          {trimmedQuery ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="ui-btn-base ui-btn-secondary ui-focus-ring ui-empty-state-action focus-visible:outline-none"
            >
              Clear Search
            </button>
          ) : null}
        </div>
      ) : (
        <ul className="m-0 grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((person) => (
            <li key={person.id} className="h-full">
              <Link
                href={`/${conference.slug}/people/?id=${person.id}`}
                className="ui-focus-ring block rounded-2xl focus-visible:outline-none"
              >
                <div className="ui-card ui-card-interactive h-full overflow-hidden rounded-2xl">
                  <div className="flex flex-col items-center justify-center gap-4 p-6">
                    <h2 className="text-center text-lg font-medium text-slate-100">
                      {person.name}
                    </h2>

                    {person.title && (
                      <span className="inline-flex items-center rounded-full bg-slate-800 px-2 py-1 text-xs text-slate-200">
                        {person.title}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
