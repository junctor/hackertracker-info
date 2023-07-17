import Heading from "../heading/Heading";
import SpeakerDetails from "./SpeakerDetails";

function Speaker({ speaker }: { speaker: HTSpeaker }) {
  return (
    <div>
      <Heading />
      <SpeakerDetails speaker={speaker} />
    </div>
  );
}

export default Speaker;
