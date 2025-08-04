import React from "react";
import Image from "next/image";
import Link from "next/link";
import { eventTime } from "@/lib/dates";
import { Card, CardContent } from "@/components/ui/card";
import Markdown from "@/components/markdown/Markdown";
import { Person } from "@/types/info";

export default function PersonDisplay({ person }: { person: Person }) {
  const avatar = person.media.find((m) => m.sort_order === 1)?.url;
  return (
    <div className="max-w-screen-lg mx-auto px-4 py-10 space-y-10">
      {/* Hero */}
      <Card className="bg-gray-800 p-6 flex flex-col md:flex-row items-center gap-6">
        {avatar ? (
          <div className="w-32 h-32 rounded-full overflow-hidden shadow-lg bg-gray-700">
            <Image
              src={new URL(avatar).pathname}
              alt={person.name}
              width={128}
              height={128}
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-32 h-32 flex items-center justify-center text-3xl text-white bg-gray-700 rounded-full">
            {person.name
              .split(" ")
              .map((w) => w[0])
              .slice(0, 2)
              .join("")}
          </div>
        )}
        <div className="flex-1 space-y-3">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white">
            {person.name}
          </h1>
          <div className="space-y-1 text-gray-300">
            {person.affiliations.map((a) => (
              <p key={a.organization} className="text-sm">
                {a.title} @ {a.organization}
              </p>
            ))}
          </div>
          {person.links.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {person.links
                .sort((a, b) => a.sort_order - b.sort_order)
                .map((l) => (
                  <a
                    key={l.url}
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:underline text-sm transition"
                  >
                    {l.title}
                  </a>
                ))}
            </div>
          )}
        </div>
      </Card>

      {/* About */}
      {person.description && (
        <section>
          <h2 className="text-2xl font-semibold text-gray-200 mb-4">About</h2>
          <div className="prose prose-invert max-w-none text-gray-300">
            <Markdown content={person.description} />
          </div>
        </section>
      )}

      {/* Events */}
      {person.events.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold text-gray-200 mb-4">Events</h2>
          <div className="relative">
            <ul className="space-y-8">
              {person.events.map((e) => (
                <li key={e.id}>
                  <Link
                    href={`/content?id=${e.content_id}`}
                    className="block w-full group"
                  >
                    <Card
                      className="
                        bg-gray-700 border-l-4 border-indigo-400 pl-5 h-full
                        transition-shadow duration-200 ease-out
                        group-hover:shadow-md
                        group-hover:bg-gray-600
                        group-hover:border-indigo-300
                      "
                    >
                      <CardContent className="p-4">
                        <h3 className="text-lg font-semibold text-gray-100">
                          {e.title}
                        </h3>
                        <p className="mt-1 text-sm text-gray-400">
                          {`${eventTime(new Date(e.begin), false)} – ${eventTime(new Date(e.end))}`}
                        </p>
                        <p className="text-sm text-gray-400">
                          {e.location.name}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </div>
  );
}
