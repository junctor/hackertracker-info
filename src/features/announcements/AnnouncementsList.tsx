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
      <div className="ui-container ui-page-content text-center text-slate-500">
        No announcements at this time.
      </div>
    );
  }

  return (
    <section className="ui-container ui-page-content">
      <h1 className="ui-heading-1 mb-5">Announcements</h1>

      <ul className="list-none space-y-4" role="list">
        {sorted.map((item, index) => {
          const date = new Date(item.updatedAtMs);
          return (
            <li key={item.id}>
              <details open={index === 0} className="ui-card overflow-hidden">
                <summary className="ui-focus-ring cursor-pointer list-none px-4 py-3 focus-visible:outline-none">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="text-lg font-semibold text-slate-100">{item.name}</h2>
                    <time
                      dateTime={date.toISOString()}
                      title={date.toLocaleString()}
                      className="text-sm text-slate-300/90"
                    >
                      {newsAgo(date)} · {newsTime(date, conference.timezone, { showTz: true })}
                    </time>
                  </div>
                </summary>
                {item.text && (
                  <div className="border-t border-white/10 px-4 pt-2 pb-4">
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
