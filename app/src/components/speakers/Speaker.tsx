import { EventDetailHeading } from "../heading/EventDetailsHeading";
import Heading from "../heading/Heading";
import NavLinks from "../heading/NavLinks";
import SpeakerDetails from "./SpeakerDetails";

export const Speaker = ({ speaker }: SpeakerDetailProps) => {
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
};

export default Speaker;
