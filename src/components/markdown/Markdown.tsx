import type { ReactNode } from "react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import styles from "../../styles/markdown.module.css";

type Props = {
  content: string;
};

type CodeProps = {
  inline?: boolean;
  className?: string;
  children?: ReactNode;
};

export default function Markdown({ content }: Props) {
  return (
    <div className="prose dark:prose-invert prose-sm sm:prose-base md:prose-lg prose-headings:text-slate-100 prose-p:text-slate-200 prose-li:text-slate-200 prose-strong:text-slate-100 prose-a:text-(--accent-primary) hover:prose-a:text-(--accent-success) prose-code:text-slate-100 prose-hr:border-slate-700/80 wrap-break-word antialiased md:max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: (props) => {
            const className = [props.className, "ui-link ui-focus-ring focus-visible:outline-none"]
              .filter(Boolean)
              .join(" ");

            return <a {...props} className={className} />;
          },

          code: ({ inline, className, children, ...other }: CodeProps) =>
            inline ? (
              <code
                {...other}
                className="rounded bg-slate-700/80 px-1 font-mono text-sm text-slate-100"
              >
                {children}
              </code>
            ) : (
              <pre className="my-5 overflow-x-auto rounded-lg bg-slate-900 p-4 text-slate-100">
                <code className={className}>{children}</code>
              </pre>
            ),

          blockquote: (props) => (
            <blockquote
              {...props}
              className="border-l-4 border-[#105F66] pl-4 text-slate-200 italic"
            />
          ),

          hr: (props) => <hr {...props} className="my-8 border-t border-slate-700/80" />,

          img: (props) => (
            // Markdown images have unknown sizes; keep native img for now.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              {...props}
              alt={props.alt ?? ""}
              loading="lazy"
              decoding="async"
              className="mx-auto my-5 rounded-md shadow-sm"
            />
          ),

          div: (props) => {
            const className = [styles.markdown, props.className].filter(Boolean).join(" ");

            return <div {...props} className={className} />;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
