import Countdown from "@/features/home/Countdown";
import Image from "next/image";
import Link from "next/link";
import { ConferenceManifest } from "@/lib/conferences";
import { useRouter } from "next/router";
import { useEffect } from "react";
import {
  hasKickoffPassed,
  HOME_ACTION_LINK_CLASS_NAME,
  HOME_HERO_LOGO_WRAP_CLASS_NAME,
  HOME_HERO_STACK_CLASS_NAME,
  HOME_SECTION_CLASS_NAME,
  museoFont,
  useHomeModel,
} from "@/features/home/homeModel";

type Props = {
  conference: ConferenceManifest;
};

export default function Splash({ conference }: Props) {
  const router = useRouter();
  const home = useHomeModel(conference);
  const hasKickoffStarted = hasKickoffPassed(home.kickoffDateMs);

  useEffect(() => {
    const redirectIfLive = () => {
      if (hasKickoffPassed(home.kickoffDateMs)) {
        router.replace(home.menuHref);
      }
    };

    redirectIfLive();
    const intervalId = setInterval(redirectIfLive, 60_000);
    return () => clearInterval(intervalId);
  }, [home.kickoffDateMs, home.menuHref, router]);

  return (
    <section className={HOME_SECTION_CLASS_NAME}>
      <div className={`${HOME_HERO_STACK_CLASS_NAME} space-y-4`}>
        <h1 className="sr-only">{conference.name}</h1>
        <div className={HOME_HERO_LOGO_WRAP_CLASS_NAME}>
          <Link
            href={home.menuHref}
            className="block h-full w-full rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            <Image
              src={home.logoSrc}
              alt={home.logoAlt}
              fill
              priority
              sizes="(min-width: 1024px) 520px, (min-width: 640px) 52vw, 90vw"
              className="object-contain"
            />
          </Link>
        </div>
        <time
          dateTime={conference.begin}
          className={`text-xs uppercase tracking-[0.16em] text-gray-300/90 sm:text-sm sm:tracking-[0.22em] md:text-base ${museoFont.className}`}
        >
          {conference.dateLabel}
        </time>

        <Link
          href={home.menuHref}
          className={HOME_ACTION_LINK_CLASS_NAME}
        >
          View Menu
        </Link>

        {!hasKickoffStarted && <Countdown conference={conference} />}
      </div>
    </section>
  );
}
