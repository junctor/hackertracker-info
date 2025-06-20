import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import Markdown from "../markdown/Markdown";
import type { ProcessedContent } from "@/types/info";

interface Props {
  content: ProcessedContent;
}

export default function ContentDetail({ content }: Props) {
  return (
    <div className="space-y-8 my-10">
      <div>
        <Link href="/content">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeftIcon className="h-4 w-4" /> Back to Content
          </Button>
        </Link>
      </div>

      <h1 className="text-4xl font-extrabold text-gray-100">{content.title}</h1>

      {content.sessions.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold text-gray-200 mb-2">
            Sessions
          </h2>
          <ul className="list-disc list-inside space-y-1 text-gray-300">
            {content.sessions.map((s) => (
              <li key={s.session_id}>
                {new Date(s.begin_tsz).toLocaleString()} –{" "}
                {new Date(s.end_tsz).toLocaleString()} ({s.timezone_name})
              </li>
            ))}
          </ul>
        </div>
      )}

      {content.description && (
        <div className="prose prose-invert max-w-none text-gray-100">
          <Markdown content={content.description} />
        </div>
      )}

      {content.links.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold text-gray-200 mb-2">Links</h2>
          <ul className="list-disc list-inside space-y-1 text-gray-300">
            {content.links.map((link) => (
              <li key={link.url}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:underline"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {content.people.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold text-gray-200 mb-2">People</h2>
          <ul className="list-disc list-inside space-y-1 text-gray-300">
            {content.people.map((p) => (
              <li key={p.person_id}>
                <Link
                  href={`/person?id=${p.person_id}`}
                  className="text-gray-100 hover:underline"
                >
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
