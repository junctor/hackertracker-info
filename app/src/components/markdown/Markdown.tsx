import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import React from "react";
import styles from "../../styles/markdown.module.css";

export default function Markdown({ content }: { content: string }) {
  return (
    <div className="prose lg:prose-xl whitespace-pre-wrap">
      <ReactMarkdown className={styles.markdown} remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
