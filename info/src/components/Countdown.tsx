import { useEffect, useState } from "react";
import { getCountdown } from "../utils/timer";
import localFont from "next/font/local";
import Image from "next/image";
import dc31Logo from "../../public/images/defcon31-logo-gradient.webp";

const benguiatFont = localFont({
  src: "../../public/fonts/benguiat.woff",
  display: "swap",
  variable: "--font-benguiat",
});

const freewayFont = localFont({
  src: "../../public/fonts/freeway-gothic.woff2",
  display: "swap",
  variable: "--font-freeway",
});

export function Countdown() {
  const [timer, setTimer] = useState<Timer>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => setTimer(getCountdown()), 1000);
    return () => {
      clearInterval(interval);
    };
  }, [timer]);

  return (
    <div className="grid place-items-center mt-3 md:mt-10 text-center">
      <div
        style={{ display: "flex", flexDirection: "column" }}
        className="mb-2"
      >
        <Image
          src={dc31Logo}
          alt="DEF CON 31 Logo"
          sizes="100vw"
          style={{
            width: "100%",
            height: "auto",
          }}
        />
      </div>
      <div
        className={`font-extrabold text-md md:text-xl text-dc-text ${freewayFont.className} mb-2`}
      >
        The Future Will Prevail
      </div>

      <div className="grid grid-flow-row md:grid-flow-col gap-4 md:gap-12 text-center auto-cols-max">
        <div>
          <span className="countdown font-mono font-bold text-6xl md:text-7xl text-dc-purple">
            <span style={{ "--value": timer.days } as React.CSSProperties} />
          </span>
          days
        </div>
        <div>
          <span className="countdown font-mono font-bold text-6xl md:text-7xl text-dc-teal">
            <span style={{ "--value": timer.hours } as React.CSSProperties} />
          </span>
          hours
        </div>
        <div>
          <span className="countdown font-mono font-bold text-6xl md:text-7xl text-dc-yellow">
            <span style={{ "--value": timer.minutes } as React.CSSProperties} />
          </span>
          min
        </div>
        <div>
          <span className="countdown font-mono font-bold text-6xl md:text-7xl text-dc-red">
            <span style={{ "--value": timer.seconds } as React.CSSProperties} />
          </span>
          sec
        </div>
      </div>
    </div>
  );
}

export default Countdown;
