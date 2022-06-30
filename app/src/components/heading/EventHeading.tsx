import NavLinks from "./NavLinks";
import { SearchIcon } from "@heroicons/react/outline";
import { Combobox, Transition } from "@headlessui/react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export const EventHeading = ({ events, title }: EventHeadingProps) => {
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
    <div className='navbar bg-black sticky top-0 z-50 h-20'>
      <div className='navbar-start'>
        <div className='dropdown'>
          <NavLinks />
        </div>
      </div>
      <div className='navbar-center'>
        <div className='text-center items-center '>
          <p className='md:text-4xl lg:text-5xl text-white font-bold font-mono'>
            D<span className='text-dc-red'>3</span>F C
            <span className='text-dc-red'>0</span>N
          </p>
          <p className={`md:text-lg lg:text-xl text-white font-mono`}>
            {title}
          </p>
        </div>
      </div>
      <div className='navbar-end'>
        <div
          className={`relative mr-3 ${
            query != "" ? "w-5/6" : "hover:w-5/6 w-16"
          }`}>
          <Combobox
            value={""}
            onChange={(eventId) => {
              eventId && router.push(`/events/${eventId}`);
            }}
            nullable>
            <div className='relative mt-1'>
              <Combobox.Input
                className='w-full input text-sm '
                displayValue={() => query}
                onChange={(e: any) => setQuery(e.target.value)}
              />
              <Transition
                enter='transition duration-100 ease-out'
                enterFrom='transform scale-95 opacity-0'
                enterTo='transform scale-100 opacity-100'
                leave='transition duration-75 ease-out'
                leaveFrom='transform scale-100 opacity-100'
                leaveTo='transform scale-95 opacity-0'></Transition>
              <Combobox.Button className='absolute inset-y-0 right-0 flex items-center pr-2'>
                <SearchIcon className='h-5 w-5' aria-hidden='true' />
              </Combobox.Button>
              <Combobox.Options
                className={`absolute mt-1 max-h-56 w-full overflow-auto rounded-md bg-black py-1 text-base shadow-lg border border-dc-pink focus:outline-none sm:text-sm ${
                  query != "" ? "visible" : "invisible"
                }`}>
                {searchedEvents.map((e) => (
                  <Combobox.Option key={e.id} value={e.id}>
                    {({ active }) => <SearchLinks event={e} active={active} />}
                  </Combobox.Option>
                ))}
              </Combobox.Options>
            </div>
          </Combobox>
        </div>
      </div>
    </div>
  );
};

const SearchLinks = ({ event, active }: EventSearching) => (
  <div
    className={`mt-3 py-1 ${
      active
        ? event.color === "#ababa"
          ? "bg-dc-pink"
          : `bg-[${event.color}]`
        : "bg-black"
    }`}>
    <div className='ml-1 table  items-center'>
      <div
        className={`w-1 h-full table-cell ${
          event.color === "#ababa" ? "bg-dc-pink" : `bg-[${event.color}]`
        }`}>
        &nbsp;
      </div>
      <div className='ml-2'>
        <p className='text-xs md:text-sm text-white'>{event.title}</p>
      </div>
    </div>
  </div>
);

export default EventHeading;
