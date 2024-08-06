import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import React from "react";

export default function Markdown({ content }: { content: string }) {
  return (
    <div className="prose lg:prose-xl whitespace-pre-wrap">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
