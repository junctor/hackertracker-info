import type { ReactNode, TableHTMLAttributes } from "react";

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

export default function Markdown({ content }: Props) {
  return (
    <div className="ui-markdown prose prose-invert prose-sm prose-table:w-full prose-table:border-collapse prose-th:border prose-th:px-3 prose-th:py-2 prose-th:text-left prose-td:border prose-td:px-3 prose-td:py-2 sm:prose-base md:prose-lg max-w-none wrap-break-word antialiased">
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
              <code {...other} className="font-mono text-sm">
                {children}
              </code>
            ) : (
              <pre className="my-5">
                <code className={className}>{children}</code>
              </pre>
            ),

          blockquote: (props) => <blockquote {...props} className="pl-4 italic" />,

          hr: (props) => <hr {...props} className="my-8 border-t" />,

          img: (props) => (
            // Markdown images have unknown sizes; keep native img for now.
            <img
              {...props}
              alt={props.alt ?? ""}
              loading="lazy"
              decoding="async"
              className="mx-auto my-5 rounded-md shadow-sm"
            />
          ),

          table: ({ className, ...props }: TableProps) => (
            <div className="my-5 overflow-x-auto">
              <table {...props} className={[className, "min-w-max"].filter(Boolean).join(" ")} />
            </div>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
