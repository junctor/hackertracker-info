"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import Markdown from "@/components/markdown/Markdown";
import { Organization } from "@/lib/types/info";
import { Tab } from "@headlessui/react";
import {
  ArrowTopRightOnSquareIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";

interface OrganizationDetailsProps {
  org: Organization;
}

export default function OrganizationDetails({
  org,
}: OrganizationDetailsProps) {
  const initials = org.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <article className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      {/* Hero Section */}
      <section className="bg-gray-800 p-6 flex flex-col md:flex-row items-center gap-6 transition-shadow hover:shadow-lg rounded-lg">
        {/* Logo container */}
        <div className="relative w-full max-w-xs h-32 sm:h-40 md:h-48 rounded-lg overflow-hidden flex-shrink-0">
          {org.logo?.url ? (
            <Image
              src={new URL(org.logo.url).pathname}
              alt={`${org.name} logo`}
              fill
              className="object-contain"
              priority
            />
          ) : (
            <div
              className="absolute inset-0 flex items-center justify-center bg-gray-700 text-3xl text-white"
              aria-label={initials}
            >
              {initials}
            </div>
          )}
        </div>

        {/* Organization details */}
        <div className="flex-1 space-y-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white">
            {org.name}
          </h1>
          {org.tag_id_as_organizer && (
            <Link
              href={`/tag?id=${org.tag_id_as_organizer}`}
              className="inline-flex items-center gap-2 rounded-full border border-indigo-400/40 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-100 transition hover:scale-105"
            >
              <CalendarIcon className="h-5 w-5 text-indigo-400" />
              <span>See {org.name} Events</span>
            </Link>
          )}
        </div>
      </section>

      {/* Tabbed content */}
      <Tab.Group defaultIndex={0}>
        <Tab.List className="flex gap-2 border-b border-gray-700">
          <Tab
            className={({ selected }) =>
              `px-3 py-2 text-sm font-medium transition ${
                selected
                  ? "border-b-2 border-indigo-400 text-white"
                  : "text-gray-400 hover:text-white"
              }`
            }
          >
            About
          </Tab>
          {org.links.length > 0 && (
            <Tab
              className={({ selected }) =>
                `px-3 py-2 text-sm font-medium transition ${
                  selected
                    ? "border-b-2 border-indigo-400 text-white"
                    : "text-gray-400 hover:text-white"
                }`
              }
            >
              Links
            </Tab>
          )}
        </Tab.List>

        <Tab.Panels className="py-4">
          <Tab.Panel>
            <div className="prose prose-invert max-w-none text-gray-300">
              <Markdown content={org.description} />
            </div>
          </Tab.Panel>

          {org.links.length > 0 && (
            <Tab.Panel>
              <ul className="space-y-3">
                {org.links.map((l) => (
                  <li key={l.url}>
                    <a
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center justify-between rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-gray-200 transition hover:bg-gray-800"
                    >
                      <span>{l.label}</span>
                      <ArrowTopRightOnSquareIcon className="h-4 w-4 text-gray-400" />
                    </a>
                  </li>
                ))}
              </ul>
            </Tab.Panel>
          )}
        </Tab.Panels>
      </Tab.Group>
    </article>
  );
}
