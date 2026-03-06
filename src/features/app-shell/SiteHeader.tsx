import { DevicePhoneMobileIcon, RocketLaunchIcon } from "@heroicons/react/24/outline";
import localFont from "next/font/local";
import Link from "next/link";
import { useMemo } from "react";

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
  const menuItems = useMemo(() => getSiteMenu(conference), [conference]);
  const pageTitle = getPageTitle(activePageId);
  const activeHref = useMemo(() => {
    if (activePageId === "home") return `/${conference.slug}`;
    if (activePageId === "readme") return `/${conference.slug}/readme.nfo`;
    return `/${conference.slug}/${activePageId}`;
  }, [activePageId, conference.slug]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/85 px-4 py-3 text-white shadow-[inset_0_-1px_0_rgba(255,255,255,0.04)] backdrop-blur-md sm:px-5">
      <div className="flex w-full items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3 sm:gap-5">
          <div className="flex min-w-0 items-center gap-3">
            <Link href={`/${conference.slug}`} className={`rounded-md px-1 py-1 ${focusRingClass}`}>
              <span className={`${museoFont.className} logo text-2xl font-bold md:text-3xl`}>
                <span className="block md:hidden">{conference.code}</span>
                <span className="hidden max-w-96 truncate md:block">{conference.name}</span>
              </span>
            </Link>

            <span className="hidden truncate text-sm text-slate-400 sm:inline">{pageTitle}</span>
          </div>

          <nav aria-label="Primary">
            <details className="relative">
              <summary
                className={`flex cursor-pointer items-center gap-1.5 rounded-lg border border-white/10 bg-white/3 px-3 py-2 text-sm text-slate-200 transition-colors hover:bg-white/6 hover:text-(--accent-primary) ${focusRingClass}`}
              >
                <RocketLaunchIcon className="h-4 w-4 shrink-0" aria-hidden />
                <span>Explore</span>
              </summary>

              <div className="absolute top-full left-0 mt-2 max-h-[min(26rem,calc(100dvh-5.5rem))] w-[min(20rem,calc(100vw-2rem))] overflow-y-auto overscroll-contain rounded-xl border border-white/10 bg-slate-950/95 p-2 shadow-[0_18px_48px_rgba(0,0,0,0.45)]">
                <ul className="grid gap-2">
                  {menuItems.map(({ title, href, description, icon: Icon }) => {
                    const isActive = href === activeHref;

                    return (
                      <li key={title}>
                        <Link
                          href={href}
                          aria-current={isActive ? "page" : undefined}
                          className={`flex flex-col gap-1 rounded-lg px-3 py-2 text-sm transition-colors ${focusRingClass} ${
                            isActive
                              ? "bg-[#0D294A]/45 font-semibold text-white ring-1 ring-[#017FA4]/60"
                              : "text-slate-200 hover:bg-white/5 hover:text-[#6CCDBB]"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <Icon className="h-5 w-5 shrink-0" aria-hidden />
                            <span>{title}</span>
                            {isActive ? (
                              <span className="rounded border border-[#017FA4]/70 px-1.5 py-0.5 text-[10px] tracking-wide text-[#6CCDBB] uppercase">
                                Current
                              </span>
                            ) : null}
                          </span>

                          <span className="hidden text-xs text-slate-400 lg:block">
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

        <div className="flex items-center gap-1.5 sm:gap-2">
          <Link
            href={`/${conference.slug}/apps`}
            aria-label="Mobile Apps"
            className={`inline-flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-white/3 text-slate-300 transition hover:bg-[#017FA4]/15 hover:text-[#6CCDBB] ${focusRingClass}`}
          >
            <DevicePhoneMobileIcon className="h-5 w-5" aria-hidden />
          </Link>
        </div>
      </div>
    </header>
  );
}

type Props = {
  conference: ConferenceManifest;
  activePageId: PageId;
};
