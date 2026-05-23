import {
  ChevronDownIcon,
  ChevronRightIcon,
  DevicePhoneMobileIcon,
  RocketLaunchIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router";

import { ConferenceManifest } from "@/lib/conferences";
import { useSiteMenu } from "@/lib/hooks/useSiteMenu";
import { getPageTitle, PageId } from "@/lib/types/page-meta";

const museoFont = {
  className: "ui-typeface-museo",
} as const;

const focusRingClass = "ui-focus-ring";

export default function SiteHeader({ conference, activePageId }: Props) {
  const menuItems = useSiteMenu(conference);
  const pageTitle = getPageTitle(activePageId);
  const activeHref =
    activePageId === "home"
      ? `/${conference.slug}`
      : activePageId === "readme"
        ? `/${conference.slug}/readme.nfo`
        : `/${conference.slug}/${activePageId}`;

  return (
    <header className="ui-topbar">
      <div className="ui-topbar-frame">
        <div aria-hidden="true" className="ui-topbar-rule" />

        <div className="ui-container ui-topbar-row">
          <div className="ui-topbar-brand-group">
            <Link to={`/${conference.slug}`} className={`ui-topbar-brand-link ${focusRingClass}`}>
              <span className="ui-topbar-brand-name">
                <span
                  className={`${museoFont.className} logo ui-topbar-logo ui-topbar-logo-mobile ui-clip-text`}
                >
                  {conference.code}
                </span>
                <span
                  className={`${museoFont.className} logo ui-topbar-logo ui-topbar-logo-desktop ui-clip-text`}
                >
                  {conference.name}
                </span>
              </span>
            </Link>

            <div className="ui-topbar-page-pill">
              <span className="ui-meta-pill ui-topbar-page-title ui-clip-text">
                <span className="ui-clip-text">{pageTitle}</span>
              </span>
            </div>
          </div>

          <div className="ui-topbar-actions">
            <nav aria-label="Primary">
              <details className="ui-header-menu">
                <summary className={`ui-details-summary ui-header-menu-summary ${focusRingClass}`}>
                  <RocketLaunchIcon
                    className="ui-icon-menu ui-header-menu-summary-icon"
                    aria-hidden="true"
                  />

                  <span className="ui-header-menu-label">Menu</span>

                  <ChevronDownIcon
                    className="ui-icon-xs ui-header-menu-chevron"
                    aria-hidden="true"
                  />
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

            <a
              href="/apps"
              aria-label="Get Hacker Tracker apps"
              title="Get Hacker Tracker apps"
              className="ui-icon-plain"
            >
              <DevicePhoneMobileIcon className="ui-icon-sm" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

type Props = {
  conference: ConferenceManifest;
  activePageId: PageId;
};
