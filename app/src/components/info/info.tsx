import Heading from "../heading/Heading";
import ConInfo from "./ConInfo";
import FAQ from "./FAQ";

function Info({ conference, faq }: InfoProps) {
  return (
    <div>
      <Heading />
      {conference && <ConInfo conference={conference} />}
      <FAQ faq={faq} />
    </div>
  );
}

export default Info;
