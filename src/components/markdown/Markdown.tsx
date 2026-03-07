import type { ReactNode } from "react";

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

export default function Markdown({ content }: Props) {
  return (
    <div className="prose prose-invert prose-sm sm:prose-base md:prose-lg max-w-none break-words text-slate-200 antialiased prose-headings:text-slate-100 prose-p:text-slate-200 prose-li:text-slate-200 prose-strong:text-slate-100 prose-a:text-(--accent-primary) hover:prose-a:text-(--accent-success) prose-code:text-slate-100 prose-hr:border-slate-700/80 prose-table:w-full prose-table:border-collapse prose-th:border prose-th:border-slate-700 prose-th:bg-slate-800 prose-th:px-3 prose-th:py-2 prose-th:text-left prose-th:text-slate-100 prose-td:border prose-td:border-slate-700 prose-td:px-3 prose-td:py-2">
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
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
