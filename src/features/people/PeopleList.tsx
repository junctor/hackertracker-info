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

  return (
    <section className="mx-auto my-10 max-w-7xl px-5">
      <SearchHeader
        title="People"
        searchLabel="Search people"
        searchPlaceholder="Search people..."
        searchValue={query}
        onSearchChange={setQuery}
      />

      {filtered.length === 0 ? (
        <p className="text-center text-slate-400">No people found.</p>
      ) : (
        <ul className="m-0 grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((person) => (
            <li key={person.id} className="h-full">
              <Link
                href={`/${conference.slug}/people/?id=${person.id}`}
                className="block rounded-2xl focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus-visible:outline-none"
              >
                <div className="h-full transform overflow-hidden rounded-2xl border border-white/10 bg-linear-to-br from-slate-900 to-slate-800 shadow-xl ring-indigo-600 ring-offset-2 transition-all hover:scale-[1.02] hover:from-slate-800 hover:to-slate-700 hover:ring-2">
                  <div className="flex flex-col items-center justify-center space-y-4 p-6">
                    {/* Avatar with initials */}

                    {/* Name */}
                    <h2 className="text-center text-lg font-medium text-slate-100">
                      {person.name}
                    </h2>

                    {/* Affiliation badges */}
                    {person.title && (
                      <span className="inline-flex items-center rounded-full bg-slate-900 px-2 py-1 text-xs text-slate-200">
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
