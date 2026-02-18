import Image from "next/image";
import { getSiteMenu } from "@/lib/menu";
import Link from "next/link";
import { ConferenceManifest } from "@/lib/conferences";
import { useMemo } from "react";
import {
  HOME_HERO_LOGO_WRAP_CLASS_NAME,
  HOME_HERO_STACK_CLASS_NAME,
  HOME_MENU_TILE_CLASS_NAME,
  HOME_SECTION_CLASS_NAME,
  useHomeModel,
} from "@/features/home/homeModel";

type Props = {
  conference: ConferenceManifest;
};

export default function Menu({ conference }: Props) {
  const home = useHomeModel(conference);
  const navMenu = useMemo(() => getSiteMenu(conference), [conference]);

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
            sizes="(min-width: 1024px) 520px, (min-width: 640px) 58vw, 90vw"
            className="object-contain"
          />
        </div>
      </div>
      <nav aria-label={`${conference.name} sections`} className="mt-10 sm:mt-12">
        <ul className="m-0 grid list-none grid-cols-2 gap-4 p-0 sm:grid-cols-3 sm:gap-5 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {navMenu.map((item) => {
            const Icon = item.icon;
            const isExternal = item.href.startsWith("http");
            const tileContent = (
              <>
                <Icon className="h-6 w-6 text-gray-200" aria-hidden />
                <span className="text-sm font-semibold text-gray-100">
                  {item.title}
                </span>
              </>
            );

            return (
              <li key={item.sort_order}>
                {isExternal ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={HOME_MENU_TILE_CLASS_NAME}
                  >
                    {tileContent}
                  </a>
                ) : (
                  <Link href={item.href} className={HOME_MENU_TILE_CLASS_NAME}>
                    {tileContent}
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
