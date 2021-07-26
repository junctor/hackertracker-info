import { useEffect, useState } from "react";
import { speakerData } from "./fb";
import { HTSpeaker, SpeakerProps } from "./ht";
import SpeakerDetails from "./SpeakerDetails";
import { Theme } from "./theme";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Speakers = ({ localTime }: SpeakerProps) => {
  const [speakers, setSpeakers] = useState<HTSpeaker[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  const showDetails = (eventShow: string) => {
    const content = document.getElementById(eventShow);
    content?.classList.toggle("hidden");
  };

  const theme = new Theme();

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
  const groupedSpeakers: Record<string, [HTSpeaker]> = speakers.reduce(
    (group, s) => {
      const inital = s.name[0].toUpperCase();
      group[inital] = group[inital] || [];
      group[inital].push(s);
      return group;
    },
    {} as Record<string, [HTSpeaker]>
  );
  /* eslint-disable no-param-reassign */

  if (loadingEvents) {
    return (
      <div className='text-4xl text-green animate-pulse ml-8 mt-8'>
        Loading DEF CON speakers...
      </div>
    );
  }

  return (
    <div id='speakers'>
      {Object.entries(groupedSpeakers)
        .sort()
        .map(([intial, groupedSpeaker]) => (
          <div key={intial}>
            <div
              className={`sticky top-0 z-100 border-4 border-${theme.color} bg-black`}>
              <h4 className='text-gray-light p-1 ml-3'>{intial}</h4>
            </div>
            {groupedSpeaker.sort().map((s) => (
              <div className='event' key={s.id} aria-hidden='true'>
                <div
                  role='button'
                  tabIndex={s.id}
                  onClick={() => showDetails(s.id.toString())}
                  onKeyDown={() => showDetails(s.id.toString())}>
                  <div>
                    <h2 className='text-red text-xl'>{s.name}</h2>
                  </div>
                </div>

                <div id={s.id.toString()} className='hidden mt-6'>
                  <SpeakerDetails speaker={s} localTime={localTime} />
                </div>
              </div>
            ))}
          </div>
        ))}
    </div>
  );
};

export default Speakers;
