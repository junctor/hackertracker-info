import React from "react";
import Image from "next/image";
import Link from "next/link";
import Markdown from "../markdown/Markdown";
import { Organization } from "@/types/info";
import { CalendarIcon } from "@radix-ui/react-icons";
import { ExternalLinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function OrgDetails({ org }: { org: Organization }) {
  return (
    <article className="space-y-8 my-10 mx-5">
      {/* Hero header */}
      <header className="flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-gray-900">
          <Image
            src={org.logo.url}
            alt={`${org.name} logo`}
            layout="fill"
            objectFit="contain"
          />
        </div>

        <div className="flex-1 space-y-2">
          <h1 className="text-3xl font-bold text-gray-100">{org.name}</h1>

          {org.tag_id_as_organizer && (
            <Link href={`/tag?id=${org.tag_id_as_organizer}`} passHref>
              <Button
                variant="secondary"
                size="default"
                className="
                  inline-flex items-center space-x-2
                  transform transition hover:scale-105
                "
              >
                <CalendarIcon className="h-5 w-5 text-indigo-500" />
                <span>See {org.name} Events</span>
              </Button>
            </Link>
          )}
        </div>
      </header>

      {/* About & Links */}
      <Tabs defaultValue="about" className="space-y-4">
        <TabsList className="inline-flex rounded-lg bg-gray-800 p-1">
          <TabsTrigger
            value="about"
            className="
              px-4 py-1.5 text-sm font-medium
              text-gray-400 rounded-md
              data-[state=active]:bg-gray-900
              data-[state=active]:text-gray-100
            "
          >
            About
          </TabsTrigger>

          {org.links.length > 0 && (
            <TabsTrigger
              value="links"
              className="
                px-4 py-1.5 text-sm font-medium
                text-gray-400 rounded-md
                data-[state=active]:bg-gray-900
                data-[state=active]:text-gray-100
              "
            >
              Links
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="about">
          <div className="prose prose-invert max-w-none">
            <Markdown content={org.description} />
          </div>
        </TabsContent>

        {org.links.length > 0 && (
          <TabsContent value="links">
            <ul className="space-y-3">
              {org.links.map((l) => (
                <li key={l.url}>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full justify-between"
                  >
                    <a
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center w-full"
                    >
                      <span className="text-left">{l.label}</span>
                      <ExternalLinkIcon className="w-4 h-4 ml-2" />
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
