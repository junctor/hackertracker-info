import { eventWeekday, timeDisplayParts } from "../../utils/dates";
import { StarIcon } from "@heroicons/react/outline";
import Link from "next/link";

export function EventCell({ event }: EventProps) {
  return (
    <div className='mt-2'>
      <div className='flex bg-black items-center'>
        <div
          className='ml-1 w-2 md:h-24 h-24 bg-green-400'
          style={{
            content: "",
            backgroundColor:
              event.type.color === "#ababa" ? "#e25238" : event.type.color,
          }}>
          {" "}
        </div>
        <div className='w-20 text-center '>
          {timeDisplayParts(event.begin, "America/Los_Angeles", false).map(
            (part) => (
              <p
                key={part}
                className='md:text-sm lg:text-base text-xs font-bold text-dc-text'>
                {part}
              </p>
            )
          )}
        </div>
        <div className='w-4/5'>
          <Link href={`/events/${event.id}`} prefetch={false}>
            <a className='md:text-xl lg:text-2xl text-lg text-white'>
              {event.title}
            </a>
          </Link>
          <p className='md:text-lg lg:text-xl text-base'>
            {event.location.name}
          </p>
          <div
            className='rounded-full h-2 w-2 green inline-flex mr-2'
            style={{
              backgroundColor:
                event.type.color === "#ababa" ? "#e25238" : event.type.color,
            }}
          />
          <p className='md:text-sm lg:text-base text-xs text-white inline-flex'>
            {event.type.name}
          </p>
        </div>
        <div className='w-10 items-start ml-2 mr-2'>
          <StarIcon className='md:h-6 lg:h-8 h-5' />
        </div>
      </div>
    </div>
  );
}

export default EventCell;
