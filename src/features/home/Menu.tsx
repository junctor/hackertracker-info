import { ArrowTopRightOnSquareIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";

import {
  HOME_HERO_LOGO_WRAP_CLASS_NAME,
  HOME_HERO_STACK_CLASS_NAME,
  HOME_SECTION_CLASS_NAME,
  useHomeModel,
} from "@/features/home/homeModel";
import { ConferenceManifest } from "@/lib/conferences";
import { getSiteMenu } from "@/lib/menu";

type Props = {
  conference: ConferenceManifest;
};

const menuHeaderShellClassName =
  "ui-card mb-5 rounded-[1.9rem] border border-white/10 bg-slate-950/90 p-3 shadow-[0_24px_64px_rgba(2,6,23,0.3)] backdrop-blur-xl sm:mb-6 sm:p-4";

const menuHeaderPanelClassName =
  "rounded-[1.55rem] border border-white/8 bg-[linear-gradient(135deg,rgba(255,255,255,0.055),rgba(255,255,255,0.02))] px-4 py-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] sm:px-5 sm:py-4";

const menuAccentPillClassName =
  "inline-flex items-center gap-1.5 rounded-full border border-[#017FA4]/28 bg-[#017FA4]/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6CCDBB] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]";

const menuHeaderCountPillClassName =
  "inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]";

const menuCardClassName =
  "ui-card ui-card-interactive ui-focus-ring group/item relative isolate flex min-h-[11rem] w-full min-w-0 flex-col overflow-hidden rounded-[1.8rem] border border-white/10 bg-[linear-gradient(180deg,rgba(2,6,23,0.92),rgba(2,6,23,0.84))] p-4 text-left shadow-[0_18px_44px_rgba(2,6,23,0.24)] transition duration-200 ease-out hover:-translate-y-0.5 hover:border-white/14 hover:shadow-[0_28px_64px_rgba(2,6,23,0.34)] focus-visible:outline-none focus-visible:-translate-y-0.5 focus-visible:border-white/14 focus-visible:shadow-[0_28px_64px_rgba(2,6,23,0.34)] sm:min-h-[11.75rem] sm:p-5";

const menuCardIconClassName =
  "flex h-11 w-11 shrink-0 items-center justify-center rounded-[1.15rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.025))] text-slate-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-all duration-200 group-hover/item:border-[#017FA4]/32 group-hover/item:bg-[#017FA4]/12 group-hover/item:text-[#6CCDBB] group-focus-within/item:border-[#017FA4]/32 group-focus-within/item:bg-[#017FA4]/12 group-focus-within/item:text-[#6CCDBB] sm:h-12 sm:w-12";

const menuCardStatusPillClassName =
  "inline-flex items-center gap-1.5 rounded-full border border-[#017FA4]/24 bg-[#017FA4]/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6CCDBB] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]";

export default function Menu({ conference }: Props) {
  const home = useHomeModel(conference);
  const navMenu = getSiteMenu(conference);

  return (
    <section className={HOME_SECTION_CLASS_NAME}>
      <div className={`${HOME_HERO_STACK_CLASS_NAME} space-y-4`}>
        <h1 className="sr-only">{conference.name}</h1>
        <div className={HOME_HERO_LOGO_WRAP_CLASS_NAME}>
          <Image
            src={home.logoSrc}
            alt={home.logoAlt}
            fill
            priority
            sizes="(min-width: 1024px) 672px, (min-width: 640px) 66vw, 92vw"
            className="object-contain"
          />
        </div>
      </div>

      <nav aria-label={`${conference.name} sections`} className="mx-auto mt-10 max-w-6xl sm:mt-12">
        <div className={menuHeaderShellClassName}>
          <div className={menuHeaderPanelClassName}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <span className={menuAccentPillClassName}>Menu</span>
                <p className="hidden text-sm text-slate-400 md:block">
                  Jump directly into the core sections.
                </p>
              </div>
              <span className={menuHeaderCountPillClassName}>{navMenu.length} destinations</span>
            </div>
          </div>
        </div>

        <ul className="m-0 grid list-none gap-3.5 p-0 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {navMenu.map((item) => {
            const Icon = item.icon;
            const isExternal = item.href.startsWith("http");

            const content = (
              <>
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(1,127,164,0.14),transparent_40%)] opacity-0 transition-opacity duration-200 group-focus-within/item:opacity-100 group-hover/item:opacity-100"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/8"
                />

                <div className="relative z-10 flex h-full flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <span className={menuCardIconClassName}>
                      <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                    </span>

                    {isExternal ? (
                      <span className={menuCardStatusPillClassName}>
                        <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5" aria-hidden="true" />
                        External
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-4 min-w-0">
                    <div className="flex items-start gap-2.5">
                      <h2 className="min-w-0 flex-1 text-[15px] font-semibold tracking-[-0.01em] text-slate-100 transition-colors group-focus-within/item:text-white group-hover/item:text-white sm:text-base">
                        {item.title}
                      </h2>

                      <span className="mt-0.5 flex shrink-0 items-center justify-center text-slate-500 transition-all duration-200 group-focus-within/item:translate-x-0.5 group-focus-within/item:text-[#6CCDBB] group-hover/item:translate-x-0.5 group-hover/item:text-[#6CCDBB]">
                        {isExternal ? (
                          <ArrowTopRightOnSquareIcon className="h-4 w-4" aria-hidden="true" />
                        ) : (
                          <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
                        )}
                      </span>
                    </div>

                    {item.description ? (
                      <p className="mt-2 text-sm leading-6 text-slate-400 transition-colors duration-200 group-focus-within/item:text-slate-300 group-hover/item:text-slate-300">
                        {item.description}
                      </p>
                    ) : null}
                  </div>

                  <div className="mt-auto pt-5">
                    <div className="h-px w-full bg-linear-to-r from-white/10 via-white/6 to-transparent" />
                  </div>
                </div>
              </>
            );

            return (
              <li key={item.href}>
                {isExternal ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={menuCardClassName}
                  >
                    {content}
                  </a>
                ) : (
                  <Link href={item.href} className={menuCardClassName}>
                    {content}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </section>
  );
}
