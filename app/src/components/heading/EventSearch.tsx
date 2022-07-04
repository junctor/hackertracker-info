import NavLinks from "./NavLinks";
import { SearchIcon, XCircleIcon } from "@heroicons/react/outline";
import { Combobox, Transition } from "@headlessui/react";
import { useState } from "react";
import { useRouter } from "next/router";

export const EventSearch = ({ events }: EventSearchProps) => {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const searchedEvents =
    query === ""
      ? events.slice(0, 0)
      : events
          .filter((e) => {
            return e.title.toLowerCase().includes(query.toLowerCase());
          })
          .slice(0, 50);

  return (
    <>
      <div
        className={`${
          query != "" ? "w-60 sm:w-[500px] md:w-[600px] lg:w-[800px]" : "w-12"
        }`}>
        <Combobox
          value={""}
          onChange={(eventId) => {
            eventId && router.push(`/events/${eventId}`);
          }}
          nullable>
          <div className='relative'>
            <Combobox.Input
              className='w-full bg-dc-gray text-base border border-white rounded-md p-2'
              displayValue={() => query}
              onChange={(e: any) => setQuery(e.target.value)}
            />
            <Combobox.Button className='absolute inset-y-0 right-0 flex items-center pr-2'>
              {!query ? (
                <SearchIcon className='h-5 w-5' aria-hidden='true' />
              ) : (
                <XCircleIcon
                  className='h-5 w-5'
                  aria-hidden='true'
                  onClick={() => setQuery("")}
                />
              )}
            </Combobox.Button>
            <Transition
              show={query !== ""}
              enter='transition duration-100 ease-in'
              enterFrom='transform scale-50 opacity-0'
              enterTo='transform scale-100 opacity-100'>
              <Combobox.Options
                static
                className={`absolute mt-1 max-h-56 w-full overflow-auto rounded-md bg-black py-1 shadow-lg  border-2 border-dc-blue focus:outline-none`}>
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
    </>
  );
};

const SearchLinks = ({ event, active }: EventSearching) => (
  <div
    className={`py-1 mb-1 ${
      active
        ? event.color === "#ababa"
          ? "bg-dc-pink"
          : `bg-[${event.color}]`
        : "bg-black"
    }`}>
    <div className='mx-1 table items-center'>
      <div
        className={`w-1 h-full table-cell ${
          event.color === "#ababa" ? "bg-dc-pink" : `bg-[${event.color}]`
        }`}>
        &nbsp;
      </div>
      <div className='ml-2'>
        <p className='text-sm sm:text-sm md:text-base lg:text-lg '>
          {event.title}
        </p>
      </div>
    </div>
  </div>
);
