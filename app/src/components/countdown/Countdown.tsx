"use client";

import { useEffect, useState } from "react";
import { getCountdown } from "../../utils/timer";
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
    months: 0,
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
      <div
        className={`grid grid-flow-col gap-4 md:gap-12 text-center md:auto-cols-max ${sofachromeFont.className}`}
      >
        <div>
          <span className="countdown font-bold text-xl sm:text-2xl md:text-4xl lg:text-7xl text-dc-red">
            <span style={{ "--value": timer.months } as React.CSSProperties} />
          </span>
          <span className={latoFont.className}>month</span>
        </div>
        <div>
          <span className="countdown font-bold text-xl sm:text-2xl md:text-4xl lg:text-7xl text-dc-purple">
            <span style={{ "--value": timer.days } as React.CSSProperties} />
          </span>
          <span className={latoFont.className}>day</span>
        </div>
        <div>
          <span className="countdown font-bold text-xl sm:text-2xl md:text-4xl lg:text-7xl  text-dc-teal">
            <span style={{ "--value": timer.hours } as React.CSSProperties} />
          </span>
          <span className={latoFont.className}>hour</span>
        </div>
        <div>
          <span className="countdown font-bold text-xl sm:text-2xl md:text-4xl lg:text-7xl text-dc-yellow">
            <span style={{ "--value": timer.minutes } as React.CSSProperties} />
          </span>
          <span className={latoFont.className}>min</span>
        </div>
        <div>
          <span className="countdown font-bold text-xl sm:text-2xl md:text-4xl lg:text-7xl text-dc-red">
            <span style={{ "--value": timer.seconds } as React.CSSProperties} />
          </span>
          <span className={latoFont.className}>sec</span>
        </div>
      </div>
    </div>
  );
}

export default Countdown;
