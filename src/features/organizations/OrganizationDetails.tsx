import { ArrowTopRightOnSquareIcon, CalendarIcon } from "@heroicons/react/24/outline";
import { useMemo } from "react";
import { Link } from "react-router";

import Image from "@/components/Image";
import Markdown from "@/components/markdown/Markdown";
import PageHeader from "@/components/ui/PageHeader";
import { ConferenceManifest } from "@/lib/conferences";
import { OrganizationEntity } from "@/lib/types/ht-types";
import { getSafeExternalHref } from "@/lib/url";

type Props = {
  org: OrganizationEntity;
  conference: ConferenceManifest;
};

function getHostname(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "") || url;
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
    <article className="ui-container ui-page-content ui-detail-stack ui-detail-page">
      <div className="ui-detail-header-accent ui-tone-secondary">
        <span aria-hidden="true" className="ui-accent-rail" />
        <span aria-hidden="true" className="ui-accent-rail-overlay" />

        <PageHeader
          actionsInline
          title={
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
              </div>
            </div>
          }
          actions={
            org.tagIdAsOrganizer ? (
              <Link
                to={`/${conference.slug}/tag?id=${org.tagIdAsOrganizer}`}
                className="ui-focus-ring ui-pill-link"
              >
                <CalendarIcon className="ui-icon-xs ui-card-external-icon" aria-hidden />
                <span>View Schedule</span>
              </Link>
            ) : undefined
          }
        />
      </div>

      <section aria-labelledby="organization-about-title" className="ui-detail-section">
        <h2 id="organization-about-title" className="ui-section-label">
          About
        </h2>

        <div className="ui-document-body ui-detail-body-panel">
          {description ? (
            <Markdown content={description} />
          ) : (
            <p className="ui-card-meta">No description available.</p>
          )}
        </div>
      </section>

      {hasLinks && (
        <section aria-labelledby="organization-links-title" className="ui-detail-section">
          <h2 id="organization-links-title" className="ui-section-label">
            Links
          </h2>

          <ul className="ui-detail-link-list">
            {org.links.map((link) => {
              const safeHref = getSafeExternalHref(link.url);
              const hostname = safeHref ? getHostname(safeHref) : link.url;

              return (
                <li key={link.url}>
                  {safeHref ? (
                    <a
                      href={safeHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ui-focus-ring ui-detail-link-row"
                    >
                      <div className="ui-item-main">
                        <div className="ui-card-title ui-clip-text">{link.label}</div>
                        <div className="ui-card-meta ui-clip-text">{hostname}</div>
                      </div>

                      <ArrowTopRightOnSquareIcon
                        className="ui-icon-xs ui-card-external-icon"
                        aria-hidden
                      />
                    </a>
                  ) : (
                    <div className="ui-detail-link-row ui-detail-link-row-disabled">
                      <div className="ui-item-main">
                        <div className="ui-card-title ui-clip-text">{link.label}</div>
                        <div className="ui-card-meta ui-clip-text">{hostname}</div>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </article>
  );
}
