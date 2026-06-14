import {
  CalendarIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  HomeIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router";

import { ConferenceManifest } from "@/lib/conferences";
import { useSiteMenu } from "@/lib/hooks/useSiteMenu";
import { PageId } from "@/lib/types/page-meta";

const museoFont = {
  className: "ui-typeface-museo",
} as const;

const focusRingClass = "ui-focus-ring";

export default function SiteHeader({ conference, activePageId }: Props) {
  const menuItems = useSiteMenu(conference);
  const conferenceRootPath = `/${conference.slug}/`;
  const conferenceDisplayTitle = conference.displayTitle ?? conference.name;
  const conferenceShortTitle = conference.shortTitle ?? conferenceDisplayTitle;
  const scheduleHref =
    conference.schedulePath ??
    (conference.siteMenu.includes("schedule") ? `/${conference.slug}/schedule` : null);
  const trackerHref = conference.externalTrackerUrl;
  const activeHref =
    activePageId === "menu"
      ? conferenceRootPath
      : activePageId === "readme"
        ? `/${conference.slug}/readme.nfo`
        : `/${conference.slug}/${activePageId}`;

  return (
    <header className="ui-topbar">
      <div aria-hidden="true" className="ui-topbar-rule" />

      <div className="ui-chrome-container ui-topbar-row">
        <div className="ui-topbar-brand-group">
          <Link to="/" aria-label="Home" title="Home" className="ui-icon-plain ui-topbar-home-link">
            <HomeIcon className="ui-icon-sm" aria-hidden="true" />
          </Link>

          <Link
            to={conferenceRootPath}
            aria-label={`${conference.name} home`}
            className={`ui-topbar-brand-link ${focusRingClass}`}
          >
            <span className="ui-topbar-brand-name">
              <span className={`${museoFont.className} logo ui-topbar-logo ui-topbar-logo-short`}>
                {conferenceShortTitle}
              </span>
              <span className={`${museoFont.className} logo ui-topbar-logo ui-topbar-logo-full`}>
                {conferenceDisplayTitle}
              </span>
            </span>
          </Link>
        </div>

        <div className="ui-topbar-actions">
          {scheduleHref ? (
            <Link
              to={scheduleHref}
              aria-current={activePageId === "schedule" ? "page" : undefined}
              aria-label="Schedule"
              title="Schedule"
              className="ui-topbar-action-link ui-topbar-schedule-link"
            >
              <CalendarIcon className="ui-icon-sm" aria-hidden="true" />
              <span className="ui-topbar-schedule-label">Schedule</span>
            </Link>
          ) : null}

          <Link
            to={`/${conference.slug}/search`}
            aria-current={activePageId === "search" ? "page" : undefined}
            aria-label="Search"
            title="Search"
            className="ui-icon-plain"
          >
            <MagnifyingGlassIcon className="ui-icon-sm" aria-hidden="true" />
          </Link>

          <nav aria-label="Primary">
            <details className="ui-header-menu">
              <summary className={`ui-details-summary ui-header-menu-summary ${focusRingClass}`}>
                <img
                  src="/images/icons/skull-icon.png"
                  alt=""
                  className="ui-icon-menu ui-header-menu-summary-icon"
                />

                <span className="ui-header-menu-label">Menu</span>

                <ChevronDownIcon className="ui-icon-xs ui-header-menu-chevron" aria-hidden="true" />
              </summary>

              <div className="ui-header-menu-shell">
                <div className="ui-card ui-header-menu-popover">
                  <ul className="ui-header-menu-list">
                    {menuItems.map(({ title, href, description, icon: Icon }) => {
                      const isActive = href === activeHref;

                      return (
                        <li key={href}>
                          <Link
                            to={href}
                            aria-current={isActive ? "page" : undefined}
                            className={`ui-header-menu-item ${focusRingClass}`}
                          >
                            <span className="ui-header-menu-item-icon">
                              <Icon className="ui-icon-menu" aria-hidden="true" />
                            </span>

                            <span className="ui-header-menu-item-body">
                              <span className="ui-header-menu-item-title ui-clip-text">
                                {title}
                              </span>

                              {description ? (
                                <span className="ui-header-menu-item-description">
                                  {description}
                                </span>
                              ) : null}
                            </span>

                            <span className="ui-header-menu-trailing">
                              <ChevronRightIcon className="ui-icon-xs" aria-hidden="true" />
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </details>
          </nav>

          {trackerHref ? (
            <a
              href={trackerHref}
              aria-label="Get Hacker Tracker apps"
              title="Get Hacker Tracker apps"
              className="ui-icon-plain"
            >
              <img src="/images/logos/ht-logo.png" alt="" className="ui-icon-sm" />
            </a>
          ) : null}
        </div>
      </div>
    </header>
  );
}

type Props = {
  conference: ConferenceManifest;
  activePageId: PageId;
};
