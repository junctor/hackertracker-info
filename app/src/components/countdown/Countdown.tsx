import { useEffect, useState } from "react";
import type { Timer } from "../../ht";

function Countdown({ kickoff }: { kickoff: string }) {
  const [timer, setTimer] = useState<Timer>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  function getCountdown(): Timer {
    const now = new Date().valueOf();
    const dc30 = new Date(kickoff).valueOf();
    const d = (dc30 - now) / (24 * 60 * 60 * 1000);
    const h = (d % 1) * 24;
    const m = (h % 1) * 60;
    const s = (m % 1) * 60;

    const cdTimer: Timer = {
      days: Math.floor(d),
      hours: Math.floor(h),
      minutes: Math.floor(m),
      seconds: Math.floor(s),
    };

    return cdTimer;
  }

  useEffect(() => {
    console.log(kickoff);
    const interval = setInterval(() => setTimer(getCountdown()), 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className='grid place-items-center mt-3 md:mt-5'>
      <div className='grid grid-flow-col gap-2 md:gap-6  text-center auto-cols-max font-mono text-2xl sm:text-3xl md:text-4xl lg:text-5xl'>
        <div>
          <span className='countdown font-bold text-dc-pink'>
            <span style={{ "--value": timer.days } as React.CSSProperties} />
          </span>
          <span className='text-2xs sm:text-xs md:text-sm lg:text-base'>
            days
          </span>
        </div>
        <div>
          <span className='countdown font-mono font-bold text-dc-blue'>
            <span style={{ "--value": timer.hours } as React.CSSProperties} />
          </span>
          <span className='text-2xs sm:text-xs md:text-sm lg:text-base'>
            hours
          </span>
        </div>
        <div>
          <span className='countdown font-mono font-bold text-dc-green'>
            <span style={{ "--value": timer.minutes } as React.CSSProperties} />
          </span>
          <span className='text-2xs sm:text-xs md:text-sm lg:text-base'>
            min
          </span>
        </div>
        <div>
          <span className='countdown font-mono font-bold text-dc-red'>
            <span style={{ "--value": timer.seconds } as React.CSSProperties} />
          </span>
          <span className='text-2xs sm:text-xs md:text-sm lg:text-base'>
            sec
          </span>
        </div>
      </div>
    </div>
  );
}

export default Countdown;
