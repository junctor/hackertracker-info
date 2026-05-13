import { useEffect } from "react";
import { Link, useNavigate } from "react-router";

import Image from "@/components/Image";
import Countdown from "@/features/home/Countdown";
import {
  hasKickoffPassed,
  HOME_ACTION_LINK_CLASS_NAME,
  HOME_HERO_LOGO_WRAP_CLASS_NAME,
  HOME_HERO_STACK_CLASS_NAME,
  HOME_SECTION_CLASS_NAME,
  museoFont,
  useHomeModel,
} from "@/features/home/homeModel";
import { ConferenceManifest } from "@/lib/conferences";

type Props = {
  conference: ConferenceManifest;
};

export default function Splash({ conference }: Props) {
  const navigate = useNavigate();
  const home = useHomeModel(conference);
  const hasKickoffStarted = hasKickoffPassed(home.kickoffDateMs);

  useEffect(() => {
    const redirectIfLive = () => {
      if (hasKickoffPassed(home.kickoffDateMs)) {
        navigate(home.menuHref, { replace: true });
      }
    };

    redirectIfLive();
    const intervalId = setInterval(redirectIfLive, 60_000);
    return () => clearInterval(intervalId);
  }, [home.kickoffDateMs, home.menuHref, navigate]);

  return (
    <section className={HOME_SECTION_CLASS_NAME}>
      <div className={`${HOME_HERO_STACK_CLASS_NAME} space-y-4`}>
        <h1 className="sr-only">{conference.name}</h1>
        <div className={HOME_HERO_LOGO_WRAP_CLASS_NAME}>
          <Link
            to={home.menuHref}
            className="ui-focus-ring block h-full w-full rounded-md focus-visible:outline-none"
          >
            <Image
              src={home.logoSrc}
              alt={home.logoAlt}
              fillContainer
              loading="eager"
              sizes="(min-width: 1024px) 520px, (min-width: 640px) 52vw, 90vw"
              className="object-contain"
            />
          </Link>
        </div>
        <time
          dateTime={conference.begin}
          className={`text-xs tracking-widest text-slate-300/90 uppercase sm:text-sm md:text-base ${museoFont.className}`}
        >
          {conference.dateLabel}
        </time>

        <Link to={home.menuHref} className={HOME_ACTION_LINK_CLASS_NAME}>
          View Menu
        </Link>

        {!hasKickoffStarted && <Countdown conference={conference} />}
      </div>
    </section>
  );
}
