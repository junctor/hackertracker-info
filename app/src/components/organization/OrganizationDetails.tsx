import Link from "next/link";
import Heading from "../heading/Heading";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { tagsOrgs } from "@/lib/utils/orgs";
import React from "react";
import { CalendarIcon } from "@heroicons/react/24/outline";
import Markdown from "../markdown/Markdown";

function OrgDetails({ org }: { org: HTOrganization }) {
  const orgId = org.tag_ids.find((t) => tagsOrgs.has(t)) ?? 0;

  const orgName = tagsOrgs.get(orgId) ?? "Unknown";

  return (
    <div>
      <Heading />
      <div className="mx-5">
        <div className="my-2 justify-start flex-auto">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={`/orgs?id=${orgId}`}>{orgName}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </BreadcrumbList>
          </Breadcrumb>
          <div>
            <h1 className="font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-5 mr-3">
              {org.name}
            </h1>
          </div>
        </div>
        {org.media.length > 0 && (
          <div className="mt-2 flex max-w-96">
            <img
              src={`/ht/img/${org.media[0].name}`}
              alt="org graphic"
              className="w-1/2 rounded-md"
            />
          </div>
        )}
        <div className="mt-8">
          <div className="text-sm md:text-base lg:text-lg w-11/12">
            <Markdown content={org.description} />
          </div>
        </div>
        {org.tag_id_as_organizer !== null && (
          <div className="m-5">
            <Link href={`/events?tag=${org.tag_id_as_organizer}`}>
              <button
                type="button"
                className="flex align-middle items-center p-1"
              >
                <div className="mr-2">
                  <CalendarIcon className="h-5 sm:h-6 md:h-7 lg:h-8 mr-2" />
                </div>
                <h3 className="text-sm sm:text-base md:text-lg lg:text-xl">
                  {`${org.name} Events`}
                </h3>
              </button>
            </Link>
          </div>
        )}

        {org.links.length > 0 && (
          <div className="mt-8 text-left">
            <h2 className="font-bold text-base sm:text-lg md:text-xl lg:text-2xl">
              Links
            </h2>
            <ul className="list-disc text-xs sm:text-sm md:text-base lg:text-lg ml-5 mt-2">
              {org.links.map((l) => (
                <li key={l.url}>
                  <a href={l.url}>{l.label}</a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrgDetails;
