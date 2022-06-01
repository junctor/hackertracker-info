import { eventWeekday, timeDisplayParts } from "../../utils/dates";
import { StarIcon } from "@heroicons/react/outline";

export function EventCell({ event }: EventCellProps) {
  return (
    <div className='mb-1'>
      <div className='flex bg-dc-gray items-center'>
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
              <p key={part} className='text-xs font-bold text-dc-text'>
                {part}
              </p>
            )
          )}
        </div>
        <div className='w-4/5'>
          <p className='text-l text-white'>{event.title}</p>
          <p className='text-xs'>{event.location.name}</p>
          <div
            className='rounded-full h-2 w-2 green inline-flex mr-2'
            style={{
              backgroundColor:
                event.type.color === "#ababa" ? "#e25238" : event.type.color,
            }}
          />
          <p className='text-xs text-white inline-flex'>{event.type.name}</p>
        </div>
        <div className='w-10 items-start ml-5'>
          <StarIcon className='h-4 w-4' />
        </div>
      </div>
    </div>
  );
}

export default EventCell;
