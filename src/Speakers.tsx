import { useEffect, useState } from "react";
import { speakerData } from "./fb";
import { HTSpeaker, SpeakerProps } from "./ht";
import SpeakerDetails from "./SpeakerDetails";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Speakers = ({ localTime }: SpeakerProps) => {
  const [speakers, setSpeakers] = useState<HTSpeaker[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  const showDetails = (eventShow: string) => {
    const content = document.getElementById(eventShow);
    content?.classList.toggle("hidden");
  };

  useEffect(() => {
    (async () => {
      setLoadingEvents(true);

      const localSpeakers = localStorage.getItem("speakers");

      if (localSpeakers) {
        const localSpeakerData: HTSpeaker[] = JSON.parse(localSpeakers);
        setSpeakers(localSpeakerData);
      } else {
        const htSpeakers = await speakerData("DEFCON29");
        setSpeakers(htSpeakers);
        localStorage.setItem("speakers", JSON.stringify(htSpeakers));
      }
      setLoadingEvents(false);
    })();
  }, []);
  /* eslint-disable no-param-reassign */

  if (loadingEvents) {
    return (
      <div className='text-4xl text-green animate-pulse ml-8'>
        Loading DEF CON speakers...
      </div>
    );
  }

  return (
    <div id='speakers'>
      {speakers
        .sort((a, b) => {
          if (a.name.toLowerCase() < b.name.toLowerCase()) {
            return -1;
          }
          return 1;
        })
        .map((s) => (
          <div className='event' key={s.id} aria-hidden='true'>
            <div
              role='button'
              tabIndex={s.id}
              onClick={() => showDetails(s.id.toString())}
              onKeyDown={() => showDetails(s.id.toString())}>
              <div>
                <h2 className='text-green text-xl'>{s.name}</h2>
              </div>
            </div>

            <div id={s.id.toString()} className='hidden'>
              <SpeakerDetails speaker={s} localTime={localTime} />
            </div>
          </div>
        ))}
    </div>
  );
};

export default Speakers;
