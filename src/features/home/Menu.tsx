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

const menuCardClassName =
  "ui-card ui-card-interactive ui-focus-ring group/item relative isolate flex min-h-[10.5rem] w-full min-w-0 flex-col overflow-hidden rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(5,11,25,0.94),rgba(2,6,23,0.84))] p-4 text-left shadow-[0_18px_44px_rgba(2,6,23,0.24)] transition duration-200 ease-out hover:-translate-y-0.5 hover:border-white/14 hover:shadow-[0_28px_64px_rgba(2,6,23,0.34)] focus-visible:outline-none focus-visible:-translate-y-0.5 focus-visible:border-white/14 focus-visible:shadow-[0_28px_64px_rgba(2,6,23,0.34)] sm:min-h-[11rem] sm:p-5";

const menuCardIconClassName =
  "flex h-10 w-10 shrink-0 items-center justify-center rounded-[1rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.025))] text-slate-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-all duration-200 group-hover/item:border-[#017FA4]/32 group-hover/item:bg-[#017FA4]/12 group-hover/item:text-[#6CCDBB] group-focus-within/item:border-[#017FA4]/32 group-focus-within/item:bg-[#017FA4]/12 group-focus-within/item:text-[#6CCDBB] sm:h-11 sm:w-11";

const menuCardActionClassName =
  "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/8 bg-white/3 text-slate-500 transition-all duration-200 group-hover/item:translate-x-0.5 group-hover/item:border-white/12 group-hover/item:bg-white/5 group-hover/item:text-slate-300 group-focus-within/item:translate-x-0.5 group-focus-within/item:border-white/12 group-focus-within/item:bg-white/5 group-focus-within/item:text-slate-300";

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

                <div className="relative z-10 flex h-full flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <span className={menuCardIconClassName}>
                      <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                    </span>

                    <span className={menuCardActionClassName}>
                      {isExternal ? (
                        <ArrowTopRightOnSquareIcon className="h-4 w-4" aria-hidden="true" />
                      ) : (
                        <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
                      )}
                    </span>
                  </div>

                  <div className="mt-4 min-w-0">
                    <div className="flex items-start gap-2.5">
                      <h2 className="min-w-0 flex-1 text-[15px] font-semibold tracking-[-0.01em] text-slate-100 transition-colors group-focus-within/item:text-white group-hover/item:text-white sm:text-base">
                        {item.title}
                        {isExternal ? <span className="sr-only">, opens in a new tab</span> : null}
                      </h2>
                    </div>

                    {item.description ? (
                      <p className="mt-2 text-sm leading-6 text-slate-400 transition-colors duration-200 group-focus-within/item:text-slate-300 group-hover/item:text-slate-300">
                        {item.description}
                      </p>
                    ) : null}
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
