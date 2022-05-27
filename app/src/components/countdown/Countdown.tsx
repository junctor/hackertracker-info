import { useEffect, useState } from "react";
import glitch from "../../styles/Glitch.module.scss";

export function Countdown() {
  const [timer, setTimer] = useState<Timer>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  function getCountdown(): Timer {
    const now = new Date().valueOf();
    const dc30 = new Date("2022-08-11T00:00:00.000-07:00").valueOf();
    let d = (dc30 - now) / (24 * 60 * 60 * 1000);
    let h = (d % 1) * 24;
    let m = (h % 1) * 60;
    let s = (m % 1) * 60;

    let timer: Timer = {
      days: Math.floor(d),
      hours: Math.floor(h),
      minutes: Math.floor(m),
      seconds: Math.floor(s),
    };

    return timer;
  }

  useEffect(() => {
    const interval = setInterval(() => setTimer(getCountdown()), 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className='grid place-items-center mt-3 md:mt-10'>
      <div className='grid grid-flow-row md:grid-flow-col gap-4 text-center auto-cols-max mb-10'>
        <div
          className={`font-extrabold text-9xl md:text-[150px] text-dc-text font-mono ${glitch.glitch}`}
          data-text='DEF'>
          DEF
        </div>
        <div
          className={`font-extrabold text-9xl md:text-[150px] text-dc-text font-mono m-0 ${glitch.glitch}`}
          data-text='CON'>
          CON
        </div>
        <div
          className={`font-extrabold text-9xl md:text-[150px] text-dc-text font-mono ${glitch.glitch}`}
          data-text='30'>
          30
        </div>
      </div>
      <div className='grid grid-flow-row md:grid-flow-col gap-4 md:gap-12 text-center auto-cols-max'>
        <div>
          <span className='countdown font-mono font-bold text-6xl md:text-7xl text-dc-pink'>
            <span style={{ "--value": timer.days } as React.CSSProperties} />
          </span>
          days
        </div>
        <div>
          <span className='countdown font-mono font-bold text-6xl md:text-7xl text-dc-blue'>
            <span style={{ "--value": timer.hours } as React.CSSProperties} />
          </span>
          hours
        </div>
        <div>
          <span className='countdown font-mono font-bold text-6xl md:text-7xl text-dc-green'>
            <span style={{ "--value": timer.minutes } as React.CSSProperties} />
          </span>
          min
        </div>
        <div>
          <span className='countdown font-mono font-bold text-6xl md:text-7xl text-dc-red'>
            <span style={{ "--value": timer.seconds } as React.CSSProperties} />
          </span>
          sec
        </div>
      </div>
    </div>
  );
}

export default Countdown;
