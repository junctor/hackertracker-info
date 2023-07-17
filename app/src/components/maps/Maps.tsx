import Heading from "../heading/Heading";
import PageTitle from "../misc/PageTitle";
import MapsDisplay from "./MapsDisplay";

function Maps({ conference }: { conference: HTConference }) {
  return (
    <div>
      <Heading />
      <PageTitle title="Maps" />
      <MapsDisplay conference={conference} />
    </div>
  );
}

export default Maps;
