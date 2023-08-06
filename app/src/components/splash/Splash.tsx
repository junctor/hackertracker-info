import Countdown from "../countdown/Countdown";
import Links from "./Links";
import Image from "next/image";
import dc31Logo from "../../../public/images/defcon31-logo-gradient.webp";
import localFont from "next/font/local";
import { Disclosure } from "@headlessui/react";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import ReactMarkdown from "react-markdown";
import { newsDate } from "@/utils/dates";

const freewayFont = localFont({
  src: "../../../public/fonts/freeway-gothic.woff2",
  display: "swap",
  variable: "--font-freeway",
});

export default function Splash({ news }: { news: HTNews[] }) {
  const kickoffTimestamp = 1691769600 * 1000;

  const newsItem = news.sort(
    (a, b) => b.updated_at.seconds - a.updated_at.seconds
  )[0];

  return (
    <div className="my-12">
      <div className="flex w-full justify-center items-center text-center mt-5">
        <div>
          <Image
            src={dc31Logo}
            alt="DEF CON 31 Logo"
            className="md:w-96 w-64 relative"
          />
        </div>
      </div>
      <div className="text-center mt-2">
        <div
          className={`font-extrabold text-md md:text-xl text-dc-text ${freewayFont.className} mb-2`}
        >
          The Future Will Prevail
        </div>
      </div>
      {new Date(kickoffTimestamp) > new Date() && <Countdown />}
      {news.length > 0 && (
        <div className="flex w-full justify-center items-center text-center mt-5 ">
          <div className="w-3/4 md:w-1/2 lg:w-1/3">
            <div className="flex items-center justify-center text-center">
              <div className="font-bold text-lg md:text-xl p-2">
                Latest News
              </div>
              <div className="text-sm md:text-base p-2">
                {`(${newsDate(newsItem.updated_at.seconds)})`}
              </div>
            </div>

            <Disclosure>
              {({ open }: { open: boolean }) => (
                <>
                  <Disclosure.Button className="flex w-full rounded-lg bg-dc-gray p-2">
                    <div className="flex text-start w-full">
                      <div className="text-left font-bold text-sm sm:text-base md:text-lg lg:text-xl flex text-dc-yellow">
                        {newsItem.name}
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
                    <div className="prose-sm md:prose lg:prose-xl text-left">
                      <ReactMarkdown>{newsItem.text}</ReactMarkdown>
                    </div>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          </div>
        </div>
      )}
      <Links />
    </div>
  );
}
