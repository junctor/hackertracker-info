import Countdown from "../countdown/Countdown";
import Links from "./Links";
import Stats from "./Stats";

function Splash({ data }: SplashProps) {
  return (
    <div className='my-12'>
      <div className='text-center'>
        <h1 className='text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold font-mono -rotate-6 my-4 sm:my-6 md:my-8 lg:my-10'>
          D<span className='text-dc-red'>3</span>F C
          <span className='text-dc-red'>0</span>N
        </h1>
      </div>
      <Countdown kickoff={data.kickoff} />
      <Links />
      <Stats counts={data.counts} />
    </div>
  );
}

export default Splash;
