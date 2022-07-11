/* eslint-disable react/no-array-index-key */
import Link from "next/link";
import { eventTime } from "../../utils/dates";
import Theme from "../../utils/theme";
import FormatDesc from "../misc/FormatDesc";

function EventDetails({ speaker }: SpeakerDetailProps) {
  const theme = new Theme();
  theme.randomisze();

  return (
    <div className='mt-4 ml-5'>
      <div>
        <h1 className='text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-5 mr-3'>
          {speaker.name}
        </h1>
      </div>
      <div className='mt-8'>
        <div className='text-sm md:text-base lg:text-lg w-11/12'>
          {speaker.description.split("\n").map((d, index) => (
            <div className='mt-2' key={`${d}-${speaker.id}-${index}`}>
              <FormatDesc details={d} />
            </div>
          ))}
        </div>
      </div>
      {speaker.events.length > 0 && (
        <div className='mt-8 text-center'>
          <h2 className='font-bold text-base sm:text-lg md:text-xl lg:text-2xl'>
            Events
          </h2>
          <div className='items-center bg-dc-gray w-11/12 mt-2 rounded-lg mb-10 pt-2 pb-2'>
            {speaker.events.map((e) => (
              <div
                key={e.id}
                className='ml-3 flex mt-2 mb-2 align-middle items-center'>
                <div
                  className={`ml-1 h-12 sm:h-14 md:h-16 lg:h-20 w-1 sm:w-2 mr-3 bg-[${e.type.color}]`}
                />
                <div className='inline-block text-left'>
                  <Link href={`/events/${e.id}`}>
                    <button
                      type='button'
                      className='text-bold text-xs sm:text-sm md:text-base lg:text-lg'>
                      {e.title}
                    </button>
                  </Link>
                  <p className='text-xs sm:text-sm md:text-sm lg:text-base text-gray-400'>
                    {`${eventTime(new Date(e.begin))} - ${eventTime(
                      new Date(e.end)
                    )}`}
                  </p>
                  <p className='text-xs sm:text-sm md:text-sm lg:text-base text-gray-400'>
                    {e.location.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default EventDetails;
