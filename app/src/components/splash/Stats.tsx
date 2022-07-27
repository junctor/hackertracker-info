import Link from "next/link";

function Stats({ counts }: StatsProps) {
  return (
    <div>
      <div className='flex items-center justify-center mt-10'>
        <div className='grid grid-cols-2 bg-dc-gray rounded-xl p-3 sm:p-4 md:p-5 lg:p-6 divide-x-2 md:divide-x-4 divide-dc-green'>
          <Link href='/events'>
            <button type='button' className='text-center pr-5'>
              <h1 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-dc-red'>
                {counts.events}
              </h1>
              <h2 className='text-xs sm:text-sm md:text-base lg:text-lg'>
                Events
              </h2>
            </button>
          </Link>
          <Link href='/speakers'>
            <button type='button' className='text-center pl-5'>
              <h1 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-dc-blue'>
                {counts.speakers}
              </h1>
              <h2 className='text-xs sm:text-sm md:text-base lg:text-lg'>
                Speakers
              </h2>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Stats;
