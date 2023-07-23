import { useEffect, useRef } from "react";
import SpeakerDisplay from "./SpeakerDisplay";

export default function SpeakerList({
  speakerGroup,
}: {
  speakerGroup: Map<string, Speaker[]>;
}) {
  const componentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (componentRef.current == null) return;

    document.querySelectorAll(".event-days").forEach((eE) => {
      const element = eE as HTMLDivElement;
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
    if (componentRef?.current != null) {
      componentRef.current.querySelector(`#${i}`)?.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  return (
    <div ref={componentRef}>
      <div className="flex items-center justify-center mb-5">
        <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-extrabold font-mono">
          Speakers
        </h1>
      </div>
      <div>
        {Array.from(speakerGroup).map(([i, speakers]) => (
          <div id={i} key={`${i}-events`} className="scroll-m-20">
            <div
              id={i}
              className="bg-black sticky top-20 z-20 mb-5 pb-2 event-days invisible"
            >
              <div className="bg-black justify-center items-center flex">
                {Array.from(speakerGroup).map(([tabI]) => (
                  <button
                    type="button"
                    key={tabI}
                    className={`flex flex-wrap p-0.5 sm:p-1 md:p-2 mx-0 lg:mx-1 rounded sm:rounded-md text-xs sm:text-sm md:text-base lg:text-lg font-semibold ${
                      i === tabI ? "bg-dc-teal" : "hover:text-gray-400"
                    }`}
                    onClick={() => {
                      scrollToSpeaker(tabI);
                    }}
                  >
                    {tabI}
                  </button>
                ))}
              </div>
            </div>
            <h2 className="text-xl sm:text-xl md:text-2xl lg:text-3xl text-left font-extrabold my-5 ml-10 text-dc-purple">
              {i}
            </h2>
            <div>
              <SpeakerDisplay speakers={speakers} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
