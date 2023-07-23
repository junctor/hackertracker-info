import { Disclosure } from "@headlessui/react";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import ReactMarkdown from "react-markdown";

function FaqSection({
  section,
  content,
}: {
  section: string;
  content: string;
}) {
  return (
    <div className="mt-5">
      <Disclosure>
        {({ open }: { open: boolean }) => (
          <>
            <Disclosure.Button className="flex w-full rounded-lg bg-dc-gray p-2">
              <div className="flex text-start w-full">
                <div className="text-left font-bold text-sm sm:text-base md:text-lg lg:text-xl flex-1 w-11/12">
                  {section}
                </div>
                <div className="w-8 flex-none text-end self-center">
                  <ChevronLeftIcon
                    className={`${
                      open ? "-rotate-90 transform" : ""
                    } w-5 sm:w-6 md:w-7 lg:w-8  text-dc-red`}
                  />
                </div>
              </div>
            </Disclosure.Button>
            <Disclosure.Panel className="p-4">
              <div className="prose lg:prose-xl">
                <ReactMarkdown>{content}</ReactMarkdown>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
}

export default FaqSection;
