import { timeDisplayParts } from "../../utils/dates";

function TVEventCell({ event }: TVEventProps) {
  return (
    <div className='my-3 ml-2 mr-3'>
      <div className='bg-black items-center h-min-36 table'>
        <div
          className={`table-cell px-1 h-full w-3 bg-[${event.color}] rounded-md`}
        />
        <div className='text-center items-center table-cell px-3 align-middle'>
          {timeDisplayParts(event.begin).map((part) => (
            <p key={part} className='text-base font-bold text-dc-text'>
              {part}
            </p>
          ))}
        </div>
        <div className='w-full table-cell'>
          <h1 className='text-2xl font-bold text-left break-words'>
            {event.title}
          </h1>

          <p className='text-base '>{event.speakers}</p>

          <p className='text-base text-gray-400'>{event.location}</p>
          <div
            className={`rounded-full h-3 w-3 green inline-flex mr-2 bg-[${event.color}]`}
          />
          <p className='text-base inline-flex'>{event.category}</p>
        </div>
      </div>
    </div>
  );
}

export default TVEventCell;
