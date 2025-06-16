import React from "react";
import Image from "next/image";
import Link from "next/link";
import { eventTime } from "@/lib/dates";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import Markdown from "@/components/markdown/Markdown";
import { Person } from "@/types/info";

export default function PersonDisplay({ person }: { person: Person }) {
  // derive avatar initials
  const initials = person.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  const avatarUrl = person.media.find((p) => p.sort_order === 1)?.url || "";

  return (
    <div className="min-h-screen text-gray-100 container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <Breadcrumb className="text-gray-400">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/people" className="hover:text-gray-100">
                People
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="mx-2" />
          <BreadcrumbItem>
            <BreadcrumbLink className="text-gray-200">
              {person.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <h1 className="mt-4 text-4xl font-extrabold">{person.name}</h1>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar: Photo + Details */}
        <aside className="space-y-6 bg-gray-800 p-4 rounded-lg">
          <div className="relative w-full h-64 rounded-lg overflow-hidden bg-gray-700">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={person.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-4xl font-bold text-gray-500">
                {initials}
              </div>
            )}
          </div>

          {person.affiliations.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-100 mb-2">
                Affiliation
              </h2>
              <ul className="space-y-1 text-gray-300">
                {person.affiliations.map((a) => (
                  <li key={a.organization}>
                    <p className="font-medium text-gray-200">
                      {a.organization}
                    </p>
                    <p className="text-sm italic">{a.title}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {person.links.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-100 mb-2">
                Links
              </h2>
              <ul className="space-y-1">
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
            </div>
          )}
        </aside>

        {/* Main: Bio + Events */}
        <main className="lg:col-span-2 space-y-12">
          {/* Bio */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-100 mb-4">About</h2>
            <div className="prose prose-invert max-w-none">
              <Markdown content={person.description} />
            </div>
          </section>

          {/* Events */}
          {person.events.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold text-gray-100 mb-4">
                Events
              </h2>
              <div className="space-y-4">
                {person.events.map((e) => (
                  <Card
                    key={e.id}
                    className="bg-gray-700 border border-gray-600 flex items-start p-4 hover:shadow-lg transition-shadow"
                  >
                    <span
                      style={{ backgroundColor: e.type.color }}
                      className="block w-1 h-full rounded-md mr-4"
                    />
                    <CardContent className="p-0">
                      <Link
                        href={`/event?id=${e.id}`}
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
