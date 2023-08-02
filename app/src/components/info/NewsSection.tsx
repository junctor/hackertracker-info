import { newsDate } from "@/utils/dates";
import { Disclosure } from "@headlessui/react";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import ReactMarkdown from "react-markdown";

function NewsSection({ newsItem }: { newsItem: HTNews }) {
  return (
    <div className="mt-5">
      <Disclosure>
        {({ open }: { open: boolean }) => (
          <>
            <Disclosure.Button className="flex w-full rounded-lg bg-dc-gray p-2">
              <div className="flex text-start w-full">
                <div className="text-left font-bold text-sm sm:text-base md:text-lg lg:text-xl flex-1 w-11/12">
                  {newsItem.name}
                </div>
                <div className="flex mx-5 text-xs md:text-sm align-middle items-center">
                  {newsDate(newsItem.updated_at.seconds)}
                </div>
                <div className="flex ml-auto">
                  <ChevronLeftIcon
                    className={`${
                      open ? "-rotate-90 transform" : ""
                    } w-5 sm:w-6 md:w-7 lg:w-8  text-dc-red`}
                  />
                </div>
              </div>
            </Disclosure.Button>
            <Disclosure.Panel className="p-4">
              <div className="prose-sm md:prose lg:prose-xl">
                <ReactMarkdown>{newsItem.text}</ReactMarkdown>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
}

export default NewsSection;
