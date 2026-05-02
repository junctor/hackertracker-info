import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router";

import Head from "@/components/Head";
import Image from "@/components/Image";
import Countdown from "@/features/home/Countdown";
import { CONFERENCES, type ConferenceManifest } from "@/lib/conferences";

gsap.registerPlugin(useGSAP, ScrambleTextPlugin);

type ConferenceCardConfig = {
  conference: ConferenceManifest;
  subtitle: string;
};

const conferenceDateFormatter = (timeZone: string) =>
  new Intl.DateTimeFormat("en-US", {
    timeZone,
    month: "long",
    day: "numeric",
    year: "numeric",
    weekday: "long",
  });

const formatConferenceDate = (date: string, timeZone: string) =>
  conferenceDateFormatter(timeZone).format(new Date(date));

const HOME_CONFERENCE_CARDS: ReadonlyArray<ConferenceCardConfig> = [
  {
    conference: CONFERENCES.dcsg2026,
    subtitle: formatConferenceDate(CONFERENCES.dcsg2026.kickoff, CONFERENCES.dcsg2026.timezone),
  },
  {
    conference: CONFERENCES.defcon34,
    subtitle: formatConferenceDate(CONFERENCES.defcon34.kickoff, CONFERENCES.defcon34.timezone),
  },
];

const TITLE_CYCLE = ["DEF CON", "D3F CON", "DEF C0N", "D3F C0N", "D3F_C0N", "STAHP IT"] as const;
const TITLE_SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-/\\[]{}()<>|";
const MAX_COUNTDOWN_REFRESH_DELAY_MS = 2_147_483_647;

function hasActiveCountdown(kickoff: string, nowMs = Date.now()) {
  const kickoffMs = Date.parse(kickoff);
  return Number.isFinite(kickoffMs) && kickoffMs > nowMs;
}

function getCountdownRefreshDelay(kickoff: string) {
  const kickoffMs = Date.parse(kickoff);
  if (!Number.isFinite(kickoffMs)) return null;

  const remainingMs = kickoffMs - Date.now();
  if (remainingMs <= 0) return 0;

  return Math.min(remainingMs + 1000, MAX_COUNTDOWN_REFRESH_DELAY_MS);
}

function useHasActiveCountdown(kickoff: string) {
  const [isActive, setIsActive] = useState(() => hasActiveCountdown(kickoff));

  useEffect(() => {
    setIsActive(hasActiveCountdown(kickoff));

    const refreshDelay = getCountdownRefreshDelay(kickoff);
    if (refreshDelay === null || refreshDelay <= 0) return;

    const timeoutId = setTimeout(() => {
      setIsActive(hasActiveCountdown(kickoff));
    }, refreshDelay);

    return () => clearTimeout(timeoutId);
  }, [kickoff]);

  return isActive;
}

export default function Home() {
  const titleRef = useRef<HTMLSpanElement | null>(null);
  const [interactionCount, setInteractionCount] = useState(0);

  const title = useMemo(
    () => TITLE_CYCLE[interactionCount % TITLE_CYCLE.length],
    [interactionCount],
  );

  useGSAP(
    () => {
      const el = titleRef.current;
      if (!el) return;

      const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

      el.textContent = title;
      if (prefersReducedMotion) return;

      gsap.killTweensOf(el);
      gsap.fromTo(
        el,
        { opacity: 1 },
        {
          duration: 1.2,
          ease: "none",
          scrambleText: {
            text: title,
            chars: TITLE_SCRAMBLE_CHARS,
            speed: 0.25,
          },
        },
      );
    },
    { dependencies: [title] },
  );

  const cycleTitle = () => {
    setInteractionCount((prev) => prev + 1);
  };

  return (
    <>
      <Head>
        <title>info.defcon.org | DEF CON schedules and conference information</title>
        <meta
          name="description"
          content="Official DEF CON schedules and conference information for current and upcoming events."
        />
        <meta
          property="og:title"
          content="info.defcon.org | DEF CON schedules and conference information"
        />
        <meta
          property="og:description"
          content="Official DEF CON schedules and conference information for current and upcoming events."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://info.defcon.org" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main id="main-content" className="ui-page-shell ui-homepage-shell relative overflow-hidden">
        <div
          aria-hidden="true"
          className="ui-homepage-ambient pointer-events-none absolute inset-0"
        />
        <div aria-hidden="true" className="ui-homepage-grid pointer-events-none absolute inset-0" />
        <div
          aria-hidden="true"
          className="ui-homepage-top-light pointer-events-none absolute inset-x-0 top-0 h-40"
        />

        <div className="ui-container relative pt-16 pb-14 sm:pt-20 sm:pb-20 lg:pt-24">
          <header className="mx-auto max-w-4xl text-center">
            <h1>
              <button
                type="button"
                onPointerEnter={cycleTitle}
                onClick={cycleTitle}
                className="ui-focus-ring inline-flex items-center justify-center rounded-xl bg-transparent p-0 text-inherit focus-visible:outline-none"
                aria-label="Cycle DEF CON title style"
              >
                <span
                  ref={titleRef}
                  className="ui-homepage-title ui-homepage-title-display inline-block max-w-full cursor-pointer text-center font-mono leading-none font-semibold transition select-none"
                >
                  {title}
                </span>
              </button>
            </h1>

            <div className="ui-homepage-title-rule mx-auto mt-6 h-px w-28 sm:mt-7 sm:w-32" />
          </header>

          <section
            aria-label="Available conferences"
            className="mt-10 grid grid-cols-1 gap-5 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:gap-7"
          >
            {HOME_CONFERENCE_CARDS.map(({ conference, subtitle }) => (
              <ConferenceCard key={conference.slug} conference={conference} subtitle={subtitle} />
            ))}
          </section>
        </div>
      </main>
    </>
  );
}

function ConferenceCard({
  conference,
  subtitle,
}: {
  conference: ConferenceManifest;
  subtitle: string;
}) {
  const href = `/${conference.slug}`;
  const src = `/images/${conference.logoFile}`;
  const showCountdown = useHasActiveCountdown(conference.kickoff);

  return (
    <Link
      to={href}
      aria-label={`View ${conference.name}`}
      className="ui-focus-ring ui-home-conference-card group relative block h-full overflow-hidden rounded-3xl p-px transition duration-300 hover:-translate-y-1.5 focus-visible:outline-none"
    >
      <span
        aria-hidden="true"
        className="ui-home-conference-card-accent pointer-events-none absolute inset-0 rounded-3xl transition duration-300"
      />

      <span
        aria-hidden="true"
        className="ui-home-conference-card-glow pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100"
      >
        <span className="ui-home-conference-card-sheen absolute top-0 -left-1/3 h-full w-1/2 -skew-x-12 opacity-0 transition duration-700 group-hover:opacity-100" />
      </span>

      <div className="ui-home-conference-card-shell relative flex h-full flex-col p-3.5 backdrop-blur-md sm:p-4">
        <div className="ui-home-conference-card-panel relative flex flex-1 flex-col justify-center overflow-hidden rounded-2xl px-5 pt-4 pb-4 transition duration-300 sm:px-6 sm:pt-5 sm:pb-5">
          <div
            aria-hidden="true"
            className="ui-home-conference-card-grid pointer-events-none absolute inset-0"
          />

          <div
            aria-hidden="true"
            className="ui-home-conference-card-top-light pointer-events-none absolute inset-x-0 top-0 h-14 sm:h-16"
          />

          <div className="relative z-10">
            <div className="text-center">
              <div className="ui-kicker ui-home-conference-card-name sm:text-base">
                {conference.name}
              </div>
              <p className="ui-home-conference-card-date mt-2 text-sm leading-6">{subtitle}</p>
            </div>

            <div className="relative mt-4 aspect-16/6 w-full sm:mt-5">
              <Image
                src={src}
                alt={`${conference.name} logo`}
                fill
                sizes="(min-width: 1024px) 480px, (min-width: 640px) 46vw, 92vw"
                className="object-contain transition duration-300 group-hover:-translate-y-0.5 group-hover:scale-105"
              />
            </div>
          </div>
        </div>

        {showCountdown && (
          <div className="ui-home-conference-countdown mt-3 rounded-xl px-3 py-2.5 sm:mt-4 sm:py-3">
            <span className="sr-only">Conference starts in</span>
            <Countdown conference={conference} size="tiny" />
          </div>
        )}
      </div>
    </Link>
  );
}
