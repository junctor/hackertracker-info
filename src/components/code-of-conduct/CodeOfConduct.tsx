import React from "react";

import Markdown from "../markdown/Markdown";

export default function CodeOfConduct({ text }: { text: string }) {
  return (
    <div className="mx-5 my-6">
      <h1 className="font-extrabold text-2xl sm:text-3xl md:text-4xl mb-4">
        Code of Conduct
      </h1>

      <Markdown content={text} />
    </div>
  );
}
