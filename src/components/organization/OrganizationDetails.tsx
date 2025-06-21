import React from "react";
import Image from "next/image";
import Link from "next/link";
import Markdown from "../markdown/Markdown";
import { Organization } from "@/types/info";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function OrgDetails({ org }: { org: Organization }) {
  return (
    <article className="space-y-8 my-10 mx-5">
      {/* Hero header */}
      <header className="flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-gray-100">
          <Image
            src={org.logo.url}
            alt={`${org.name} logo`}
            layout="fill"
            objectFit="contain"
          />
        </div>

        <div className="flex-1 space-y-2">
          <h1 className="text-3xl font-bold">{org.name}</h1>
          {org.tag_id_as_organizer && (
            <Link href={`/events?tag=${org.tag_id_as_organizer}`} passHref>
              <Button
                variant="outline"
                size="sm"
                className="inline-flex items-center space-x-2"
              >
                <CalendarIcon className="h-5 w-5" />
                <span>{org.name} Events</span>
              </Button>
            </Link>
          )}
        </div>
      </header>

      {/* Tabs for About & Links */}
      <Tabs defaultValue="about" className="space-y-4">
        <TabsList className="inline-flex rounded-lg bg-muted p-1">
          <TabsTrigger
            value="about"
            className="
              px-4 py-1.5 text-sm font-medium
              text-muted-foreground
              rounded-md
              data-[state=active]:bg-background
              data-[state=active]:text-foreground
            "
          >
            About
          </TabsTrigger>

          {org.links.length > 0 && (
            <TabsTrigger
              value="links"
              className="
                px-4 py-1.5 text-sm font-medium
                text-muted-foreground
                rounded-md
                data-[state=active]:bg-background
                data-[state=active]:text-foreground
              "
            >
              Links
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="about">
          <div className="prose max-w-none">
            <Markdown content={org.description} />
          </div>
        </TabsContent>

        {org.links.length > 0 && (
          <TabsContent value="links">
            <ul className="flex flex-col gap-2">
              {org.links.map((l) => (
                <li key={l.url}>
                  <Link href={l.url} passHref>
                    <Button
                      variant="link"
                      className="text-white hover:underline"
                    >
                      {l.label}
                    </Button>{" "}
                  </Link>
                </li>
              ))}
            </ul>
          </TabsContent>
        )}
      </Tabs>
    </article>
  );
}
