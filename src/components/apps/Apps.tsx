// src/pages/Apps.tsx
import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import Link from "next/link";

export default function Apps() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (wrapperRef.current) {
      gsap.to(wrapperRef.current, {
        backgroundPosition: "100% 100%",
        duration: 20,
        ease: "none",
        repeat: -1,
        yoyo: true,
      });
    }

    const glitchTl = gsap.timeline({ repeat: -1, repeatDelay: 3 });
    glitchTl
      .to(titleRef.current, {
        x: 5,
        skewX: 5,
        filter: "drop-shadow(5px 0px #CB4) drop-shadow(-5px 0px #E67)",
        duration: 0.05,
      })
      .to(titleRef.current, {
        x: -5,
        skewX: -5,
        filter: "drop-shadow(-5px 0px #A37) drop-shadow(5px 0px #6CE)",
        duration: 0.05,
      })
      .to(titleRef.current, {
        x: 3,
        skewX: 3,
        filter: "drop-shadow(3px 0px #47A) drop-shadow(-3px 0px #BBB)",
        duration: 0.05,
      })
      .to(titleRef.current, {
        x: 0,
        skewX: 0,
        filter: "none",
        duration: 0.05,
      });

    return () => {
      glitchTl.kill();
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
    "rounded-full px-8 py-3 font-semibold text-lg shadow-lg transition transform hover:-translate-y-1";

  return (
    <div
      ref={wrapperRef}
      style={{
        backgroundSize: "200% 200%",
        backgroundPosition: "0% 0%",
      }}
      className="min-h-screen text-white flex flex-col items-center px-4 text-center my-10"
    >
      <h1
        ref={titleRef}
        className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold leading-tight"
      >
        Hacker Tracker
      </h1>

      <p className="mt-4 max-w-2xl text-xl sm:text-2xl md:text-3xl">
        Your official DEF CON schedule companion. Choose your platform below.
      </p>

      <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
        {platforms.map((p) => (
          <Link
            key={p.name}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${btnBase} ${p.color}`}
          >
            {p.text}
          </Link>
        ))}
      </div>
    </div>
  );
}
