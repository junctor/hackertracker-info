import Heading from "../heading/Heading";
import PageTitle from "../misc/PageTitle";
import MapsDisplay from "./MapsDisplay";

function Apps({ conference }: MapProps) {
  return (
    <div>
      <Heading />
      <PageTitle title='Maps' />
      <MapsDisplay conference={conference} />
    </div>
  );
}

export default Apps;
