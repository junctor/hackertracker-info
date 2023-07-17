/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { useEffect, useState } from "react";

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
    <div className="flex items-center">
      <span className="countdown flex text-9xl font-bold">
        <span
          className="text-dc-purple"
          style={{ "--value": time.hours } as React.CSSProperties}
        />
        :
        <span
          className="text-dc-teal"
          style={{ "--value": time.minutes } as React.CSSProperties}
        />
        :
        <span
          className="text-dc-yellow"
          style={{ "--value": time.seconds } as React.CSSProperties}
        />
      </span>
    </div>
  );
}

export default TVClock;
