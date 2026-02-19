import Head from "next/head";
import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";

gsap.registerPlugin(useGSAP, ScrambleTextPlugin);

export default function Home() {
  const titleRef = useRef<HTMLSpanElement | null>(null);
  const title = "DEF CON";

  useGSAP(() => {
    const el = titleRef.current;
    if (!el) return;

    const prefersReduced = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    )?.matches;

    el.textContent = title;
    if (prefersReduced) return;

    const play = () => {
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
    };

    play();
    el.addEventListener("pointerenter", play);
    el.addEventListener("focus", play);

    return () => {
      el.removeEventListener("pointerenter", play);
      el.removeEventListener("focus", play);
    };
  }, []);

  return (
    <>
      <Head>
        <title>info.defcon.org</title>
        <meta name="description" content="DEF CON" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-dvh px-4">
        <div className="mx-auto max-w-5xl pt-20 sm:pt-24">
          <div className="text-center">
            <h1 className="mx-auto inline-flex items-center justify-center">
              <span
                ref={titleRef}
                tabIndex={0}
                role="button"
                aria-label="DEF CON title animation"
                className="
                select-none font-mono font-semibold text-slate-100 outline-none
                focus-visible:ring-2 focus-visible:ring-slate-600
                leading-none
                text-7xl
                sm:text-8xl
                md:text-9xl
                lg:text-[10rem]
                tracking-wider
                sm:tracking-wide
                md:tracking-normal
                lg:tracking-tighter
              "
              >
                {title}
              </span>
            </h1>

            <p className="mx-auto max-w-2xl text-base text-slate-500 sm:text-lg">
              Please select a conference from the menu to get started.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:mt-14 sm:grid-cols-2">
            <ConferenceCard
              href="/dcsg2026"
              src="/images/dcsingapore.webp"
              alt="DEF CON Singapore"
            />
            <ConferenceCard
              href="/defcon34"
              src="/images/dc-lv.webp"
              alt="DEF CON 34"
            />
          </div>
        </div>
      </main>
    </>
  );
}

function ConferenceCard({
  href,
  src,
  alt,
}: {
  href: string;
  src: string;
  alt: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-slate-200 bg-white/60 p-4 shadow-sm transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
    >
      <div className="relative aspect-16/6 w-full overflow-hidden rounded-xl bg-slate-50">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 480px, (min-width: 640px) 46vw, 92vw"
          className="object-contain p-4 transition-transform duration-200 group-hover:scale-[1.01]"
        />
      </div>
      <div className="mt-3 text-center text-sm font-medium text-slate-700">
        {alt}
      </div>
    </Link>
  );
}
