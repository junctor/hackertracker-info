import { ArrowTopRightOnSquareIcon, CalendarIcon } from "@heroicons/react/24/outline";
import { useMemo } from "react";
import { Link } from "react-router";

import Image from "@/components/Image";
import Markdown from "@/components/markdown/Markdown";
import { ConferenceManifest } from "@/lib/conferences";
import { OrganizationEntity } from "@/lib/types/ht-types";

type Props = {
  org: OrganizationEntity;
  conference: ConferenceManifest;
};

function getHostname(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export default function OrganizationDetails({ org, conference }: Props) {
  const initials = useMemo(
    () =>
      org.name
        .split(" ")
        .map((word) => word[0])
        .filter(Boolean)
        .slice(0, 2)
        .join("")
        .toUpperCase(),
    [org.name],
  );

  const description = org.description?.trim();
  const hasLinks = org.links.length > 0;

  return (
    <article className="ui-container ui-page-content max-w-4xl">
      <header className="ui-card relative overflow-hidden p-5 sm:p-6">
        <span aria-hidden="true" className="ui-accent-rail ui-tone-secondary" />
        <span aria-hidden="true" className="ui-accent-rail-overlay" />
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <div className="ui-logo-frame h-20 w-20 shrink-0 sm:h-24 sm:w-24">
            {org.logoUrl ? (
              <Image
                src={org.logoUrl}
                alt={`${org.name} logo`}
                fillContainer
                className="object-contain p-2"
                loading="eager"
                sizes="(min-width: 640px) 6rem, 5rem"
              />
            ) : (
              <div
                className="absolute inset-0 flex items-center justify-center font-mono text-xl font-semibold tracking-wide text-white"
                role="img"
                aria-label={`${org.name} logo`}
              >
                {initials}
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h1 className="ui-heading-1">{org.name}</h1>

            {org.tagIdAsOrganizer && (
              <div className="mt-4">
                <Link
                  to={`/${conference.slug}/tag?id=${org.tagIdAsOrganizer}`}
                  className="ui-focus-ring ui-pill-link focus-visible:outline-none"
                >
                  <CalendarIcon className="h-4 w-4 text-(--accent-success)" aria-hidden />
                  <span>View Schedule</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="mt-8 space-y-6">
        <section className="ui-card ui-detail-panel">
          <h2 className="ui-section-label">About</h2>

          <div className="mt-4">
            {description ? (
              <Markdown content={description} />
            ) : (
              <p className="ui-card-meta">No description available.</p>
            )}
          </div>
        </section>

        {hasLinks && (
          <section className="ui-card ui-detail-panel">
            <h2 className="ui-section-label">Links</h2>

            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {org.links.map((link) => {
                const hostname = getHostname(link.url);

                return (
                  <li key={link.url}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ui-focus-ring ui-card ui-card-interactive group flex h-full items-center justify-between rounded-xl px-4 py-3 focus-visible:outline-none"
                    >
                      <div className="min-w-0">
                        <div className="ui-card-title truncate text-sm">{link.label}</div>
                        <div className="ui-card-meta truncate text-xs">{hostname}</div>
                      </div>

                      <ArrowTopRightOnSquareIcon
                        className="ml-3 h-4 w-4 shrink-0 text-(--accent-success) transition group-hover:text-white"
                        aria-hidden
                      />
                    </a>
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </div>
    </article>
  );
}
