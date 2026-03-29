import {
  ChevronDownIcon,
  ChevronRightIcon,
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

            <div className="hidden min-w-0 items-center md:flex">
              <span className="inline-flex min-w-0 items-center gap-2 truncate rounded-full border border-white/12 bg-white/5 px-3.5 py-1.5 text-[11px] font-semibold tracking-[0.12em] text-slate-200 uppercase shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#6CCDBB]"
                />
                <span className="truncate">{pageTitle}</span>
              </span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <nav aria-label="Primary">
              <details className="group relative">
                <summary
                  className={`ui-btn-base ui-btn-secondary flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-xl border-white/10 bg-white/4 px-3.5 text-left text-sm text-slate-100 shadow-[0_10px_28px_rgba(2,6,23,0.18)] transition duration-200 ease-out group-open:border-[#017FA4]/36 group-open:bg-[#0D294A]/50 group-open:text-white group-open:shadow-[0_18px_42px_rgba(2,6,23,0.3)] [&::-webkit-details-marker]:hidden ${focusRingClass}`}
                >
                  <RocketLaunchIcon
                    className="h-4.5 w-4.5 shrink-0 text-[#6CCDBB]"
                    aria-hidden="true"
                  />

                  <span className="font-semibold tracking-[-0.01em] text-slate-100">Menu</span>

                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/4.5 text-slate-400 transition-colors group-open:bg-[#017FA4]/18 group-open:text-[#6CCDBB]">
                    <ChevronDownIcon
                      className="h-4 w-4 transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none"
                      aria-hidden="true"
                    />
                  </span>
                </summary>

                <div className="absolute top-full right-0 w-[min(24rem,calc(100vw-1rem))] pt-2">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute top-0 right-7 flex h-2.5 w-5 items-start justify-center"
                  >
                    <span className="h-2.5 w-px rounded-full bg-[#017FA4]/35" />
                  </div>

                  <div className="ui-card relative max-h-[min(34rem,calc(100dvh-5rem))] overflow-y-auto overscroll-contain rounded-[1.55rem] border border-white/12 bg-slate-950/98 p-3 shadow-[0_20px_48px_rgba(0,0,0,0.42)] backdrop-blur-md before:pointer-events-none before:absolute before:top-0 before:right-6 before:h-3 before:w-3 before:-translate-y-1/2 before:rotate-45 before:rounded-sm before:border before:border-white/12 before:bg-slate-950/98 before:content-['']">
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/10"
                    />

                    <ul className="grid gap-1.5">
                      {menuItems.map(({ title, href, description, icon: Icon }) => {
                        const isActive = href === activeHref;
                        const itemClassName = `group/item relative flex items-start gap-3 overflow-hidden rounded-[1.2rem] border px-3 py-3 text-left transition duration-200 ease-out ${focusRingClass} ${
                          isActive
                            ? "border-[#017FA4]/36 bg-[linear-gradient(135deg,rgba(13,41,74,0.86),rgba(15,23,42,0.96))] text-white shadow-[0_14px_34px_rgba(2,6,23,0.24),inset_0_1px_0_rgba(255,255,255,0.06)]"
                            : "border-white/6 bg-white/[0.02] text-slate-200 hover:border-white/10 hover:bg-white/[0.045] hover:text-slate-50 focus-visible:border-white/10 focus-visible:bg-white/[0.045] focus-visible:text-slate-50"
                        }`;
                        const iconClassName = `mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[1rem] border shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-colors ${
                          isActive
                            ? "border-[#017FA4]/30 bg-[#017FA4]/12 text-[#6CCDBB]"
                            : "border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] text-slate-400 group-hover/item:border-[#017FA4]/24 group-hover/item:bg-[#017FA4]/10 group-hover/item:text-[#6CCDBB] group-focus-within/item:border-[#017FA4]/24 group-focus-within/item:bg-[#017FA4]/10 group-focus-within/item:text-[#6CCDBB]"
                        }`;
                        const trailingClassName = `mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all duration-200 ${
                          isActive
                            ? "border-[#017FA4]/26 bg-[#017FA4]/14 text-[#6CCDBB]"
                            : "border-white/8 bg-white/3 text-slate-500 group-hover/item:translate-x-0.5 group-hover/item:border-white/12 group-hover/item:bg-white/5 group-hover/item:text-slate-300 group-focus-within/item:translate-x-0.5 group-focus-within/item:border-white/12 group-focus-within/item:bg-white/5 group-focus-within/item:text-slate-300"
                        }`;

                        return (
                          <li key={href}>
                            <Link
                              href={href}
                              aria-current={isActive ? "page" : undefined}
                              className={itemClassName}
                            >
                              <span
                                aria-hidden="true"
                                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(1,127,164,0.12),transparent_42%)] opacity-0 transition-opacity duration-200 group-focus-within/item:opacity-100 group-hover/item:opacity-100"
                              />

                              <span className={iconClassName}>
                                <Icon className="h-4.5 w-4.5 shrink-0" aria-hidden="true" />
                              </span>

                              <span className="relative z-10 min-w-0 flex-1">
                                <span className="truncate text-sm font-semibold tracking-[-0.01em]">
                                  {title}
                                </span>

                                {description ? (
                                  <span
                                    className={`mt-1 block text-[13px] leading-5 ${
                                      isActive ? "text-slate-300" : "text-slate-400"
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
