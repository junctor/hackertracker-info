import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import React, { useMemo, useRef, useState } from "react";

import Countdown from "@/features/home/Countdown";
import { CONFERENCES, type ConferenceManifest } from "@/lib/conferences";

gsap.registerPlugin(useGSAP, ScrambleTextPlugin);

type ConferenceCardConfig = {
  conference: ConferenceManifest;
};

const HOME_CONFERENCE_CARDS: ReadonlyArray<ConferenceCardConfig> = [
  { conference: CONFERENCES.dcsg2026 },
  { conference: CONFERENCES.defcon34 },
];

const TITLE_CYCLE = [
  "DEF CON",
  "D3F CON",
  "DEF C0N",
  "D3F C0N",
  "D3F-C0N",
  "D3F_C0N",
  "STAHP IT",
] as const;

export default function Home() {
  const titleRef = useRef<HTMLSpanElement | null>(null);
  const [mouseOverCount, setMouseOverCount] = useState(0);

  const title = useMemo(() => TITLE_CYCLE[mouseOverCount % TITLE_CYCLE.length], [mouseOverCount]);

  useGSAP(
    () => {
      const el = titleRef.current;
      if (!el) return;

      const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

      el.textContent = title;
      if (prefersReduced) return;

      gsap.killTweensOf(el);

      gsap.fromTo(
        el,
        { opacity: 1 },
        {
          duration: 1.2,
          ease: "none",
          scrambleText: {
            text: title,
            chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-/\\[]{}()<>|",
            speed: 0.25,
          },
        },
      );
    },
    { dependencies: [title] },
  );

  const handleTitlePointerEnter = () => {
    setMouseOverCount((prev) => prev + 1);
  };

  return (
    <>
      <Head>
        <title>info.defcon.org</title>
        <meta name="description" content="DEF CON conference schedules and information" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="relative min-h-dvh overflow-hidden bg-slate-950 text-slate-100">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.14),transparent_30%),radial-gradient(circle_at_20%_30%,rgba(251,191,36,0.10),transparent_22%),radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.12),transparent_20%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-size-[40px_40px] opacity-[0.14]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(255,255,255,0.2),transparent)] bg-size-[100%_6px] opacity-[0.06]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-linear-to-b from-white/5 to-transparent"
        />

        <div className="relative mx-auto max-w-6xl px-4 pt-16 pb-14 sm:px-6 sm:pt-20 sm:pb-20 lg:px-8 lg:pt-24">
          <header className="mx-auto max-w-3xl text-center">
            <h1>
              <span
                ref={titleRef}
                aria-label="DEF CON"
                onPointerEnter={handleTitlePointerEnter}
                className="inline-block cursor-pointer font-mono text-7xl leading-none font-semibold tracking-[0.14em] text-slate-50 select-none sm:text-8xl md:text-9xl lg:text-[10rem]"
              >
                {title}
              </span>
            </h1>

            <div className="mx-auto mt-6 h-px w-28 bg-linear-to-r from-transparent via-slate-600 to-transparent sm:mt-7 sm:w-32" />
          </header>

          <section
            aria-label="Available conferences"
            className="mt-10 grid grid-cols-1 gap-5 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:gap-7"
          >
            {HOME_CONFERENCE_CARDS.map(({ conference }) => (
              <ConferenceCard key={conference.slug} conference={conference} />
            ))}
          </section>
        </div>
      </main>
    </>
  );
}

function ConferenceCard({ conference }: { conference: ConferenceManifest }) {
  const href = `/${conference.slug}`;
  const src = `/images/${conference.logoFile}`;

  const accentClasses =
    conference.slug === "dcsg2026"
      ? {
          border:
            "bg-[linear-gradient(135deg,rgba(34,197,94,0.38),rgba(59,130,246,0.34),rgba(168,85,247,0.30))]",
          glow: "bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.20),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.18),transparent_36%)]",
          ring: "group-hover:border-emerald-300/20",
        }
      : {
          border:
            "bg-[linear-gradient(135deg,rgba(251,191,36,0.40),rgba(244,114,182,0.28),rgba(96,165,250,0.32))]",
          glow: "bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.20),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(96,165,250,0.18),transparent_36%)]",
          ring: "group-hover:border-amber-300/20",
        };

  return (
    <Link
      href={href}
      className="group relative block overflow-hidden rounded-3xl p-px shadow-[0_10px_30px_rgba(0,0,0,0.28)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_rgba(0,0,0,0.38)] focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 rounded-3xl opacity-80 transition duration-300 group-hover:opacity-100 ${accentClasses.border}`}
      />

      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100"
      >
        <span className={`absolute inset-0 rounded-3xl ${accentClasses.glow}`} />
        <span className="absolute top-0 -left-1/3 h-full w-1/2 -skew-x-12 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.55),transparent)] opacity-0 transition duration-700 group-hover:translate-x-[240%] group-hover:opacity-100" />
      </span>

      <div className="relative rounded-[calc(var(--radius-3xl)-1px)] border border-white/10 bg-slate-900/90 p-3.5 backdrop-blur-md sm:p-4">
        <div
          className={`relative overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),rgba(15,23,42,0.92))] px-5 pt-4 pb-4 transition duration-300 sm:px-6 sm:pt-5 sm:pb-5 ${accentClasses.ring}`}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-size-[28px_28px] opacity-40"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-14 bg-linear-to-b from-white/6 to-transparent sm:h-16"
          />

          <div className="relative z-10">
            <div className="text-center">
              <div className="text-sm font-semibold tracking-[0.14em] text-slate-200 uppercase sm:text-base">
                {conference.name}
              </div>
            </div>

            <div className="relative mt-3 aspect-16/6 w-full sm:mt-4">
              <Image
                src={src}
                alt={`${conference.name} logo`}
                fill
                sizes="(min-width: 1024px) 480px, (min-width: 640px) 46vw, 92vw"
                className="object-contain transition duration-300 group-hover:-translate-y-0.5 group-hover:scale-[1.035]"
              />
            </div>
          </div>
        </div>

        <div className="mt-3 rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:mt-4 sm:py-3">
          <div className="mb-1.5 text-center text-[10px] tracking-[0.22em] text-slate-500 uppercase sm:mb-2">
            Countdown to kickoff
          </div>
          <Countdown conference={conference} size="tiny" />
        </div>
      </div>
    </Link>
  );
}
