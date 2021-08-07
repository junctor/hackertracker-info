import { useEffect, useState } from "react";
import { ClockProps } from "./ht";

const Clock = ({ localTime, size }: ClockProps) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const updateClock = setInterval(() => {
      if (localTime) {
        setTime(new Date());
      } else {
        const date = new Date(
          new Date().toLocaleString("en-US", {
            timeZone: "America/Los_Angeles",
          })
        );
        setTime(date);
      }
    }, 100);
    return () => clearInterval(updateClock);
  }, [localTime]);

  return (
    <span className={`${size} countdown`}>
      <span style={{ "--value": time.getHours() } as React.CSSProperties} />:
      <span style={{ "--value": time.getMinutes() } as React.CSSProperties} />:
      <span style={{ "--value": time.getSeconds() } as React.CSSProperties} />
    </span>
  );
};

export default Clock;
