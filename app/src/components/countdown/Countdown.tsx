/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { useEffect, useState } from "react";
import { getCountdown } from "../../utils/timer";

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
    <div className="grid place-items-center mt-3 md:mt-10 text-center">
      <div className="grid grid-flow-col gap-4 md:gap-12 text-center auto-cols-max">
        <div>
          <span className="countdown font-mono font-bold text-xl sm:text-2xl md:text-4xl lg:text-7xl text-dc-purple">
            <span style={{ "--value": timer.days } as React.CSSProperties} />
          </span>
          days
        </div>
        <div>
          <span className="countdown font-mono font-bold text-xl sm:text-2xl md:text-4xl lg:text-7xl  text-dc-teal">
            <span style={{ "--value": timer.hours } as React.CSSProperties} />
          </span>
          hours
        </div>
        <div>
          <span className="countdown font-mono font-bold text-xl sm:text-2xl md:text-4xl lg:text-7xl text-dc-yellow">
            <span style={{ "--value": timer.minutes } as React.CSSProperties} />
          </span>
          min
        </div>
        <div>
          <span className="countdown font-mono font-bold text-xl sm:text-2xl md:text-4xl lg:text-7xl text-dc-red">
            <span style={{ "--value": timer.seconds } as React.CSSProperties} />
          </span>
          sec
        </div>
      </div>
    </div>
  );
}

export default Countdown;
