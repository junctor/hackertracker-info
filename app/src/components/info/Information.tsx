import Heading from "../heading/Heading";
import PageTitle from "../misc/PageTitle";
import ConInfo from "./ConInfo";
import FAQ from "./FAQ";

function Information({ conference, faq }: InfoProps) {
  return (
    <div>
      <Heading />
      <PageTitle title='Info' />
      {conference && <ConInfo conference={conference} />}
      <FAQ faq={faq} />
    </div>
  );
}

export default Information;
