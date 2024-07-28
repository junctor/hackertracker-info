import localFont from "next/font/local";
import { useEffect, useState } from "react";
import React from "react";

const latoFont = localFont({
  src: "../../../public/fonts/lato.woff2",
  display: "swap",
  variable: "--font-lato",
});

function padTime(num: number): string {
  return num.toString().padStart(2, "0");
}

function TVClock() {
  const [time, setTime] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const updateClock = setInterval(() => {
      const date = new Date(
        new Date().toLocaleString("en-US", {
          timeZone: "America/Los_Angeles",
        })
      );
      setTime({
        hours: date.getHours(),
        minutes: date.getMinutes(),
        seconds: date.getSeconds(),
      });
    }, 100);
    return () => {
      clearInterval(updateClock);
    };
  }, []);

  return (
    <div className="grid place-items-center text-center mx-5">
      <div className="grid grid-flow-col gap-4 md:gap-12 text-center md:auto-cols-max">
        <div>
          <span className="font-bold text-xl sm:text-2xl md:text-4xl lg:text-7xl  text-dc-teal mr-1 font-mono">
            {padTime(time.hours)}
          </span>
          <span className={latoFont.className}>hours</span>
        </div>
        <div>
          <span className="font-bold text-xl sm:text-2xl md:text-4xl lg:text-7xl text-dc-yellow mr-1 font-mono ">
            {padTime(time.minutes)}
          </span>
          <span className={latoFont.className}>minutes</span>
        </div>
        <div>
          <span className="font-bold text-xl sm:text-2xl md:text-4xl lg:text-7xl text-dc-red mr-1 font-mono">
            {padTime(time.seconds)}
          </span>
          <span className={latoFont.className}>seconds</span>
        </div>
      </div>
    </div>
  );
}

export default TVClock;
