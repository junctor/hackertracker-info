import {
  ChevronDownIcon,
  DevicePhoneMobileIcon,
  RocketLaunchIcon,
} from "@heroicons/react/24/outline";
import localFont from "next/font/local";
import Link from "next/link";

import { ConferenceManifest } from "@/lib/conferences";
import { getSiteMenu } from "@/lib/menu";
import { getPageTitle, PageId } from "@/lib/types/page-meta";

const museoFont = localFont({
  src: "../../../public/fonts/Museo700-Regular.woff2",
  display: "swap",
  variable: "--font-museo",
});

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
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-[#017FA4]/35 to-transparent"
        />

        <div className="ui-container flex min-h-16 items-center justify-between gap-3 py-2.5">
          <div className="flex min-w-0 items-center gap-2.5 sm:gap-4">
            <Link
              href={`/${conference.slug}`}
              className={`group min-w-0 rounded-xl px-2 py-1.5 transition-colors hover:bg-white/4 ${focusRingClass}`}
            >
              <span className="flex min-w-0 items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/4 text-[0.7rem] font-semibold tracking-[0.18em] text-[#6CCDBB] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] md:hidden">
                  {conference.code}
                </span>

                <span className="min-w-0">
                  <span
                    className={`${museoFont.className} logo block max-w-48 truncate text-base font-bold tracking-tight text-slate-50 transition-colors group-hover:text-white sm:max-w-[16rem] sm:text-lg md:hidden`}
                  >
                    {conference.name}
                  </span>
                  <span
                    className={`${museoFont.className} logo hidden max-w-96 truncate text-2xl font-bold tracking-tight text-slate-50 transition-colors group-hover:text-white md:block lg:text-[2rem]`}
                  >
                    {conference.name}
                  </span>
                </span>
              </span>
            </Link>

            <div className="hidden min-w-0 items-center gap-2 md:flex">
              <span aria-hidden="true" className="h-1 w-1 rounded-full bg-[#017FA4]/75" />
              <span className="truncate rounded-full border border-white/10 bg-white/4 px-3 py-1 text-[11px] font-semibold tracking-[0.14em] text-slate-300 uppercase shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                {pageTitle}
              </span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <nav aria-label="Primary">
              <details className="group relative">
                <summary
                  className={`ui-btn-base ui-btn-secondary flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-xl border-white/10 bg-white/3 px-3.5 text-sm text-slate-100 shadow-[0_10px_28px_rgba(2,6,23,0.18)] transition group-open:border-[#017FA4]/40 group-open:bg-[#0D294A]/45 group-open:text-white group-open:shadow-[0_16px_36px_rgba(2,6,23,0.32)] [&::-webkit-details-marker]:hidden ${focusRingClass}`}
                >
                  <RocketLaunchIcon
                    className="h-4 w-4 shrink-0 text-[#6CCDBB]"
                    aria-hidden="true"
                  />
                  <span className="hidden sm:inline">Menu</span>
                  <span className="sm:hidden">Browse</span>
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/5 text-slate-400 transition-colors group-open:bg-[#017FA4]/18 group-open:text-[#6CCDBB]">
                    <ChevronDownIcon
                      className="h-4 w-4 transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none"
                      aria-hidden="true"
                    />
                  </span>
                </summary>

                <div className="absolute top-full right-0 mt-2.5 w-[min(24rem,calc(100vw-1rem))]">
                  <div className="ui-card max-h-[min(34rem,calc(100dvh-5rem))] overflow-y-auto overscroll-contain border-white/10 bg-slate-950/95 p-2 shadow-[0_24px_64px_rgba(0,0,0,0.48)] backdrop-blur-xl">
                    <div className="rounded-2xl border border-white/8 bg-white/3 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                      <p className="text-[11px] font-semibold tracking-[0.16em] text-slate-500 uppercase">
                        Navigate
                      </p>
                      <div className="mt-2 flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-100">
                            {conference.name}
                          </p>
                          <p className="mt-0.5 text-xs text-slate-400">
                            {menuItems.length} destinations
                          </p>
                        </div>
                        <span className="shrink-0 rounded-full border border-[#017FA4]/30 bg-[#017FA4]/10 px-2.5 py-1 text-[11px] font-semibold tracking-[0.14em] text-[#6CCDBB] uppercase">
                          {pageTitle}
                        </span>
                      </div>
                    </div>

                    <ul className="mt-2 grid gap-1.5">
                      {menuItems.map(({ title, href, description, icon: Icon }) => {
                        const isActive = href === activeHref;

                        return (
                          <li key={title}>
                            <Link
                              href={href}
                              aria-current={isActive ? "page" : undefined}
                              className={`group/item flex items-start gap-3 rounded-2xl border px-3.5 py-3 text-left transition ${focusRingClass} ${
                                isActive
                                  ? "border-[#017FA4]/42 bg-[#0D294A]/60 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                                  : "border-transparent text-slate-200 hover:border-white/8 hover:bg-white/3 hover:text-slate-50"
                              }`}
                            >
                              <span
                                className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-colors ${
                                  isActive
                                    ? "border-[#017FA4]/35 bg-[#017FA4]/12 text-[#6CCDBB]"
                                    : "border-white/8 bg-white/3 text-slate-400 group-hover/item:border-[#017FA4]/25 group-hover/item:bg-[#017FA4]/8 group-hover/item:text-[#6CCDBB]"
                                }`}
                              >
                                <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                              </span>

                              <span className="min-w-0 flex-1">
                                <span className="flex items-center gap-2">
                                  <span className="truncate text-sm font-semibold">{title}</span>
                                  {isActive ? (
                                    <span className="rounded-full border border-[#017FA4]/45 bg-[#017FA4]/10 px-2 py-0.5 text-[10px] font-semibold tracking-[0.14em] text-[#6CCDBB] uppercase">
                                      Current
                                    </span>
                                  ) : null}
                                </span>

                                {description ? (
                                  <span className="mt-1 block text-xs leading-5 text-slate-400">
                                    {description}
                                  </span>
                                ) : null}
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
              href={`/${conference.slug}/apps`}
              aria-label="Get Hacker Tracker apps"
              aria-current={isAppsPage ? "page" : undefined}
              className={`ui-icon-btn h-11 w-11 rounded-xl border-white/10 bg-white/3 text-slate-300 shadow-[0_10px_28px_rgba(2,6,23,0.18)] transition ${focusRingClass} ${
                isAppsPage
                  ? "border-[#017FA4]/35 bg-[#017FA4]/12 text-[#6CCDBB]"
                  : "hover:border-[#017FA4]/28 hover:bg-[#017FA4]/8 hover:text-[#6CCDBB]"
              }`}
              title="Get Hacker Tracker apps"
            >
              <DevicePhoneMobileIcon className="h-5 w-5" aria-hidden="true" />
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
