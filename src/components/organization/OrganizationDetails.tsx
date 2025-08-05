"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import Markdown from "../markdown/Markdown";
import { Organization } from "@/types/info";
import { CalendarIcon } from "@radix-ui/react-icons";
import { ExternalLinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "../ui/card";

interface OrgDetailsProps {
  org: Organization;
}

export default function OrgDetails({ org }: OrgDetailsProps) {
  const initials = org.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <article className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      {/* Hero Section */}
      <Card className="bg-gray-800 p-6 flex flex-col md:flex-row items-center gap-6 transition-shadow hover:shadow-lg">
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
            <Link href={`/tag?id=${org.tag_id_as_organizer}`}>
              <Button
                variant="secondary"
                size="default"
                className="inline-flex items-center space-x-2 transform hover:scale-105 transition"
              >
                <CalendarIcon className="h-5 w-5 text-indigo-400" />
                <span>See {org.name} Events</span>
              </Button>
            </Link>
          )}
        </div>
      </Card>

      {/* Tabbed content */}
      <Tabs defaultValue="about" className="space-y-4">
        <TabsList className="flex space-x-2 border-b border-gray-700">
          <TabsTrigger
            value="about"
            className="px-3 py-2 text-sm font-medium text-gray-800 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-indigo-400"
          >
            About
          </TabsTrigger>
          {org.links.length > 0 && (
            <TabsTrigger
              value="links"
              className="px-3 py-2 text-sm font-medium text-gray-800 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-indigo-400"
            >
              Links
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="about" className="py-4">
          <div className="prose prose-invert max-w-none text-gray-300">
            <Markdown content={org.description} />
          </div>
        </TabsContent>

        {org.links.length > 0 && (
          <TabsContent value="links" className="py-4">
            <ul className="space-y-3">
              {org.links.map((l) => (
                <li key={l.url}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-between flex items-center transition-colors hover:bg-gray-700"
                  >
                    <a
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center w-full"
                    >
                      <span className="text-left text-gray-200">{l.label}</span>
                      <ExternalLinkIcon className="w-4 h-4 ml-2 text-gray-400" />
                    </a>
                  </Button>
                </li>
              ))}
            </ul>
          </TabsContent>
        )}
      </Tabs>
    </article>
  );
}
