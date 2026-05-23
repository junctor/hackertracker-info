import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router";

import Head from "@/components/Head";
import Image from "@/components/Image";
import Countdown from "@/features/home/Countdown";
import { aiMetadata, conferenceDataFeeds, SITE_DESCRIPTION } from "@/lib/aiMetadata";
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
const TITLE_INTERACTION_COOLDOWN_MS = 200;
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

function prefersReducedMotion() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
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
  const titleIndexRef = useRef(0);
  const titleTweenRef = useRef<gsap.core.Tween | null>(null);
  const isAnimatingTitleRef = useRef(false);
  const lastTitleInteractionRef = useRef(0);

  useGSAP(() => {
    const el = titleRef.current;
    if (!el) return;

    el.textContent = TITLE_CYCLE[titleIndexRef.current];

    return () => {
      titleTweenRef.current?.kill();
      titleTweenRef.current = null;
      isAnimatingTitleRef.current = false;
    };
  }, []);

  const cycleTitle = useCallback(() => {
    const el = titleRef.current;
    if (!el) return;

    const now = Date.now();
    if (
      isAnimatingTitleRef.current ||
      now - lastTitleInteractionRef.current < TITLE_INTERACTION_COOLDOWN_MS
    ) {
      return;
    }

    lastTitleInteractionRef.current = now;

    const nextTitleIndex = (titleIndexRef.current + 1) % TITLE_CYCLE.length;
    const nextTitle = TITLE_CYCLE[nextTitleIndex];

    if (prefersReducedMotion()) {
      titleTweenRef.current?.kill();
      titleTweenRef.current = null;
      el.textContent = nextTitle;
      titleIndexRef.current = nextTitleIndex;
      isAnimatingTitleRef.current = false;
      return;
    }

    isAnimatingTitleRef.current = true;
    titleTweenRef.current?.kill();

    titleTweenRef.current = gsap.to(el, {
      duration: 0.85,
      ease: "none",
      overwrite: "auto",
      scrambleText: {
        text: nextTitle,
        chars: TITLE_SCRAMBLE_CHARS,
        speed: 0.45,
        revealDelay: 0.08,
        tweenLength: true,
      },
      onComplete: () => {
        el.textContent = nextTitle;
        titleIndexRef.current = nextTitleIndex;
        titleTweenRef.current = null;
        isAnimatingTitleRef.current = false;
      },
      onInterrupt: () => {
        titleTweenRef.current = null;
        isAnimatingTitleRef.current = false;
      },
    });
  }, []);

  return (
    <>
      <Head>
        <title>info.defcon.org | DEF CON schedules and conference information</title>
        {aiMetadata({
          title: "info.defcon.org | DEF CON schedules and conference information",
          description: SITE_DESCRIPTION,
          path: "/",
          jsonFeeds: Object.values(CONFERENCES).flatMap(conferenceDataFeeds),
        })}
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main id="main-content" className="ui-page-shell ui-homepage-shell">
        <div aria-hidden="true" className="ui-homepage-ambient" />
        <div aria-hidden="true" className="ui-homepage-grid" />
        <div aria-hidden="true" className="ui-homepage-top-light" />

        <div className="ui-container ui-homepage-content">
          <header className="ui-homepage-header">
            <h1>
              <button
                type="button"
                onPointerEnter={cycleTitle}
                onClick={cycleTitle}
                className="ui-focus-ring ui-homepage-title-button"
                aria-label="Cycle DEF CON title style"
              >
                <span ref={titleRef} className="ui-homepage-title ui-homepage-title-display">
                  {TITLE_CYCLE[0]}
                </span>
              </button>
            </h1>

            <div className="ui-homepage-title-rule" />
          </header>

          <section aria-label="Available conferences" className="ui-homepage-card-grid">
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
      className="ui-focus-ring ui-home-conference-card"
    >
      <span aria-hidden="true" className="ui-home-conference-card-accent" />

      <span aria-hidden="true" className="ui-home-conference-card-glow">
        <span className="ui-home-conference-card-sheen" />
      </span>

      <div className="ui-home-conference-card-shell">
        <div className="ui-home-conference-card-panel">
          <div aria-hidden="true" className="ui-home-conference-card-grid" />

          <div aria-hidden="true" className="ui-home-conference-card-top-light" />

          <div className="ui-home-conference-card-content">
            <div className="ui-home-conference-card-copy">
              <div className="ui-kicker ui-home-conference-card-name">{conference.name}</div>
              <p className="ui-home-conference-card-date">{subtitle}</p>
            </div>

            <div className="ui-home-conference-card-logo">
              <Image
                src={src}
                alt={`${conference.name} logo`}
                fillContainer
                sizes="(min-width: 1024px) 480px, (min-width: 640px) 46vw, 92vw"
                className="ui-home-conference-card-logo-image"
              />
            </div>
          </div>
        </div>

        {showCountdown && (
          <div className="ui-home-conference-countdown">
            <span className="ui-visually-hidden">Conference starts in</span>
            <Countdown conference={conference} size="tiny" />
          </div>
        )}
      </div>
    </Link>
  );
}
