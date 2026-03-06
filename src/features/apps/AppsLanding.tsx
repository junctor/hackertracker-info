import { gsap } from "gsap";
// src/pages/Apps.tsx
import { useRef, useEffect } from "react";

import { ConferenceManifest } from "@/lib/conferences";

type Props = {
  conference: ConferenceManifest;
};

export default function AppsLanding({ conference }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const wrapper = wrapperRef.current;
    const title = titleRef.current;

    const backgroundTween = wrapper
      ? gsap.to(wrapper, {
          backgroundPosition: "100% 100%",
          duration: 20,
          ease: "none",
          repeat: -1,
          yoyo: true,
        })
      : null;

    const glitchTl = title
      ? gsap
          .timeline({ repeat: -1, repeatDelay: 3 })
          .to(title, {
            x: 5,
            skewX: 5,
            filter: "drop-shadow(5px 0px #CB4) drop-shadow(-5px 0px #E67)",
            duration: 0.05,
          })
          .to(title, {
            x: -5,
            skewX: -5,
            filter: "drop-shadow(-5px 0px #A37) drop-shadow(5px 0px #6CE)",
            duration: 0.05,
          })
          .to(title, {
            x: 3,
            skewX: 3,
            filter: "drop-shadow(3px 0px #47A) drop-shadow(-3px 0px #BBB)",
            duration: 0.05,
          })
          .to(title, {
            x: 0,
            skewX: 0,
            filter: "none",
            duration: 0.05,
          })
      : null;

    return () => {
      backgroundTween?.kill();
      glitchTl?.kill();
    };
  }, []);

  const platforms = [
    {
      name: "iOS",
      url: "https://apps.apple.com/us/app/hackertracker/id1021141595?mt=8",
      text: "Download on the App Store",
      color: "bg-white text-black hover:bg-gray-200",
    },
    {
      name: "Android",
      url: "https://play.google.com/store/apps/details?id=com.shortstack.hackertracker",
      text: "Get it on Google Play",
      color: "bg-green-600 text-white hover:bg-green-500",
    },
    {
      name: "Web",
      url: "https://info.defcon.org",
      text: "View the Schedule",
      color: "bg-purple-600 text-white hover:bg-purple-500",
    },
  ];

  const btnBase =
    "rounded-full px-8 py-3 font-semibold text-lg shadow-lg transition transform hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black";

  return (
    <div
      ref={wrapperRef}
      style={{
        backgroundSize: "200% 200%",
        backgroundPosition: "0% 0%",
      }}
      className="my-10 flex min-h-screen flex-col items-center px-4 text-center text-white"
    >
      <h1
        ref={titleRef}
        className="text-6xl leading-tight font-extrabold sm:text-7xl md:text-8xl lg:text-9xl"
      >
        Hacker Tracker
      </h1>

      <p className="mt-4 max-w-2xl text-xl sm:text-2xl md:text-3xl">
        Your official {conference.name} schedule companion. Choose your platform below.
      </p>

      <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row">
        {platforms.map((p) => (
          <a
            key={p.name}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${btnBase} ${p.color}`}
          >
            {p.text}
          </a>
        ))}
      </div>
    </div>
  );
}
