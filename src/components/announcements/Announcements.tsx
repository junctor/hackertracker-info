import React, { useMemo } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { newsTime } from "@/lib/dates";
import Markdown from "../markdown/Markdown";
import { Articles } from "@/types/info";

export default function Announcements({
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

      <Accordion
        type="single"
        collapsible
        defaultValue={sorted[0].name}
        aria-label="Site announcements"
      >
        {sorted.map((item) => {
          const dateMs = item.updated_at.seconds * 1000;
          const date = new Date(dateMs);
          return (
            <AccordionItem key={item.id} value={item.name}>
              <AccordionTrigger className="py-4 px-3 unded-lg transition">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-medium mr-10">{item.name}</h2>
                  <time
                    dateTime={date.toISOString()}
                    title={date.toLocaleString()}
                    className="text-sm text-gray-500"
                  >
                    {newsTime(date)}
                  </time>
                </div>
              </AccordionTrigger>

              <AccordionContent className="prose max-w-none py-4">
                <Markdown content={item.text} />
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </section>
  );
}
