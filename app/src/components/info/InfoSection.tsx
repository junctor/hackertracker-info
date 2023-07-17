import FormatDescription from "../misc/FormatDesc";

function InfoSection({
  section,
  content,
}: {
  section: string;
  content: string;
}) {
  return (
    <div className="mt-5">
      <h2 className="font-bold text-base sm:text-lg md:text-xl lg:text-2xl">
        {section}
      </h2>
      <div className="mt-5">
        <FormatDescription details={content} />
      </div>
    </div>
  );
}

export default InfoSection;
