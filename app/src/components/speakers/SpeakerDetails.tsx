import Link from "next/link";
import { eventTime } from "../../utils/dates";
import Theme from "../../utils/theme";
import FormatDesc from "../misc/FormatDesc";

function EventDetails({ speaker }: { speaker: HTSpeaker }) {
  const theme = new Theme();
  theme.randomisze();

  return (
    <div className="mt-4 ml-5">
      <div>
        <h1 className="font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-5 mr-3">
          {speaker.name}
        </h1>
      </div>
      <div className="mt-8">
        <div className="text-sm md:text-base lg:text-lg w-11/12">
          {speaker.description.split("\n").map((d, index) => (
            <div className="mt-2" key={`${d}-${speaker.id}-${index}`}>
              <FormatDesc details={d} />
            </div>
          ))}
        </div>
      </div>
      {speaker.events.length > 0 && (
        <div className="mt-8 text-center">
          <h2 className="font-bold text-base sm:text-lg md:text-xl lg:text-2xl">
            Events
          </h2>
          <div className="items-center bg-dc-gray w-11/12 mt-2 rounded-lg mb-10 pt-2 pb-2">
            {speaker.events.map((e) => (
              <div
                key={e.id}
                className="ml-3 table mt-2 mb-2 align-middle items-center"
              >
                <div
                  className={`table-cell h-full w-1 md:w-2 bg-[${e.type.color}] rounded-md`}
                />
                <div className="text-left ml-2">
                  <Link href={`/event?id=${e.id}`}>
                    <button
                      type="button"
                      className="font-bold text-xs sm:text-sm md:text-base lg:text-lg text-left"
                    >
                      {e.title}
                    </button>
                  </Link>
                  <p className="text-xs sm:text-sm md:text-sm lg:text-base text-gray-400">
                    {`${eventTime(new Date(e.begin), false)} - ${eventTime(
                      new Date(e.end)
                    )}`}
                  </p>
                  <p className="text-xs sm:text-sm md:text-sm lg:text-base text-gray-400">
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
