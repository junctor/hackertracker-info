import {
  ChevronDownIcon,
  ChevronRightIcon,
  DevicePhoneMobileIcon,
  RocketLaunchIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router";

import { ConferenceManifest } from "@/lib/conferences";
import { getSiteMenu } from "@/lib/menu";
import { getPageTitle, PageId } from "@/lib/types/page-meta";

const museoFont = {
  className: "font-museo",
} as const;

const focusRingClass = "ui-focus-ring focus-visible:outline-none";

export default function SiteHeader({ conference, activePageId }: Props) {
  const menuItems = getSiteMenu(conference);
  const pageTitle = getPageTitle(activePageId);
  const activeHref =
    activePageId === "home"
      ? `/${conference.slug}`
      : activePageId === "readme"
        ? `/${conference.slug}/readme.nfo`
        : `/${conference.slug}/${activePageId}`;
  const isAppsPage = activePageId === "apps";

  return (
    <header className="ui-topbar sticky top-0 z-50 text-white">
      <div className="relative">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-(--dc34-accent-primary)/35 to-transparent"
        />

        <div className="ui-container flex min-h-16 items-center justify-between gap-3 py-2.5">
          <div className="flex min-w-0 items-center gap-2.5 sm:gap-4">
            <Link
              to={`/${conference.slug}`}
              className={`group min-w-0 rounded-xl px-2 py-1.5 transition-colors hover:bg-white/4 ${focusRingClass}`}
            >
              <span className="min-w-0">
                <span
                  className={`${museoFont.className} logo block max-w-48 truncate text-base font-bold tracking-tight text-slate-50 transition-colors group-hover:text-white sm:max-w-64 sm:text-lg md:hidden`}
                >
                  {conference.code}
                </span>
                <span
                  className={`${museoFont.className} logo hidden max-w-96 truncate text-2xl font-bold tracking-tight text-slate-50 transition-colors group-hover:text-white md:block lg:text-3xl`}
                >
                  {conference.name}
                </span>
              </span>
            </Link>

            <div className="hidden min-w-0 items-center md:flex">
              <span className="ui-inset-highlight inline-flex min-w-0 items-center truncate rounded-full border border-white/12 bg-white/5 px-3.5 py-1.5 text-xs font-semibold tracking-widest text-slate-200 uppercase">
                <span className="truncate">{pageTitle}</span>
              </span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <nav aria-label="Primary">
              <details className="group relative">
                <summary
                  className={`ui-details-summary group/menu flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-xl px-2.5 text-left text-sm text-slate-200 transition duration-200 ease-out group-open:bg-white/4.5 group-open:text-white hover:bg-white/4 hover:text-white ${focusRingClass}`}
                >
                  <RocketLaunchIcon
                    className="h-4.5 w-4.5 shrink-0 text-(--dc34-accent-secondary)"
                    aria-hidden="true"
                  />

                  <span className="hidden font-semibold tracking-tight md:block">Menu</span>

                  <ChevronDownIcon
                    className="h-4 w-4 text-slate-500 transition-transform duration-200 group-open:rotate-180 group-hover/menu:text-slate-300 motion-reduce:transition-none"
                    aria-hidden="true"
                  />
                </summary>

                <div className="fixed inset-x-2 top-16 bottom-2 pt-2 sm:absolute sm:inset-x-auto sm:top-full sm:right-0 sm:bottom-auto sm:w-sm">
                  <div className="ui-card ui-header-menu-popover relative max-h-full overflow-y-auto overscroll-contain rounded-2xl border border-white/10 bg-neutral-950 p-2 shadow-2xl sm:max-h-128">
                    <ul className="grid gap-1">
                      {menuItems.map(({ title, href, description, icon: Icon }) => {
                        const isActive = href === activeHref;

                        const itemClassName = `group/item relative flex items-start gap-3 rounded-xl px-3 py-2.5 text-left transition duration-200 ease-out ${focusRingClass} ${
                          isActive
                            ? "bg-white/5 text-white"
                            : "text-gray-300 hover:bg-white/3 hover:text-white focus-visible:bg-white/3 focus-visible:text-white"
                        }`;

                        const iconClassName = `mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
                          isActive
                            ? "bg-white/5 text-(--dc34-accent-secondary)"
                            : "bg-white/3 text-gray-400 group-hover/item:bg-white/5 group-hover/item:text-gray-200 group-focus-within/item:bg-white/5 group-focus-within/item:text-gray-200"
                        }`;

                        const trailingClassName = `mt-1 shrink-0 transition duration-200 ${
                          isActive
                            ? "text-(--dc34-accent-secondary)"
                            : "text-gray-500 group-hover/item:translate-x-0.5 group-hover/item:text-gray-300 group-focus-within/item:translate-x-0.5 group-focus-within/item:text-gray-300"
                        }`;

                        return (
                          <li key={href}>
                            <Link
                              to={href}
                              aria-current={isActive ? "page" : undefined}
                              className={itemClassName}
                            >
                              <span className={iconClassName}>
                                <Icon className="h-4.5 w-4.5 shrink-0" aria-hidden="true" />
                              </span>

                              <span className="min-w-0 flex-1">
                                <span className="block truncate text-sm font-semibold tracking-tight">
                                  {title}
                                </span>

                                {description ? (
                                  <span
                                    className={`mt-1 hidden text-sm leading-5 md:block ${
                                      isActive ? "text-gray-300" : "text-gray-400"
                                    }`}
                                  >
                                    {description}
                                  </span>
                                ) : null}
                              </span>

                              <span className={trailingClassName}>
                                <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
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

            <Link
              to={`/${conference.slug}/apps`}
              aria-label="Get Hacker Tracker apps"
              aria-current={isAppsPage ? "page" : undefined}
              title="Get Hacker Tracker apps"
            >
              <DevicePhoneMobileIcon
                className={`h-5 w-5 transition ${focusRingClass} hover:border-(--dc34-accent-primary)/28 hover:bg-(--dc34-accent-primary)/8 hover:text-(--dc34-accent-secondary)`}
                aria-hidden="true"
              />
            </Link>
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
