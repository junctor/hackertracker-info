import { ClockIcon, MapIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import cal from "../../utils/cal";
import { eventTime } from "../../utils/dates";
import Theme from "../../utils/theme";
import FormatDesc from "../misc/FormatDesc";

function EventDetails({ event, tags }: { event: HTEvent; tags: Tag[] }) {
  const theme = new Theme();
  theme.randomisze();

  return (
    <div className="mt-4 ml-5">
      <div>
        <h1 className="font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-5 mr-3">
          {event.title}
        </h1>
      </div>
      <div>
        <div className="flex items-center">
          {tags?.map((t) => (
            <div key={t.id} className="flex m-3">
              <div
                className="rounded-full h-3 w-3 md:h-5 md:w-5 lg:w-7 lg:h-7 mr-2 flex-0"
                style={{
                  backgroundColor: t.color_background,
                }}
              />
              <p className="md:text-sm lg:text-base text-xs text-left">
                {t.label}
              </p>
            </div>
          ))}
        </div>
        <div className="flex items-center bg-dc-gray w-11/12  mt-2 md:h-14 lg:h-16 h-12 rounded-lg cursor-pointer">
          <a
            className="flex"
            href={`data:text/calendar;charset=utf8,${encodeURIComponent(
              cal(event)
            )}`}
            download={`dc30-${event.id}.ics`}
          >
            <ClockIcon className="h-5 w-5 md:h-7 md:w-7 lg:w-8 lg:h-8 ml-3 mr-2" />
            <p className="md:text-base lg:text-lg text-xs">
              {`${eventTime(new Date(event.begin), false)} - ${eventTime(
                new Date(event.end)
              )}`}
            </p>
          </a>
        </div>
        <div className="flex items-center bg-dc-gray w-11/12  mt-2 md:h-14 lg:h-16 h-12 rounded-lg">
          <MapIcon className="h-5 w-5 md:h-7 md:w-7 lg:w-8 lg:h-8 ml-3 mr-2" />
          <p className="md:text-base lg:text-lg text-xs">
            {event.location.name}
          </p>
        </div>
      </div>
      <div className="mt-8">
        <div className="text-sm md:text-base lg:text-lg w-11/12">
          {event.android_description.split("\n").map((d, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <div className="mt-2" key={`${d}-${event.id}-${index}`}>
              <FormatDesc details={d} />
            </div>
          ))}
          {(event.links ?? []).length > 0 && (
            <div className="mt-5 text-xs">
              {event.links?.map((l) => (
                <div className="mt-1" key={l.url}>
                  <p className="inline">{`${l.label}: `}</p>
                  <a
                    key={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    href={l.url}
                    className="text-dc-purple hover:text-dc-teal"
                  >
                    {l.url}
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {event.speakers.length > 0 && (
        <div className="mt-8 text-center">
          <h2 className="font-bold text-base sm:text-lg md:text-xl lg:text-2xl">
            Speakers
          </h2>
          <div className=" items-center bg-dc-gray w-11/12 mt-2 rounded-lg mb-10 pt-2 pb-2">
            {event.speakers.map((s) => (
              <div
                key={s.id}
                className="ml-3 table mt-2 mb-2 align-middle items-center"
              >
                <div
                  className={`ml-1 table-cell h-full w-1 sm:w-2 mr-3 bg-${theme.nextColor} rounded-md`}
                />
                <div className="inline-block text-left ml-2">
                  <Link href={`/speaker?id=${s.id}`}>
                    <button
                      type="button"
                      className="font-bold text-xs sm:text-sm md:text-base lg:text-lg"
                    >
                      {s.name}
                    </button>
                  </Link>
                  {s.title != null && (
                    <p className="text-xs sm:text-sm md:text-sm lg:text-base text-gray-400">
                      {s.title}
                    </p>
                  )}
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
