import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { People } from "@/types/info";

export default function PeopleDisplay({ people }: { people: People }) {
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
        <Input
          placeholder="Search People..."
          value={query}
          onChange={(e) => setQuery(e.currentTarget.value)}
          aria-label="Search people"
          className="w-full md:w-auto max-w-sm"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-gray-400">No people found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((person) => (
            <Link
              key={person.id}
              href={`/person?id=${person.id}`}
              className="block focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-2xl"
            >
              <Card className="h-full bg-gradient-to-br from-gray-800 to-gray-700 border border-gray-700 shadow-lg rounded-2xl hover:from-gray-700 hover:to-gray-600 ring-offset-2 ring-indigo-500 hover:ring-2 transition-all transform hover:scale-[1.02] overflow-hidden">
                <CardContent className="flex flex-col items-center justify-center p-6 space-y-4">
                  <h2 className="text-lg font-medium text-gray-100">
                    {person.name}
                  </h2>
                  {person.affiliations[0] && (
                    <p className="text-sm text-gray-400">
                      {person.affiliations[0].organization}
                    </p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
