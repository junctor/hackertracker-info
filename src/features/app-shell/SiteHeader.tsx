import { useMemo } from "react";
import Link from "next/link";
import {
  CodeBracketSquareIcon,
  DevicePhoneMobileIcon,
  RocketLaunchIcon,
} from "@heroicons/react/24/outline";
import localFont from "next/font/local";
import { getSiteMenu } from "@/lib/menu";
import { ConferenceManifest } from "@/lib/conferences";
import { getPageTitle, PageId } from "@/lib/types/page-meta";

const museoFont = localFont({
  src: "../../../public/fonts/Museo700-Regular.woff2",
  display: "swap",
  variable: "--font-museo",
});

const focusRingClass =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black";

export default function SiteHeader({ conference, activePageId }: Props) {
  const menuItems = useMemo(() => getSiteMenu(conference), [conference]);
  const pageTitle = getPageTitle(activePageId);
  const activeHref = useMemo(() => {
    if (activePageId === "home") return `/${conference.slug}`;
    if (activePageId === "readme") return `/${conference.slug}/readme.nfo`;
    return `/${conference.slug}/${activePageId}`;
  }, [activePageId, conference.slug]);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-800 bg-black/90 px-4 py-3 text-white backdrop-blur sm:px-5">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
        {/* Logo + Primary Nav */}
        <div className="flex min-w-0 items-center gap-3 sm:gap-5">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href={`/${conference.slug}`}
              className={`rounded-md px-1 py-1 ${focusRingClass}`}
            >
              <span
                className={`${museoFont.className} text-2xl md:text-3xl font-bold logo`}
              >
                <span className="block md:hidden">{conference.code}</span>
                <span className="hidden max-w-[18rem] truncate md:block">
                  {conference.name}
                </span>
              </span>
            </Link>
            <span className="hidden truncate text-sm text-gray-400 sm:inline">
              {pageTitle}
            </span>
          </div>

          {/* Primary Nav */}
          <nav aria-label="Primary">
            <details className="relative">
              <summary
                className={`flex cursor-pointer items-center gap-1 rounded-md px-3 py-2 text-sm text-gray-200 hover:text-white ${focusRingClass}`}
              >
                <RocketLaunchIcon className="h-4 w-4 shrink-0" aria-hidden />
                <span>Explore</span>
              </summary>
              <div className="absolute left-0 top-full mt-2 w-[min(20rem,calc(100vw-2rem))] max-h-[min(26rem,calc(100dvh-5.5rem))] overflow-y-auto overscroll-contain rounded-lg border border-gray-800 bg-gray-950 p-2 shadow-lg">
                <ul className="grid gap-2">
                  {menuItems.map(({ title, href, description, icon: Icon }) => {
                    const isActive = href === activeHref;
                    return (
                      <li key={title}>
                        <Link
                          href={href}
                          aria-current={isActive ? "page" : undefined}
                          className={`flex flex-col gap-1 rounded-md px-3 py-2 text-sm hover:bg-gray-900 ${focusRingClass} ${
                            isActive
                              ? "bg-gray-900 font-semibold text-white ring-1 ring-gray-700"
                              : "text-gray-200"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <Icon className="h-5 w-5 shrink-0" aria-hidden />
                            <span>{title}</span>
                            {isActive ? (
                              <span className="rounded border border-gray-600 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-gray-300">
                                Current
                              </span>
                            ) : null}
                          </span>
                          <span className="hidden text-xs text-gray-400 lg:block">
                            {description}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </details>
          </nav>
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Link
            href={`/${conference.slug}/apps`}
            aria-label="Mobile Apps"
            className={`inline-flex h-11 w-11 items-center justify-center rounded-md text-gray-300 transition hover:bg-gray-900 hover:text-white ${focusRingClass}`}
          >
            <DevicePhoneMobileIcon className="h-5 w-5" aria-hidden />
          </Link>
          <a
            href="https://github.com/junctor/hackertracker-info"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View on GitHub"
            className={`inline-flex h-11 w-11 items-center justify-center rounded-md text-gray-300 transition hover:bg-gray-900 hover:text-white ${focusRingClass}`}
          >
            <CodeBracketSquareIcon className="h-5 w-5" aria-hidden />
          </a>
        </div>
      </div>
    </header>
  );
}

type Props = {
  conference: ConferenceManifest;
  activePageId: PageId;
};
