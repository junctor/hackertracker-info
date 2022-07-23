import { ClockIcon, MapIcon } from "@heroicons/react/outline";
import Link from "next/link";
import cal from "../../utils/cal";
import { eventTime } from "../../utils/dates";
import Theme from "../../utils/theme";
import FormatDesc from "../misc/FormatDesc";

function EventDetails({ event }: EventDetailProps) {
  const theme = new Theme();
  theme.randomisze();

  return (
    <div className='mt-4 ml-5'>
      <div>
        <h1 className='text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-5 mr-3'>
          {event.title}
        </h1>
      </div>
      <div>
        <div className='flex items-center bg-dc-gray w-11/12 mt-2 md:h-14 lg:h-16 h-12 rounded-lg'>
          <div
            className='rounded-full h-5 w-5 md:h-7 md:w-7 lg:w-8 lg:h-8 ml-3 mr-2'
            style={{
              backgroundColor:
                event.type.color === "#ababa" ? "#e25238" : event.type.color,
            }}
          />
          <Link href={`/categories/${event.type.id}`}>
            <button type='button' className='md:text-base lg:text-lg text-xs'>
              {event.type.name}
            </button>
          </Link>
        </div>
        <div className='flex items-center bg-dc-gray w-11/12  mt-2 md:h-14 lg:h-16 h-12 rounded-lg cursor-pointer'>
          <a
            className='flex'
            href={`data:text/calendar;charset=utf8,${encodeURIComponent(
              cal(event)
            )}`}
            download={`dc30-${event.id}.ics`}>
            <ClockIcon className='h-5 w-5 md:h-7 md:w-7 lg:w-8 lg:h-8 ml-3 mr-2' />
            <p className='md:text-base lg:text-lg text-xs'>
              {`${eventTime(new Date(event.begin))} - ${eventTime(
                new Date(event.end)
              )}`}
            </p>
          </a>
        </div>
        <div className='flex items-center bg-dc-gray w-11/12  mt-2 md:h-14 lg:h-16 h-12 rounded-lg'>
          <MapIcon className='h-5 w-5 md:h-7 md:w-7 lg:w-8 lg:h-8 ml-3 mr-2' />
          <p className='md:text-base lg:text-lg text-xs'>
            {event.location.name}
          </p>
        </div>
      </div>
      <div className='mt-8'>
        <div className='text-sm md:text-base lg:text-lg w-11/12'>
          {event.android_description.split("\n").map((d, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <div className='mt-2' key={`${d}-${event.id}-${index}`}>
              <FormatDesc details={d} />
            </div>
          ))}
          {(event.links ?? []).length > 0 && (
            <div className='mt-5 text-xs'>
              {event.links?.map((l) => (
                <div className='mt-1' key={l.url}>
                  <p className='inline'>{`${l.label}: `}</p>
                  <a
                    key={l.url}
                    target='_blank'
                    rel='noopener noreferrer'
                    href={l.url}
                    className='text-dc-pink hover:text-dc-blue'>
                    {l.url}
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {event.speakers.length > 0 && (
        <div className='mt-8 text-center'>
          <h2 className='font-bold text-base sm:text-lg md:text-xl lg:text-2xl'>
            Speakers
          </h2>
          <div className=' items-center bg-dc-gray w-11/12 mt-2 rounded-lg mb-10 pt-2 pb-2'>
            {event.speakers.map((s) => (
              <div
                key={s.id}
                className='ml-3 flex mt-2 mb-2 align-middle items-center'>
                <div
                  className={`ml-1 h-10 sm:h-12 md:h-14 lg:h-16 w-1 sm:w-2 mr-3 bg-${theme.nextColor} rounded-md`}
                />
                <div className='inline-block text-left'>
                  <Link href={`/speakers/${s.id}`}>
                    <button
                      type='button'
                      className='text-bold text-xs sm:text-sm md:text-base lg:text-lg'>
                      {s.name}
                    </button>
                  </Link>
                  <p className='text-xs sm:text-sm md:text-sm lg:text-base text-gray-400'>
                    {s.title ?? "Hacker"}
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
