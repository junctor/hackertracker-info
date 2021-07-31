import { HTSpeaker, SpeakerProps } from "./ht";
import SpeakerDetails from "./SpeakerDetails";
import { Theme } from "./theme";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Speakers = ({ speakers, localTime }: SpeakerProps) => {
  const showDetails = (eventShow: string) => {
    const content = document.getElementById(eventShow);
    content?.classList.toggle("hidden");
  };

  const theme = new Theme();

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

  return (
    <div id='speakers'>
      {Object.entries(groupedSpeakers)
        .sort()
        .map(([intial, groupedSpeaker]) => (
          <div key={intial}>
            <div
              className={`sticky top-0 z-100 border-4 border-${theme.color} bg-black`}>
              <p className='text-gray-light text-xl font-bold p-1 ml-3'>
                {intial}
              </p>
            </div>
            {groupedSpeaker
              .sort((a, b) => {
                if (a.name.toLowerCase() > b.name.toLowerCase()) {
                  return 1;
                }
                return -1;
              })
              .map((s) => (
                <div className='event' key={s.id} aria-hidden='true'>
                  <div
                    role='button'
                    tabIndex={s.id}
                    onClick={() => showDetails(s.id.toString())}
                    onKeyDown={() => showDetails(s.id.toString())}>
                    <div>
                      <p className='text-red text-l inline'>{s.name}</p>
                      {s.twitter && (
                        <a
                          className='text-blue text-sm inline ml-3'
                          target='_blank'
                          rel='noopener noreferrer'
                          href={`https://www.twitter.com/${s.twitter}`}>
                          {`@${s.twitter}`}
                        </a>
                      )}
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
