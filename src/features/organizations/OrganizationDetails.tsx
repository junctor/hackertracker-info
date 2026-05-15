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
    <article className="ui-container ui-page-content ui-organization-detail-page">
      <header className="ui-card ui-detail-card ui-organization-header">
        <span aria-hidden="true" className="ui-accent-rail ui-tone-secondary" />
        <span aria-hidden="true" className="ui-accent-rail-overlay" />
        <div className="ui-organization-header-row">
          <div className="ui-logo-frame ui-logo-frame-lg">
            {org.logoUrl ? (
              <Image
                src={org.logoUrl}
                alt={`${org.name} logo`}
                fillContainer
                className="ui-image-contain ui-logo-image-pad"
                loading="eager"
                sizes="(min-width: 640px) 6rem, 5rem"
              />
            ) : (
              <div className="ui-logo-initials-fill" role="img" aria-label={`${org.name} logo`}>
                {initials}
              </div>
            )}
          </div>

          <div className="ui-item-main">
            <h1 className="ui-heading-1">{org.name}</h1>

            {org.tagIdAsOrganizer && (
              <div className="ui-organization-actions">
                <Link
                  to={`/${conference.slug}/tag?id=${org.tagIdAsOrganizer}`}
                  className="ui-focus-ring ui-pill-link"
                >
                  <CalendarIcon className="ui-icon-xs ui-card-external-icon" aria-hidden />
                  <span>View Schedule</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="ui-organization-sections">
        <section className="ui-card ui-detail-panel">
          <h2 className="ui-section-label">About</h2>

          <div className="ui-section-body">
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

            <ul className="ui-organization-link-grid">
              {org.links.map((link) => {
                const hostname = getHostname(link.url);

                return (
                  <li key={link.url}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ui-focus-ring ui-card ui-card-interactive ui-organization-link-card"
                    >
                      <div className="ui-item-main">
                        <div className="ui-card-title ui-clip-text">{link.label}</div>
                        <div className="ui-card-meta ui-clip-text">{hostname}</div>
                      </div>

                      <ArrowTopRightOnSquareIcon
                        className="ui-icon-xs ui-organization-link-icon"
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
