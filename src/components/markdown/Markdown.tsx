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
    <div className="prose dark:prose-invert antialiased prose-sm sm:prose-base md:prose-lg wrap-break-word prose-headings:text-gray-100 prose-p:text-gray-200 prose-li:text-gray-200 prose-strong:text-gray-100 prose-a:text-indigo-300 hover:prose-a:text-indigo-200 prose-code:text-gray-100 prose-hr:border-gray-700 md:max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: (props) => {
            const className = [
              props.className,
              "text-indigo-300 underline-offset-2 decoration-indigo-500/40 hover:text-indigo-200 hover:decoration-indigo-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-400",
            ]
              .filter(Boolean)
              .join(" ");

            return <a {...props} className={className} />;
          },

          code: ({ inline, className, children, ...other }: CodeProps) =>
            inline ? (
              <code
                {...other}
                className="bg-gray-700 text-gray-100 px-1 rounded font-mono text-sm"
              >
                {children}
              </code>
            ) : (
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-5">
                <code className={className}>{children}</code>
              </pre>
            ),

          blockquote: (props) => (
            <blockquote
              {...props}
              className="border-l-4 border-indigo-500 pl-4 italic text-gray-200"
            />
          ),

          hr: (props) => (
            <hr {...props} className="my-8 border-t border-gray-700" />
          ),

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
            const className = [styles.markdown, props.className]
              .filter(Boolean)
              .join(" ");

            return <div {...props} className={className} />;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
