import Heading from "../heading/Heading";
import ConInfo from "./ConInfo";

function Info({ conference }: InfoProps) {
  return (
    <div>
      <Heading />
      {conference && <ConInfo conference={conference} />}
    </div>
  );
}

export default Info;
