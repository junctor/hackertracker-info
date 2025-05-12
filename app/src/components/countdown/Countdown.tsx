"use client";

import { useEffect, useRef, useState } from "react";
import { getCountdown } from "../../lib/timer";
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
  const [timer, setTimer] = useState<Timer>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

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

  const secondsRef = useRef<HTMLDivElement>(null);
  const minutesRef = useRef<HTMLDivElement>(null);
  const hoursRef = useRef<HTMLDivElement>(null);
  const daysRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(getCountdown());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useGSAP(() => {
    animateCountdownFlip(daysRef.current, "#47A");
  }, [timer.days]);

  useGSAP(() => {
    animateCountdownFlip(hoursRef.current, "#E67");
  }, [timer.hours]);

  useGSAP(() => {
    animateCountdownFlip(minutesRef.current, "#CB4");
  }, [timer.minutes]);

  useGSAP(() => {
    animateCountdownFlip(secondsRef.current, "#6CE");
  }, [timer.seconds]);

  return (
    <div className="grid place-items-center mt-3 md:mt-10 text-center mx-5 grid-cols-2 sm:grid-cols-4 gap-4 px-20">
      <div>
        <span
          className={`font-bold text-xl sm:text-2xl md:text-4xl lg:text-7xl block dc-purple ${atkinsonFont.className}`}
          ref={daysRef}
        >
          {padTime(timer.days)}
        </span>
        <span
          className={`text-xs sm:text-sm md:text-base lg:text-lg ${museoFont.className}`}
        >
          days
        </span>
      </div>

      <div>
        <span
          className={`font-bold text-xl sm:text-2xl md:text-4xl lg:text-7xl block ${atkinsonFont.className}`}
          ref={hoursRef}
        >
          {padTime(timer.hours)}
        </span>
        <span
          className={`text-xs sm:text-sm md:text-base lg:text-lg ${museoFont.className}`}
        >
          hours
        </span>
      </div>

      <div>
        <span
          className={`font-bold text-xl sm:text-2xl md:text-4xl lg:text-7xl block ${atkinsonFont.className}`}
          ref={minutesRef}
        >
          {padTime(timer.minutes)}
        </span>
        <span
          className={`text-xs sm:text-sm md:text-base lg:text-lg ${museoFont.className}`}
        >
          minutes
        </span>
      </div>

      <div>
        <span
          className={`font-bold text-xl sm:text-2xl md:text-4xl lg:text-7xl block ${atkinsonFont.className}`}
          ref={secondsRef}
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
