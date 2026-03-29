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
        <div className="ui-card mb-4 rounded-3xl border-white/10 bg-slate-950/90 p-4 shadow-[0_24px_64px_rgba(2,6,23,0.28)] backdrop-blur-xl sm:mb-5 sm:p-5">
          <div className="rounded-2xl border border-white/8 bg-white/3 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
            <p className="text-[11px] font-semibold tracking-[0.16em] text-slate-500 uppercase">
              Navigate
            </p>
            <div className="mt-2 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-100 sm:text-base">
                  {conference.name}
                </p>
                <p className="mt-0.5 text-xs text-slate-400 sm:text-sm">
                  {navMenu.length} destinations
                </p>
              </div>
              <span className="shrink-0 rounded-full border border-[#017FA4]/30 bg-[#017FA4]/10 px-2.5 py-1 text-[11px] font-semibold tracking-[0.14em] text-[#6CCDBB] uppercase">
                Menu
              </span>
            </div>
          </div>
        </div>

        <ul className="m-0 grid list-none gap-3 p-0 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {navMenu.map((item) => {
            const Icon = item.icon;
            const isExternal = item.href.startsWith("http");
            const cardClassName =
              "ui-card ui-card-interactive ui-focus-ring group/item flex min-h-36 w-full min-w-0 flex-col rounded-3xl border border-white/10 bg-slate-950/82 p-4 text-left shadow-[0_18px_44px_rgba(2,6,23,0.24)] focus-visible:outline-none sm:min-h-40 sm:p-5";
            const content = (
              <>
                <div className="flex items-start justify-between gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/8 bg-white/3 text-slate-400 transition-colors group-hover/item:border-[#017FA4]/25 group-hover/item:bg-[#017FA4]/8 group-hover/item:text-[#6CCDBB]">
                    <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                  </span>

                  {isExternal ? (
                    <span className="rounded-full border border-white/10 bg-white/4 px-2 py-0.5 text-[10px] font-semibold tracking-[0.14em] text-slate-400 uppercase">
                      External
                    </span>
                  ) : null}
                </div>

                <div className="mt-4 min-w-0">
                  <h2 className="text-sm font-semibold text-slate-100 transition-colors group-hover/item:text-white sm:text-base">
                    {item.title}
                  </h2>
                  {item.description ? (
                    <p className="mt-1 text-xs leading-5 text-slate-400 sm:text-sm">
                      {item.description}
                    </p>
                  ) : null}
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
                    className={cardClassName}
                  >
                    {content}
                  </a>
                ) : (
                  <Link href={item.href} className={cardClassName}>
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
