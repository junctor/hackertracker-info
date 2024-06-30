import ConInfo from "./ConInfo";
import FAQ from "./FAQ";
import React from "react";

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
      <ConInfo conference={conference} news={news} />
      {faq.length > 0 && <FAQ faq={faq} />}
    </div>
  );
}

export default Information;
