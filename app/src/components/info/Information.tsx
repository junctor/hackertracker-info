import Heading from "../heading/Heading";
import PageTitle from "../misc/PageTitle";
import ConInfo from "./ConInfo";
import FAQ from "./FAQ";

function Information({
  conference,
  faq,
  news,
}: {
  conference: HTConference;
  faq: HTFAQ[];
  news: HTNews[];
}) {
  return (
    <div>
      <Heading />
      <PageTitle title="Info" />
      <ConInfo conference={conference} news={news} />
      {faq.length > 0 && <FAQ faq={faq} />}
    </div>
  );
}

export default Information;
