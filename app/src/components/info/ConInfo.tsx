import InfoSection from "./InfoSection";
import News from "./News";

function ConInfo({
  conference,
  news,
}: {
  conference: HTConference;
  news: HTNews[];
}) {
  return (
    <div className="mt-5 mx-8">
      {conference.description.length > 0 && (
        <InfoSection section="DEF CON 31" content={conference.description} />
      )}

      {news.length > 0 && <News news={news} />}

      {conference.codeofconduct != null && (
        <InfoSection
          section="Code of Conduct"
          content={conference.codeofconduct}
        />
      )}
      {conference.supportdoc !== null && (
        <InfoSection section="Support" content={conference.supportdoc} />
      )}
    </div>
  );
}

export default ConInfo;
