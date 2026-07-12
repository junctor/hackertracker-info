import type { ComponentPropsWithoutRef, ReactNode, TableHTMLAttributes } from "react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { getSafeExternalHref, getSafeImageHref } from "@/lib/url";

type Props = {
  content: string;
};

type CodeProps = {
  inline?: boolean;
  className?: string;
  children?: ReactNode;
};

type TableProps = TableHTMLAttributes<HTMLTableElement>;

function getSafeMarkdownHref(value?: string | null): string | null {
  const trimmed = value?.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith("#")) return trimmed;
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) return trimmed;

  return getSafeExternalHref(trimmed);
}

function isExternalNavigationHref(value: string): boolean {
  return /^https?:/i.test(value);
}

function MarkdownLink({ href, children, className, ...props }: ComponentPropsWithoutRef<"a">) {
  const safeHref = getSafeMarkdownHref(href);

  if (!safeHref) return <>{children}</>;

  const resolvedClassName = [className, "ui-link ui-focus-ring"].filter(Boolean).join(" ");
  const externalProps = isExternalNavigationHref(safeHref)
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <a {...props} {...externalProps} href={safeHref} className={resolvedClassName}>
      {children}
    </a>
  );
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

function MarkdownImage({ src, alt, ...props }: ComponentPropsWithoutRef<"img">) {
  const safeSrc = getSafeImageHref(src);

  if (!safeSrc) return null;

  return (
    // Markdown images have unknown sizes; keep native img for now.
    <img
      {...props}
      src={safeSrc}
      alt={alt ?? ""}
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
