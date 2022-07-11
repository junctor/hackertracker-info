/* eslint-disable @typescript-eslint/no-explicit-any */
import { SearchIcon, XCircleIcon } from "@heroicons/react/outline";
import { Combobox, Transition } from "@headlessui/react";
import { useState } from "react";
import { useRouter } from "next/router";

function SearchLinks({ speaker, active }: SpeakerSearching) {
  return (
    <div className={`py-1 mb-1 ${active ? "bg-dc-red" : "bg-black"}`}>
      <div className='mx-5 text-left'>
        <p className='text-sm sm:text-sm md:text-base lg:text-lg '>
          {speaker.name}
        </p>
      </div>
    </div>
  );
}

function SpeakerSearch({ speakers }: SpeakersProps) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const searchedEvents =
    query === ""
      ? speakers.slice(0, 0)
      : speakers
          .filter((e) => e.name.toLowerCase().includes(query.toLowerCase()))
          .slice(0, 50);

  return (
    <div
      className={`${
        query !== "" ? "w-60 sm:w-[500px] md:w-[600px] lg:w-[800px]" : "w-16"
      }`}>
      <Combobox
        value={query}
        onChange={(speakerId) => {
          if (speakerId) {
            router.push(`/speakers/${speakerId}`);
          }
        }}
        nullable>
        <div className='relative'>
          <Combobox.Input
            autoFocus
            className='w-full bg-dc-gray text-base border border-white rounded-md p-2 ml-1 placeholder-dc-red pl-3 placeholder:font-extrabold'
            displayValue={() => query}
            placeholder='|'
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
              className='absolute mt-1 max-h-56 w-full overflow-auto rounded-md bg-black py-1 shadow-lg  border-2 border-dc-blue focus:outline-none'>
              {searchedEvents.map((s) => (
                <Combobox.Option key={s.id} value={s.id}>
                  {({ active }) => <SearchLinks speaker={s} active={active} />}
                </Combobox.Option>
              ))}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
}

export default SpeakerSearch;
