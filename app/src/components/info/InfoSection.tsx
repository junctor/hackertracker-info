import ReactMarkdown from "react-markdown";
import React from "react";

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
      <div className="prose-sm md:prose lg:prose-xl">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
}

export default InfoSection;
