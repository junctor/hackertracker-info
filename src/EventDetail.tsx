import { LinkIcon, CalendarIcon } from "@heroicons/react/outline";
import { EventDetailProps } from "./ht";
import cal from "./cal";
import { eventTime } from "./utils";

const EventDetail = ({ event, localTime }: EventDetailProps) => {
  const formatDescription = (details: string) => {
    const urlRegex = new RegExp(
      "((https?|ftp|gopher|telnet|file):((//)|(\\\\))+[\\w\\d:#@%/;$()~_?\\+-=\\\\\\.&]*)",
      "ig"
    );

    const text = details
      .split(" ")
      .map((word) =>
        urlRegex.test(word) ? (
          <a
            className='text-orange hover:text-blue'
            href={word}>{`${word} `}</a>
        ) : (
          `${word} `
        )
      );

    return text;
  };

  return (
    <div>
      <div className='mt-5 mb-1 text-gray-dark text-sm'>
        {`${eventTime(
          new Date(event.begin),
          "America/Los_Angeles",
          localTime
        )} - ${eventTime(
          new Date(event.end),
          "America/Los_Angeles",
          localTime
        )}`}
      </div>
      <div className='text-gray-light'>
        {event.description.split("\n").map((d, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <div className='mt-2' key={`d-${index}`}>
            {formatDescription(d)}
          </div>
        ))}
      </div>
      <div className='mt-5 mb-1'>
        <button
          type='button'
          className='border-blue border-2 text-blue p-1 hover:border-orange hover:text-orange rounded-md text-sm align-middle'
          onClick={() => {
            window.open(
              `data:text/calendar;charset=utf8,${encodeURIComponent(
                cal(event)
              )}`
            );
          }}>
          <CalendarIcon className='inline w-5 h-5' /> Download iCal
        </button>

        <button
          type='button'
          className='border-blue border-2 text-blue p-1 hover:border-orange hover:text-orange rounded-md text-sm ml-5 align-middle'
          onClick={() => {
            const url = (
              document.URL.endsWith("/")
                ? document.URL.slice(0, -1)
                : document.URL
            ).replaceAll(`/?event=${event.id}`, "");
            navigator.clipboard.writeText(`${url}/?event=${event.id}`);
          }}>
          <LinkIcon className='inline w-5 h-5' /> Copy Event Link
        </button>
      </div>
    </div>
  );
};

export default EventDetail;
