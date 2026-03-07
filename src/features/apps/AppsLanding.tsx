import { useGSAP } from "@gsap/react";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import gsap from "gsap";
import { useMemo, useRef, useState } from "react";

import { type ConferenceManifest } from "@/lib/conferences";

gsap.registerPlugin(useGSAP);

type Props = {
  conference: ConferenceManifest;
};

type Platform = {
  name: string;
  url: string;
  text: string;
  eyebrow: string;
  accentClassName: string;
  accentGlowClassName: string;
};

const PLATFORMS: ReadonlyArray<Platform> = [
  {
    name: "iOS",
    url: "https://apps.apple.com/us/app/hackertracker/id1021141595?mt=8",
    text: "Download on the App Store",
    eyebrow: "Native iPhone app",
    accentClassName:
      "border-white/20 bg-white text-slate-950 hover:bg-slate-100 focus-visible:bg-slate-100",
    accentGlowClassName: "bg-white/20",
  },
  {
    name: "Android",
    url: "https://play.google.com/store/apps/details?id=com.shortstack.hackertracker",
    text: "Get it on Google Play",
    eyebrow: "Native Android app",
    accentClassName:
      "border-emerald-400/30 bg-emerald-500 text-white hover:bg-emerald-400 focus-visible:bg-emerald-400",
    accentGlowClassName: "bg-emerald-400/20",
  },
  {
    name: "Web",
    url: "https://info.defcon.org",
    text: "View the Schedule",
    eyebrow: "Fast responsive web app",
    accentClassName:
      "border-cyan-400/30 bg-[#017FA4] text-white hover:bg-[#028cb5] focus-visible:bg-[#028cb5]",
    accentGlowClassName: "bg-cyan-400/20",
  },
];

export default function AppsLanding({ conference }: Props) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const subtitleRef = useRef<HTMLParagraphElement | null>(null);
  const buttonsRef = useRef<Array<HTMLAnchorElement | null>>([]);
  const [activeGlitch, setActiveGlitch] = useState<string | null>(null);

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduceMotion) return;

      const tl = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      tl.fromTo(
        panelRef.current,
        {
          opacity: 0,
          y: 18,
          scale: 0.985,
          filter: "blur(10px)",
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.6,
        },
      )
        .fromTo(
          titleRef.current,
          {
            opacity: 0,
            y: 24,
            letterSpacing: "0.08em",
            textShadow: "0 0 0 rgba(0,0,0,0)",
          },
          {
            opacity: 1,
            y: 0,
            letterSpacing: "0.01em",
            textShadow: "0 0 24px rgba(1,127,164,0.18)",
            duration: 0.5,
          },
          "-=0.3",
        )
        .fromTo(
          subtitleRef.current,
          {
            opacity: 0,
            y: 16,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.42,
          },
          "-=0.28",
        )
        .fromTo(
          buttonsRef.current.filter(Boolean),
          {
            opacity: 0,
            y: 14,
            scale: 0.97,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.4,
            stagger: 0.08,
          },
          "-=0.22",
        );
    },
    { scope: sectionRef },
  );

  const titleLayers = useMemo(
    () => ({
      base: "Hacker Tracker",
      cyan: "Hacker Tracker",
      magenta: "Hacker Tracker",
    }),
    [],
  );

  const triggerTitleGlitch = () => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || !titleRef.current) return;

    gsap.killTweensOf(titleRef.current);

    gsap
      .timeline({ defaults: { overwrite: "auto" } })
      .to(titleRef.current, {
        x: 4,
        skewX: 4,
        duration: 0.04,
        ease: "power2.out",
      })
      .to(titleRef.current, {
        x: -3,
        skewX: -3,
        duration: 0.04,
        ease: "power2.out",
      })
      .to(titleRef.current, {
        x: 2,
        skewX: 2,
        duration: 0.04,
        ease: "power2.out",
      })
      .to(titleRef.current, {
        x: 0,
        skewX: 0,
        duration: 0.05,
        ease: "power2.out",
      });
  };

  return (
    <section
      ref={sectionRef}
      className="ui-container ui-page-content my-6 sm:my-8"
      aria-labelledby="apps-landing-title"
    >
      <div
        ref={panelRef}
        className="relative overflow-hidden rounded-4xl border border-white/10 bg-slate-950/50 px-6 py-10 text-center shadow-[0_24px_80px_rgba(2,6,23,0.42)] backdrop-blur-xl sm:px-8 sm:py-14 lg:px-12 lg:py-18"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-90"
          style={{
            background: `
              radial-gradient(circle at 20% 20%, rgba(1,127,164,0.18), transparent 22%),
              radial-gradient(circle at 80% 28%, rgba(108,205,187,0.12), transparent 20%),
              radial-gradient(circle at 50% 100%, rgba(224,0,78,0.08), transparent 28%),
              linear-gradient(135deg, rgba(15,23,42,0.92), rgba(2,6,23,0.8))
            `,
            backgroundSize: "140% 140%",
            animation: "ui-apps-gradient-drift 18s ease-in-out infinite alternate",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/40 to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-1/2 h-36 w-36 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl"
        />

        <div className="relative mx-auto max-w-4xl">
          <p className="ui-kicker mb-4 text-cyan-100/80 sm:mb-5">Official conference companion</p>

          <h1
            id="apps-landing-title"
            ref={titleRef}
            onPointerEnter={triggerTitleGlitch}
            onFocus={triggerTitleGlitch}
            className="group relative mx-auto inline-block cursor-default font-mono text-4xl font-semibold tracking-[0.01em] text-balance text-white sm:text-6xl md:text-7xl lg:text-[5.5rem] lg:leading-[0.95]"
          >
            <span className="relative z-10">{titleLayers.base}</span>
            <span
              aria-hidden="true"
              className={`pointer-events-none absolute inset-0 -z-10 text-cyan-300/70 transition-opacity duration-150 ${
                activeGlitch ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              }`}
              style={{ transform: "translate(2px, 0)" }}
            >
              {titleLayers.cyan}
            </span>
            <span
              aria-hidden="true"
              className={`pointer-events-none absolute inset-0 -z-10 text-pink-400/60 transition-opacity duration-150 ${
                activeGlitch ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              }`}
              style={{ transform: "translate(-2px, 0)" }}
            >
              {titleLayers.magenta}
            </span>
          </h1>

          <p
            ref={subtitleRef}
            className="mx-auto mt-5 max-w-2xl text-base leading-7 text-pretty text-slate-200 sm:mt-6 sm:text-lg sm:leading-8 md:text-xl"
          >
            Your official {conference.name} schedule companion. Pick the platform that fits your
            workflow and get straight to the talks, villages, and events.
          </p>

          <div className="mt-8 grid gap-3 sm:mt-10 sm:grid-cols-3 sm:gap-4">
            {PLATFORMS.map((platform, index) => (
              <a
                key={platform.name}
                ref={(el) => {
                  buttonsRef.current[index] = el;
                }}
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                onPointerEnter={() => setActiveGlitch(platform.name)}
                onPointerLeave={() => setActiveGlitch(null)}
                onFocus={() => setActiveGlitch(platform.name)}
                onBlur={() => setActiveGlitch(null)}
                className={[
                  "ui-focus-ring group relative isolate flex min-h-33 flex-col justify-between overflow-hidden rounded-3xl border px-5 py-5 text-left shadow-[0_16px_40px_rgba(2,6,23,0.28)] transition duration-200 ease-out",
                  "hover:-translate-y-1 hover:shadow-[0_22px_54px_rgba(2,6,23,0.36)]",
                  "focus-visible:-translate-y-1 focus-visible:outline-none focus-visible:shadow-[0_22px_54px_rgba(2,6,23,0.36)]",
                  platform.accentClassName,
                ].join(" ")}
              >
                <span
                  aria-hidden="true"
                  className={`pointer-events-none absolute -top-6 -right-6 h-20 w-20 rounded-full blur-2xl transition-opacity duration-200 ${platform.accentGlowClassName} opacity-80 group-hover:opacity-100`}
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-4 top-0 h-px bg-linear-to-r from-transparent via-white/40 to-transparent"
                />

                <div className="relative z-10">
                  <div className="text-xs font-semibold tracking-[0.16em] text-current/70 uppercase">
                    {platform.eyebrow}
                  </div>
                  <div className="mt-3 text-lg leading-tight font-semibold sm:text-xl">
                    {platform.name}
                  </div>
                </div>

                <div className="relative z-10 mt-6 flex items-center justify-between gap-4">
                  <span className="text-sm leading-snug font-medium text-current/90">
                    {platform.text}
                  </span>
                  <ArrowTopRightOnSquareIcon className="h-5 w-5 shrink-0 text-current/80 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
