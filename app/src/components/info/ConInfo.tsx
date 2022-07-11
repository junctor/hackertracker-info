import InfoSection from "./InfoSection";

function ConInfo({ conference }: ConInfoProps) {
  return (
    <div className='m-5'>
      {conference.description && (
        <InfoSection section='DEF CON 30' content={conference.description} />
      )}
      {conference.codeofconduct && (
        <InfoSection
          section='Code of Conduct'
          content={conference.codeofconduct}
        />
      )}
    </div>
  );
}

export default ConInfo;
