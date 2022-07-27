import { useEffect, useState } from "react";

function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const updateClock = setInterval(() => {
      const date = new Date(
        new Date().toLocaleString("en-US", {
          timeZone: "America/Los_Angeles",
        })
      );
      setTime(date);
    }, 100);
    return () => clearInterval(updateClock);
  }, []);

  return (
    <span className='countdown text-lg sm:text-xl md:text-2xl lg:text-3xl'>
      <span style={{ "--value": time.getHours() } as React.CSSProperties} />:
      <span style={{ "--value": time.getMinutes() } as React.CSSProperties} />:
      <span style={{ "--value": time.getSeconds() } as React.CSSProperties} />
    </span>
  );
}

export default Clock;
