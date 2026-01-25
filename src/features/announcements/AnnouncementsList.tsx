import React, { useMemo } from "react";
import { newsTime } from "@/lib/dates";
import Markdown from "@/components/markdown/Markdown";
import { Articles } from "@/lib/types/info";

export default function AnnouncementsList({
  announcements,
}: {
  announcements: Articles;
}) {
  const sorted = useMemo(() => {
    return announcements
      .slice()
      .sort((a, b) => b.updated_at.seconds - a.updated_at.seconds);
  }, [announcements]);

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

      <div className="space-y-3">
        {sorted.map((item, index) => {
          const dateMs = item.updated_at.seconds * 1000;
          const date = new Date(dateMs);
          return (
            <details
              key={item.id}
              open={index === 0}
              className="rounded-lg border border-gray-800 bg-gray-950/40"
            >
              <summary className="cursor-pointer list-none px-4 py-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-lg font-medium">{item.name}</h2>
                  <time
                    dateTime={date.toISOString()}
                    title={date.toLocaleString()}
                    className="text-sm text-gray-500"
                  >
                    {newsTime(date)}
                  </time>
                </div>
              </summary>
              <div className="prose max-w-none px-4 pb-4 pt-2">
                <Markdown content={item.text} />
              </div>
            </details>
          );
        })}
      </div>
    </section>
  );
}
