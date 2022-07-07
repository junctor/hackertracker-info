import SpeakerList from "./SpeakerList";
import SpeakerHeading from "../heading/SpeakerHeading";
import { createSpeakerGroup } from "../../utils/misc";

export const Speakers = ({ speakers }: SpeakersProps) => {
  let speakerGroup = createSpeakerGroup(speakers);

  return (
    <div>
      <SpeakerHeading speakers={speakers} />
      <SpeakerList speakerGroup={speakerGroup} />
    </div>
  );
};

export default Speakers;
