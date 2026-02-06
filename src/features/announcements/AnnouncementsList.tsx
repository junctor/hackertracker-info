import { useMemo } from "react";
import { newsAgo, newsTime } from "@/lib/dates";
import Markdown from "@/components/markdown/Markdown";
import { ArticlesStore } from "@/lib/types/ht-types";
import { ConferenceManifest } from "@/lib/conferences";

type Props = {
  announcements: ArticlesStore;
  conference: ConferenceManifest;
};

export default function AnnouncementsList({
  announcements,
  conference,
}: Props) {
  const sorted = useMemo(() => {
    const items = Object.values(announcements.byId);
    items.sort((a, b) => b.updatedAtMs - a.updatedAtMs);
    return items;
  }, [announcements.byId]);

  if (!sorted.length) {
    return (
      <div className="mx-5 py-10 text-center text-gray-500">
        No announcements at this time.
      </div>
    );
  }

  return (
    <section className="mx-5 my-6">
      <h1 className="font-extrabold text-2xl sm:text-3xl md:text-4xl mb-4">
        Announcements
      </h1>

      <ul className="space-y-3 list-none" role="list">
        {sorted.map((item, index) => {
          const date = new Date(item.updatedAtMs);
          return (
            <li key={item.id}>
              <details
                open={index === 0}
                className="rounded-lg border border-gray-800 bg-gray-950/40"
              >
                <summary className="cursor-pointer list-none rounded-lg px-4 py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950/40">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="text-lg font-medium">{item.name}</h2>
                    <time
                      dateTime={date.toISOString()}
                      title={date.toLocaleString()}
                      className="text-sm text-gray-300"
                    >
                      {newsAgo(date)} ·{" "}
                      {newsTime(date, conference.timezone, { showTz: true })}
                    </time>
                  </div>
                </summary>
                {item.text && (
                  <div className="prose max-w-none px-4 pb-4 pt-2">
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
