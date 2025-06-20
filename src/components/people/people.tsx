import React, { useState, useMemo, useRef } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { gsap } from "gsap";
import { People, Person } from "@/types/info";

function SpeakerCard({ person }: { person: Person }) {
  const linkRef = useRef<HTMLAnchorElement>(null);

  const handleMouseEnter = () => {
    if (linkRef.current) {
      gsap.to(linkRef.current, {
        scale: 1.04,
        duration: 0.2,
        ease: "power1.out",
      });
    }
  };
  const handleMouseLeave = () => {
    if (linkRef.current) {
      gsap.to(linkRef.current, {
        scale: 1,
        duration: 0.2,
        ease: "power1.out",
      });
    }
  };
  const handleMouseDown = () => {
    if (linkRef.current) {
      gsap.to(linkRef.current, {
        scale: 0.96,
        duration: 0.1,
        ease: "power1.out",
      });
    }
  };

  return (
    <Link
      href={`/person?id=${person.id}`}
      ref={linkRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseLeave}
      className="block transform transition-transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-lg"
    >
      <Card className="h-full flex flex-col items-center text-center p-4 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors">
        <CardContent className="p-0">
          <h2 className="text-lg font-semibold text-gray-100">{person.name}</h2>
          {person.affiliations[0] && (
            <p className="text-sm text-gray-400 mt-1">
              {person.affiliations[0].organization}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

export default function PeopleDisplay({ people }: { people: People }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return people
      .filter((person) => person.name.toLowerCase().includes(q))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [people, query]);

  return (
    <div className="p-6 text-gray-100 min-h-screen my-10">
      <h1 className="text-3xl font-bold mb-4 text-gray-100">People</h1>

      <Input
        placeholder="Search by name…"
        value={query}
        onChange={(e) => setQuery(e.currentTarget.value)}
        aria-label="Search people"
        className="mb-6 max-w-sm
                   bg-gray-800 text-gray-100 placeholder-gray-500
                   border border-gray-700
                   focus:border-indigo-500 focus:ring-indigo-500"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.map((person) => (
          <SpeakerCard key={person.id} person={person} />
        ))}
      </div>
    </div>
  );
}
