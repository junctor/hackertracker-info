import Heading from "../heading/Heading";
import PageTitle from "../misc/PageTitle";
import ConInfo from "./ConInfo";
import FAQ from "./FAQ";

function Information({
  conference,
  faq,
}: {
  conference: HTConference;
  faq: HTFAQ[];
}) {
  return (
    <div>
      <Heading />
      <PageTitle title="Info" />
      <ConInfo conference={conference} />
      {faq.length > 0 && <FAQ faq={faq} />}
    </div>
  );
}

export default Information;
