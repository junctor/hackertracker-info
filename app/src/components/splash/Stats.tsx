import Link from "next/link";

function Stats({ counts }: StatsProps) {
  return (
    <div>
      <div className='flex items-center justify-center text-center mt-10'>
        <div className='grid grid-cols-3'>
          <div>
            <Link href='/events'>
              <button type='button' className='text-center'>
                <h1 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-dc-red'>
                  {counts.events}
                </h1>
                <h2 className='text-xs sm:text-sm md:text-base lg:text-lg'>
                  Events
                </h2>
              </button>
            </Link>
          </div>
          <div>
            <Link href='/speakers'>
              <button type='button' className='text-center'>
                <h1 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-dc-blue'>
                  {counts.speakers}
                </h1>
                <h2 className='text-xs sm:text-sm md:text-base lg:text-lg'>
                  Speakers
                </h2>
              </button>
            </Link>
          </div>
          <div>
            <div className='text-center'>
              <h1 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-dc-green'>
                {counts.clicks}
              </h1>
              <h2 className='text-xs sm:text-sm md:text-base lg:text-lg'>
                Questions Answered
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Stats;
