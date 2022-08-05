import { useEffect, useState } from "react";

function HeadingClock() {
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
    return () => clearInterval(updateClock);
  }, []);

  return (
    <div className='flex items-center'>
      <span className='countdown flex text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold'>
        <span
          className='text-dc-pink'
          style={{ "--value": time.hours } as React.CSSProperties}
        />
        :
        <span
          className='text-dc-blue'
          style={{ "--value": time.minutes } as React.CSSProperties}
        />
        :
        <span
          className='text-dc-green'
          style={{ "--value": time.seconds } as React.CSSProperties}
        />
      </span>
      <p className='flex ml-1 md:ml-2 lg:ml-3 text-xs sm:text-sm md:text-base lg:text-lg'>
        PDT
      </p>
    </div>
  );
}

export default HeadingClock;
