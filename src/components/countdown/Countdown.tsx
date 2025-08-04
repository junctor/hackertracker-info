// src/components/countdown/Countdown.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { getCountdown, TARGET_DATE_MS } from "../../lib/timer";
import localFont from "next/font/local";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import React from "react";

const atkinsonFont = localFont({
  src: "../../../public/fonts/atkinson-hl.woff2",
  display: "swap",
  variable: "--font-atkinson",
});
const museoFont = localFont({
  src: "../../../public/fonts/Museo700-Regular.woff2",
  display: "swap",
  variable: "--font-museo",
});

function padTime(num: number): string {
  return num.toString().padStart(2, "0");
}

function Countdown() {
  const [expired, setExpired] = useState(false);
  const [timer, setTimer] = useState(getCountdown());

  useEffect(() => {
    // one-time setup: check immediately, then every second
    const tick = () => {
      const now = Date.now();
      if (now >= TARGET_DATE_MS) {
        setExpired(true);
      } else {
        setTimer(getCountdown());
      }
    };

    tick(); // do it immediately on mount
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (expired) return null;

  const animateCountdownFlip = (
    el: HTMLElement | null,
    flashColor: string = "#6CE"
  ) => {
    if (!el) return;
    gsap.fromTo(
      el,
      { y: 10, opacity: 0, color: flashColor },
      {
        y: 0,
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
        overwrite: "auto",
        onComplete: () => {
          gsap.to(el, {
            color: "#ffffff",
            duration: 0.2,
            ease: "power2.out",
            overwrite: "auto",
          });
        },
      }
    );
  };

  const daysRef = useRef<HTMLDivElement>(null);
  const hoursRef = useRef<HTMLDivElement>(null);
  const minutesRef = useRef<HTMLDivElement>(null);
  const secondsRef = useRef<HTMLDivElement>(null);

  useGSAP(() => animateCountdownFlip(daysRef.current, "#47A"), [timer.days]);
  useGSAP(() => animateCountdownFlip(hoursRef.current, "#E67"), [timer.hours]);
  useGSAP(
    () => animateCountdownFlip(minutesRef.current, "#CB4"),
    [timer.minutes]
  );
  useGSAP(
    () => animateCountdownFlip(secondsRef.current, "#6CE"),
    [timer.seconds]
  );

  return (
    <div className="grid place-items-center mt-3 md:mt-10 text-center mx-5 grid-cols-2 sm:grid-cols-4 gap-4 px-20">
      {/** Days **/}
      <div>
        <span
          ref={daysRef}
          className={`font-bold text-xl sm:text-2xl md:text-4xl lg:text-7xl block dc-purple ${atkinsonFont.className}`}
        >
          {padTime(timer.days)}
        </span>
        <span
          className={`text-xs sm:text-sm md:text-base lg:text-lg ${museoFont.className}`}
        >
          days
        </span>
      </div>

      {/** Hours **/}
      <div>
        <span
          ref={hoursRef}
          className={`font-bold text-xl sm:text-2xl md:text-4xl lg:text-7xl block ${atkinsonFont.className}`}
        >
          {padTime(timer.hours)}
        </span>
        <span
          className={`text-xs sm:text-sm md:text-base lg:text-lg ${museoFont.className}`}
        >
          hours
        </span>
      </div>

      {/** Minutes **/}
      <div>
        <span
          ref={minutesRef}
          className={`font-bold text-xl sm:text-2xl md:text-4xl lg:text-7xl block ${atkinsonFont.className}`}
        >
          {padTime(timer.minutes)}
        </span>
        <span
          className={`text-xs sm:text-sm md:text-base lg:text-lg ${museoFont.className}`}
        >
          minutes
        </span>
      </div>

      {/** Seconds **/}
      <div>
        <span
          ref={secondsRef}
          className={`font-bold text-xl sm:text-2xl md:text-4xl lg:text-7xl block ${atkinsonFont.className}`}
        >
          {padTime(timer.seconds)}
        </span>
        <span
          className={`text-xs sm:text-sm md:text-base lg:text-lg ${museoFont.className}`}
        >
          seconds
        </span>
      </div>
    </div>
  );
}

export default Countdown;
