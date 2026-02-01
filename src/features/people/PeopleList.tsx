import { useState, useMemo } from "react";
import Link from "next/link";
import { PeopleCardsView } from "@/lib/types/ht-types";
import { ConferenceManifest } from "@/lib/conferences";

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
    <section className="my-10 mx-auto px-5 max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-100">
          People
        </h1>
        <label className="w-full md:w-auto max-w-sm">
          <span className="sr-only">Search people</span>
          <input
            type="search"
            placeholder="Search People..."
            value={query}
            onChange={(e) => setQuery(e.currentTarget.value)}
            aria-label="Search people"
            className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-gray-100 placeholder:text-gray-500"
          />
        </label>
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-gray-400">No people found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((person) => (
            <Link
              key={person.id}
              href={`/${conference.code}/people/?id=${person.id}`}
              className="block focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-2xl"
            >
              <div
                className="
                  h-full
                  bg-linear-to-br from-gray-800 to-gray-700
                  border border-gray-700
                  shadow-xl rounded-2xl
                  hover:from-gray-700 hover:to-gray-600
                  ring-offset-2 ring-indigo-600 hover:ring-2
                  transition-all transform hover:scale-[1.02]
                  overflow-hidden
                "
              >
                <div className="flex flex-col items-center justify-center p-6 space-y-4">
                  {/* Avatar with initials */}

                  {/* Name */}
                  <h2 className="text-lg font-medium text-gray-100 text-center">
                    {person.name}
                  </h2>

                  {/* Affiliation badges */}
                  {person.title && (
                    <span className="inline-flex items-center rounded-full bg-gray-900 px-2 py-1 text-xs text-gray-200">
                      {person.title}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
