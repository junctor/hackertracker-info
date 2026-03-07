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
  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return people.filter((p) => p.name.toLowerCase().includes(q));
  }, [people, query]);
  const resultLabel =
    query.trim().length > 0 ? `${filtered.length} people found` : `${people.length} people total`;

  return (
    <section className="ui-container ui-section">
      <SearchHeader
        title="People"
        searchLabel="Search people"
        searchPlaceholder="Search people..."
        searchValue={query}
        onSearchChange={setQuery}
      />
      <p role="status" aria-live="polite" className="mb-4 text-sm text-slate-300">
        {resultLabel}
      </p>

      {filtered.length === 0 ? (
        <p className="text-center text-slate-300">No people found.</p>
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
