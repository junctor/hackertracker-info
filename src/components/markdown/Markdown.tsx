import type { ComponentPropsWithoutRef, ReactNode, TableHTMLAttributes } from "react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = {
  content: string;
};

type CodeProps = {
  inline?: boolean;
  className?: string;
  children?: ReactNode;
};

type TableProps = TableHTMLAttributes<HTMLTableElement>;

function MarkdownLink(props: ComponentPropsWithoutRef<"a">) {
  const className = [props.className, "ui-link ui-focus-ring"].filter(Boolean).join(" ");

  return <a {...props} className={className} />;
}

function MarkdownCode({ inline, className, children, ...other }: CodeProps) {
  return inline ? (
    <code {...other} className="ui-markdown-inline-code">
      {children}
    </code>
  ) : (
    <pre className="ui-markdown-pre">
      <code className={className}>{children}</code>
    </pre>
  );
}

function MarkdownBlockquote(props: ComponentPropsWithoutRef<"blockquote">) {
  return <blockquote {...props} />;
}

function MarkdownHr(props: ComponentPropsWithoutRef<"hr">) {
  return <hr {...props} />;
}

function MarkdownImage(props: ComponentPropsWithoutRef<"img">) {
  return (
    // Markdown images have unknown sizes; keep native img for now.
    <img
      {...props}
      alt={props.alt ?? ""}
      loading="lazy"
      decoding="async"
      className="ui-markdown-image"
    />
  );
}

function MarkdownTable({ className, ...props }: TableProps) {
  return (
    <div className="ui-markdown-table-wrap">
      <table {...props} className={className} />
    </div>
  );
}

const markdownComponents = {
  a: MarkdownLink,
  code: MarkdownCode,
  blockquote: MarkdownBlockquote,
  hr: MarkdownHr,
  img: MarkdownImage,
  table: MarkdownTable,
};

export default function Markdown({ content }: Props) {
  return (
    <div className="ui-markdown">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
