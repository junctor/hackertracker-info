import Link from "next/link";
import Theme from "../../lib/utils/theme";
import ReactMarkdown from "react-markdown";
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

function OrgDetails({ org }: { org: HTOrganization }) {
  const theme = new Theme();
  theme.randomisze();

  const orgId = org.tag_ids.find((t) => tagsOrgs.has(t)) ?? 0;

  const orgName = tagsOrgs.get(orgId) ?? "Unknown";

  return (
    <div>
      <Heading />
      <div className="mt-4 ml-5">
        <div className="mt-2 ml-5 mb-5 justify-start flex-auto">
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
          <div className="my-3">
            <h1 className="font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-5 mr-3">
              {org.name}
            </h1>
          </div>
        </div>
        <div className="mt-8">
          <div className="text-sm md:text-base lg:text-lg w-11/12">
            <div className="prose lg:prose-xl whitespace-pre-wrap">
              <ReactMarkdown>{org.description}</ReactMarkdown>
            </div>
          </div>
        </div>
        {/* {org.tag_id_as_organizer !== null && (
          <div className={`m-5 hover:text-${themeColor}`}>
            <Link href={`/tag?id=${org.tag_id_as_organizer}`}>
              <button
                type="button"
                className="flex align-middle items-center p-1"
                onMouseEnter={() => {
                  setActive(true);
                }}
                onMouseLeave={() => {
                  setActive(false);
                }}
              >
                <div className="mr-2">
                  {!active ? (
                    <CalendarIconOutline className="h-5 sm:h-6 md:h-7 lg:h-8 mr-2" />
                  ) : (
                    <CalendarIconSoild className="h-5 sm:h-6 md:h-7 lg:h-8 mr-2" />
                  )}
                </div>
                <h3 className="text-sm sm:text-base md:text-lg lg:text-xl">
                  {`${org.name} Events`}
                </h3>
              </button>
            </Link>
          </div>
        )} */}

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
