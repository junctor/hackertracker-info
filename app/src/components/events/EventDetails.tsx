import { eventWeekday, timeDisplayParts } from "../../utils/dates";
import { StarIcon, ClockIcon, MapIcon } from "@heroicons/react/outline";

import Link from "next/link";

export function EventDetails({ event }: EventProps) {
  return (
    <div className='mt-2 ml-5'>
      <div>
        <h1 className='text-3xl md:text-4xl lg:text-5xl mb-5 text-white'>
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
          <p className='md:text-base lg:text-lg text-xs text-white '>
            {event.type.name}
          </p>
        </div>
        <div className='flex items-center bg-dc-gray w-11/12  mt-2 md:h-14 lg:h-16 h-12 rounded-lg cursor-pointer'>
          <a
            className='flex'
            href={`data:text/calendar;charset=utf8,${encodeURIComponent(
              cal(event)
            )}`}
            download={`dc30-${event.id}.ics`}>
            <ClockIcon className='h-5 w-5 md:h-7 md:w-7 lg:w-8 lg:h-8 ml-3 mr-2' />
            <p className='md:text-base lg:text-lg text-xs text-white '>
              {`${eventTime(new Date(event.begin))} - ${eventTime(
                new Date(event.end)
              )}`}
            </p>
          </a>
        </div>
        <div className='flex items-center bg-dc-gray w-11/12  mt-2 md:h-14 lg:h-16 h-12 rounded-lg'>
          <MapIcon className='h-5 w-5 md:h-7 md:w-7 lg:w-8 lg:h-8 ml-3 mr-2' />
          <p className='md:text-base lg:text-lg text-xs text-white '>
            {event.location.name}
          </p>
        </div>
      </div>
      <div className='mt-8'>
        <div className='text-sm md:text-base lg:text-lg w-11/12'>
          {event.android_description.split("\n").map((d, index) => (
            <div className='mt-2' key={`${d}-${event.id}-${index}`}>
              <FormatDesc details={d} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default EventDetails;
