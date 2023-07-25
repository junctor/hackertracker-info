import { MagnifyingGlassIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { Combobox, Transition } from "@headlessui/react";
import { useState } from "react";
import { useRouter } from "next/router";

function SearchLinks({ event, active }: EventSearching) {
  return (
    <div
      className={`py-1 mb-1 ${
        active ? `bg-[${event.color}] font-bold` : "bg-black"
      }`}
    >
      <div className="mx-1 table items-center">
        <div className={`w-1 h-full table-cell bg-[${event.color}]`}>
          &nbsp;
        </div>
        <div className="ml-2">
          <p className="text-sm sm:text-sm md:text-base lg:text-lg ">
            {event.title}
          </p>
        </div>
      </div>
    </div>
  );
}

function EventSearch({ events }: { events: EventSearch[] }) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const searchedEvents =
    query === ""
      ? events.slice(0, 0)
      : events
          .filter((e) => e.title.toLowerCase().includes(query.toLowerCase()))
          .slice(0, 50);

  return (
    <div className="flex items-center my-5">
      <div className="w-80 sm:w-[500px] md:w-[600px] lg:w-[800px]">
        <Combobox
          value={query}
          onChange={(eventId) => {
            if (eventId != null) {
              void router.push(`/event/?id=${eventId}`);
            }
          }}
          nullable
        >
          <div className="relative">
            <Combobox.Input
              autoFocus
              className="w-full bg-dc-gray text-base border border-white rounded-md p-2 ml-1 placeholder-dc-red pl-3 placeholder:font-light"
              displayValue={() => query}
              placeholder="Search events"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setQuery(e.target.value);
              }}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              {query.length === 0 ? (
                <MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />
              ) : (
                <XCircleIcon
                  className="h-5 w-5"
                  aria-hidden="true"
                  onClick={() => {
                    setQuery("");
                  }}
                />
              )}
            </Combobox.Button>
            <Transition
              show={query !== ""}
              enter="transition duration-100 ease-in"
              enterFrom="transform scale-50 opacity-0"
              enterTo="transform scale-100 opacity-100"
            >
              <Combobox.Options
                static
                className="absolute mt-1 max-h-48 min-h-24 w-full overflow-auto rounded-md bg-black text-white py-1 shadow-lg  border-2 border-dc-teal focus:outline-none cursor-pointer"
              >
                {searchedEvents.map((e) => (
                  <Combobox.Option key={e.id} value={e.id}>
                    {({ active }) => <SearchLinks event={e} active={active} />}
                  </Combobox.Option>
                ))}
              </Combobox.Options>
            </Transition>
          </div>
        </Combobox>
      </div>
    </div>
  );
}

export default EventSearch;
