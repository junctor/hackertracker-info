/* eslint-disable react/no-unused-prop-types */
import { Disclosure } from "@headlessui/react";
import { ChevronLeftIcon } from "@heroicons/react/solid";
import FormatDescription from "../misc/FormatDesc";

function FaqSection({ section, content }: InfoSectionProps) {
  return (
    <div className='mt-5'>
      <Disclosure>
        {({ open }: { open: boolean }) => (
          <>
            <Disclosure.Button className='flex w-full justify-between rounded-lg bg-dc-gray p-2 text-left font-bold text-sm sm:text-base md:text-lg lg:text-xl'>
              <span>{section}</span>
              <ChevronLeftIcon
                className={`${
                  open ? "-rotate-90 transform" : ""
                } w-5 sm:w-6 md:w-7 lg:w-8 text-dc-red`}
              />
            </Disclosure.Button>
            <Disclosure.Panel className='p-4'>
              <FormatDescription details={content} />
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
}

export default FaqSection;
