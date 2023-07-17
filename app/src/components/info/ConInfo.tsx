import InfoSection from "./InfoSection";

function ConInfo({ conference }: { conference: HTConference }) {
  return (
    <div className="mt-5 mx-8">
      {conference.description.length > 0 && (
        <InfoSection section="DEF CON 31" content={conference.description} />
      )}
      {conference.codeofconduct != null && (
        <InfoSection
          section="Code of Conduct"
          content={conference.codeofconduct}
        />
      )}
      {conference.supportdoc.length > 0 && (
        <InfoSection section="Support" content={conference.supportdoc} />
      )}
    </div>
  );
}

export default ConInfo;
