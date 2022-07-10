import Heading from "../heading/Heading";
import SpeakerDetails from "./SpeakerDetails";

function Speaker({ speaker }: SpeakerDetailProps) {
  return (
    <div>
      {speaker && (
        <>
          <Heading />
          <SpeakerDetails speaker={speaker} />
        </>
      )}
    </div>
  );
}

export default Speaker;
