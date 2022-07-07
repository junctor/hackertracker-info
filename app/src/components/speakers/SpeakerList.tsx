import { memo, useEffect, useRef, useState } from "react";
import { dateGroupTitle, tabDateTitle } from "../../utils/dates";
import Theme from "../../utils/theme";
import { getBookmarks } from "../../utils/storage";
import Link from "next/link";

export const SpeakerList = ({ speakerGroup }: SpeakerListProps) => {
  const componentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!componentRef.current) return;

    document.querySelectorAll(".event-days").forEach((eE) => {
      let element = eE as HTMLDivElement;
      const observer = new IntersectionObserver(
        ([entry]) =>
          element.classList.toggle("invisible", entry.isIntersecting),
        { root: null, rootMargin: "-180px 0px 0px 0px", threshold: 0.25 }
      );
      observer.observe(eE);

      return () => {
        observer.disconnect();
      };
    });
  }, [speakerGroup]);

  const scrollToSpeaker = (i: string) => {
    if (componentRef && componentRef.current) {
      componentRef.current.querySelector(`#${i}`)?.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  const SpeakerDisplay = memo(({ speakers }: { speakers: Speaker[] }) => (
    <div>
      {speakers.map((s) => (
        <div key={s.id} className='ml-10 my-5'>
          <Link href={`/speakers/${s.id}`} prefetch={false}>
            <a className='text-base sm:text-lg md:text-xl lg:text-2xl font-bold'>
              {s.name}
            </a>
          </Link>
        </div>
      ))}
    </div>
  ));

  SpeakerDisplay.displayName = "EventDisplay";

  return (
    <div ref={componentRef}>
      <div className='flex items-center justify-center mb-5'>
        <h1 className='text-base sm:text-lg md:text-xl lg:text-2xl font-extrabold font-mono'>
          Speakers
        </h1>
      </div>
      <div>
        {Array.from(speakerGroup).map(([i, speakers]) => (
          <div id={i} key={`${i}-events`} className='scroll-m-20'>
            <div
              id={i}
              className='bg-black sticky top-20 z-20 mb-5 pb-2 event-days invisible'>
              <div className='bg-black justify-center items-center flex'>
                {Array.from(speakerGroup).map(([tabI]) => (
                  <button
                    key={tabI}
                    className={`flex flex-wrap p-0.5 sm:p-1 md:p-2 mx-0 lg:mx-1 rounded sm:rounded-md text-xs sm:text-sm md:text-base lg:text-lg font-semibold ${
                      i == tabI ? "bg-dc-blue" : "hover:text-gray-400"
                    }`}
                    onClick={() => scrollToSpeaker(tabI)}>
                    {tabI}
                  </button>
                ))}
              </div>
            </div>
            <p className='text-xl sm:text-2xl md:text-3xl lg:text-4xl my-3 text-center font-bold'>
              {i}
            </p>
            <div>
              <SpeakerDisplay speakers={speakers} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(SpeakerList);
