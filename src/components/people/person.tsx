import React from "react";
import Image from "next/image";
import Link from "next/link";
import { eventTime } from "@/lib/dates";
import { Card, CardContent } from "@/components/ui/card";
import Markdown from "@/components/markdown/Markdown";
import { Person } from "@/types/info";

export default function PersonDisplay({ person }: { person: Person }) {
  // primary avatar if present
  const avatarUrl = person.media.find((p) => p.sort_order === 1)?.url;

  return (
    <div className="min-h-screen text-gray-100 max-w-7xl mx-auto px-4 py-10 overflow-x-hidden">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-5xl font-extrabold">{person.name}</h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar: Optional Avatar + Details */}
        <aside className="space-y-6">
          {avatarUrl && (
            <div className="relative w-full aspect-square rounded-xl overflow-hidden shadow-lg bg-gray-700">
              <Image
                src={avatarUrl}
                alt={`${person.name} avatar`}
                fill
                className="object-contain"
                style={{ objectPosition: "center top" }}
              />
            </div>
          )}

          {person.affiliations.length > 0 && (
            <Card className="bg-gray-800">
              <CardContent>
                <h2 className="text-xl font-semibold text-gray-100 mb-2">
                  Affiliations
                </h2>
                <ul className="space-y-2 text-gray-300">
                  {person.affiliations.map((a) => (
                    <li key={a.organization}>
                      <p className="font-medium text-gray-200">
                        {a.organization}
                      </p>
                      <p className="text-sm italic">{a.title}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {person.links.length > 0 && (
            <Card className="bg-gray-800">
              <CardContent>
                <h2 className="text-xl font-semibold text-gray-100 mb-2">
                  Links
                </h2>
                <ul className="space-y-2">
                  {person.links
                    .sort((a, b) => a.sort_order - b.sort_order)
                    .map((l) => (
                      <li key={l.url}>
                        <a
                          href={l.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-400 hover:text-indigo-200 hover:underline"
                        >
                          {l.title}
                        </a>
                      </li>
                    ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </aside>

        {/* Main: Bio + Events */}
        <main className="lg:col-span-2 space-y-12">
          {/* Bio Section */}
          {person.description && (
            <section>
              <h2 className="text-2xl font-semibold text-gray-100 mb-4">
                About
              </h2>
              <div className="prose prose-invert max-w-none">
                <Markdown content={person.description} />
              </div>
            </section>
          )}

          {/* Events Section */}
          {person.events.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold text-gray-100 mb-4">
                Events
              </h2>
              <div className="grid gap-4">
                {person.events.map((e) => (
                  <Card
                    key={e.id}
                    className="bg-gray-700 border border-gray-600 hover:shadow-lg transition"
                  >
                    <CardContent>
                      <Link
                        href={`/content?id=${e.content_id}`}
                        className="text-lg font-semibold text-gray-100 hover:underline"
                      >
                        {e.title}
                      </Link>
                      <p className="text-sm text-gray-400 mt-1">
                        {`${eventTime(new Date(e.begin), false)} – ${eventTime(
                          new Date(e.end)
                        )}`}
                      </p>
                      <p className="text-sm text-gray-400">{e.location.name}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
