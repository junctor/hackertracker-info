"use client";

import { useEffect, useState } from "react";
import { getCountdown } from "../../lib/utils/timer";
import localFont from "next/font/local";

const sofachromeFont = localFont({
  src: "../../../public/fonts/sofachrome.woff2",
  display: "swap",
  variable: "--font-sofachrome",
});

const latoFont = localFont({
  src: "../../../public/fonts/lato.woff2",
  display: "swap",
  variable: "--font-lato",
});

export function Countdown() {
  const [timer, setTimer] = useState<Timer>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(getCountdown());
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [timer]);

  return (
    <div className="grid place-items-center mt-3 md:mt-10 text-center mx-5">
      <div className="grid grid-flow-col gap-4 md:gap-12 text-center md:auto-cols-max">
        <div>
          <span className="font-bold text-xl sm:text-2xl md:text-4xl lg:text-7xl text-dc-purple mr-1 font-mono">
            {timer.days}
          </span>
          <span className={latoFont.className}>day</span>
        </div>
        <div>
          <span className="font-bold text-xl sm:text-2xl md:text-4xl lg:text-7xl  text-dc-teal mr-1 font-mono">
            {timer.hours}
          </span>
          <span className={latoFont.className}>hour</span>
        </div>
        <div>
          <span className="font-bold text-xl sm:text-2xl md:text-4xl lg:text-7xl text-dc-yellow mr-1 font-mono">
            {timer.minutes}
          </span>
          <span className={latoFont.className}>min</span>
        </div>
        <div>
          <span className="font-bold text-xl sm:text-2xl md:text-4xl lg:text-7xl text-dc-red mr-1 font-mono">
            {timer.seconds}
          </span>
          <span className={latoFont.className}>sec</span>
        </div>
      </div>
    </div>
  );
}

export default Countdown;
