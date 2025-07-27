import localFont from "next/font/local";
import React, { useEffect, useMemo, useState } from "react";

const museoFont = localFont({
  src: "../../../public/fonts/Museo700-Regular.woff2",
  display: "swap",
  variable: "--font-museo",
});

function TVClock() {
  // create a single formatter for LA time, 24h with 2-digit fields
  const formatter = useMemo(
    () =>
      new Intl.DateTimeFormat("en-US", {
        hour12: false,
        timeZone: "America/Los_Angeles",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    []
  );

  const [timeStr, setTimeStr] = useState(() => formatter.format(new Date()));

  useEffect(() => {
    const id = setInterval(() => {
      setTimeStr(formatter.format(new Date()));
    }, 1000);

    return () => clearInterval(id);
  }, [formatter]);

  const [hours, minutes, seconds] = timeStr.split(":");

  return (
    <div className="grid place-items-center text-center mx-5">
      <div
        className={`grid grid-flow-col gap-0 text-center md:auto-cols-max ${museoFont.className}`}
      >
        <div>
          <span className="font-bold text-xl sm:text-2xl md:text-4xl lg:text-7xl text-[#47A] font-mono">
            {hours}
          </span>
          <span className="font-bold text-xl sm:text-2xl md:text-4xl lg:text-7xl text-white font-mono">
            :
          </span>
        </div>
        <div>
          <span className="font-bold text-xl sm:text-2xl md:text-4xl lg:text-7xl text-[#E67] font-mono">
            {minutes}
          </span>
          <span className="font-bold text-xl sm:text-2xl md:text-4xl lg:text-7xl text-white font-mono">
            :
          </span>
        </div>
        <div>
          <span className="font-bold text-xl sm:text-2xl md:text-4xl lg:text-7xl text-[#CB4] font-mono">
            {seconds}
          </span>
        </div>
      </div>
    </div>
  );
}

export default TVClock;
