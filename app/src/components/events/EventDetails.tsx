import { ClockIcon, MapIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import cal from "../../utils/cal";
import { eventTime } from "../../utils/dates";
import Theme from "../../utils/theme";
import ReactMarkdown from "react-markdown";

function EventDetails({ event, tags }: { event: HTEvent; tags: HTTag[] }) {
  const theme = new Theme();
  theme.randomisze();

  const eventTags =
    tags
      ?.flatMap((t) => t.tags)
      .filter((t) => event?.tag_ids.includes(t.id))
      .sort((a, b) => b.sort_order - a.sort_order) ?? [];

  return (
    <div className="mt-4 ml-5">
      <div>
        <h1 className="font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-5 mr-3">
          {event.title}
        </h1>
      </div>
      <div>
        <div className="flex items-center">
          {eventTags?.map((t) => (
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
              {event.end_timestamp.seconds !== event.begin_timestamp.seconds
                ? `${eventTime(new Date(event.begin), false)} - ${eventTime(
                    new Date(event.end),
                    true
                  )}`
                : `${eventTime(new Date(event.begin), true)}`}
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
          <div className="prose lg:prose-xl">
            <ReactMarkdown>{event.description}</ReactMarkdown>
          </div>
          {(event.links ?? []).length > 0 && (
            <div className="mt-8 text-left">
              <h2 className="font-bold text-base sm:text-lg md:text-xl lg:text-2xl">
                Links
              </h2>
              <ul className="list-disc text-xs sm:text-sm md:text-base lg:text-lg ml-5 mt-2">
                {(event.links ?? []).map((l) => (
                  <li key={l.url}>
                    <a href={l.url}>{l.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      {event.speakers.length > 0 && (
        <div className="mt-8 text-left">
          <h2 className="font-bold text-base sm:text-lg md:text-xl lg:text-2xl">
            Speakers
          </h2>
          <div className=" items-center bg-dc-gray w-11/12 mt-2 rounded-lg mb-10 pt-2 pb-2">
            {event.speakers
              .sort(
                (a, b) =>
                  (findSortOrder(event.people, a.id) ?? 0) -
                  (findSortOrder(event.people, a.id) ?? 0)
              )
              .map((s) => (
                <div
                  key={s.id}
                  className="ml-3 table mt-2 mb-2 align-middle items-center"
                >
                  <div
                    className={`ml-1 table-cell h-full w-1 sm:w-2 mr-3 bg-${theme.nextColor} rounded-md`}
                  />
                  <div className="inline-block text-left ml-2">
                    <Link href={`/speaker?id=${s.id}`}>
                      <button type="button" className="text-left">
                        <p className="font-bold text-sm sm:text-md md:text-base lg:text-lg">
                          {s.name}
                        </p>

                        <p className="text-xs sm:text-sm md:text-sm lg:text-base text-gray-400">
                          {findSpeakerRole(event.people, tags, s.id) ??
                            "Speaker"}
                        </p>

                        {s.title != null && (
                          <p className="text-xs sm:text-xs md:text-xs lg:text-sm text-gray-400">
                            {s.title}
                          </p>
                        )}
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

function findSortOrder(people: HTPeople[], id: number) {
  return people.find((p) => p.person_id === id)?.sort_order;
}

function findSpeakerRole(people: HTPeople[], tags: HTTag[], id: number) {
  const tagId = findTagId(people, id);

  if (tagId === undefined) {
    return tagId;
  }

  return findRole(tags, tagId);
}

function findTagId(people: HTPeople[], id: number) {
  return people.find((p) => p.person_id === id)?.tag_id;
}

function findRole(tags: HTTag[], id: number) {
  return tags
    .find((t) => t.category === "content-person")
    ?.tags.find((t) => t.id === id)?.label;
}

export default EventDetails;
