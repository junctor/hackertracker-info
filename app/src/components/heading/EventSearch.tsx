import NavLinks from "./NavLinks";
import { SearchIcon } from "@heroicons/react/outline";
import { Combobox, Transition } from "@headlessui/react";
import { useState } from "react";
import Link from "next/link";
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
    <div
      className={`relative mr-3 ${
        query != "" ? "w-10/12" : "hover:w-10/12 focus:w-10/12 w-12"
      }`}>
      <Combobox
        value={""}
        onChange={(eventId) => {
          eventId && router.push(`/events/${eventId}`);
        }}
        nullable>
        <div className='relative mt-1'>
          <Combobox.Input
            className='w-full input input-sm text-xs md:text-sm border border-dc-red'
            displayValue={() => query}
            onChange={(e: any) => setQuery(e.target.value)}
          />
          <Combobox.Button className='absolute inset-y-0 right-0 flex items-center pr-2'>
            <SearchIcon className='h-5 w-5' aria-hidden='true' />
          </Combobox.Button>
          <Combobox.Options
            className={`absolute mt-1 max-h-56 w-full overflow-auto rounded-md bg-black py-1 text-base shadow-lg border border-dc-blue focus:outline-none sm:text-sm ${
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
  );
};

const SearchLinks = ({ event, active }: EventSearching) => (
  <div
    className={`py-1 ${
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
        <p className='text-xs md:text-sm text-white'>{event.title}</p>
      </div>
    </div>
  </div>
);
