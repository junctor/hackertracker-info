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
    <div className="ui-markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: (props) => {
            const className = [props.className, "ui-link ui-focus-ring"].filter(Boolean).join(" ");

            return <a {...props} className={className} />;
          },

          code: ({ inline, className, children, ...other }: CodeProps) =>
            inline ? (
              <code {...other} className="ui-markdown-inline-code">
                {children}
              </code>
            ) : (
              <pre className="ui-markdown-pre">
                <code className={className}>{children}</code>
              </pre>
            ),

          blockquote: (props) => <blockquote {...props} />,

          hr: (props) => <hr {...props} />,

          img: (props) => (
            // Markdown images have unknown sizes; keep native img for now.
            <img
              {...props}
              alt={props.alt ?? ""}
              loading="lazy"
              decoding="async"
              className="ui-markdown-image"
            />
          ),

          table: ({ className, ...props }: TableProps) => (
            <div className="ui-markdown-table-wrap">
              <table {...props} className={className} />
            </div>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
