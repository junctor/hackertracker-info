import { useMemo } from "react";

import Markdown from "@/components/markdown/Markdown";
import { ConferenceManifest } from "@/lib/conferences";
import { newsAgo, newsTime } from "@/lib/dates";
import { ArticlesStore } from "@/lib/types/ht-types";

type Props = {
  announcements: ArticlesStore;
  conference: ConferenceManifest;
};

export default function AnnouncementsList({ announcements, conference }: Props) {
  const sorted = useMemo(() => {
    return Object.values(announcements.byId).toSorted((a, b) => b.updatedAtMs - a.updatedAtMs);
  }, [announcements.byId]);

  if (!sorted.length) {
    return (
      <div className="mx-5 py-10 text-center text-gray-500">No announcements at this time.</div>
    );
  }

  return (
    <section className="mx-5 my-6">
      <h1 className="mb-4 text-2xl font-extrabold sm:text-3xl md:text-4xl">Announcements</h1>

      <ul className="list-none space-y-3" role="list">
        {sorted.map((item, index) => {
          const date = new Date(item.updatedAtMs);
          return (
            <li key={item.id}>
              <details
                open={index === 0}
                className="rounded-lg border border-gray-800 bg-gray-950/40"
              >
                <summary className="cursor-pointer list-none rounded-lg px-4 py-3 focus-visible:ring-2 focus-visible:ring-indigo-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950/40 focus-visible:outline-none">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="text-lg font-medium">{item.name}</h2>
                    <time
                      dateTime={date.toISOString()}
                      title={date.toLocaleString()}
                      className="text-sm text-gray-300"
                    >
                      {newsAgo(date)} · {newsTime(date, conference.timezone, { showTz: true })}
                    </time>
                  </div>
                </summary>
                {item.text && (
                  <div className="prose max-w-none px-4 pt-2 pb-4">
                    <Markdown content={item.text} />
                  </div>
                )}
              </details>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
