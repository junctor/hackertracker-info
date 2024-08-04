import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { newsTime } from "@/lib/utils/dates";
import React from "react";
import ReactMarkdown from "react-markdown";

function News({ news }: { news: HTNews[] }) {
  const sortedNews = news.sort(
    (a, b) => b.updated_at.seconds - a.updated_at.seconds
  );

  return (
    <div className="mx-5">
      <h1 className="font-bold text-base sm:text-lg md:text-xl lg:text-2xl">
        News
      </h1>
      <Accordion type="single" collapsible defaultValue={sortedNews[0].name}>
        {sortedNews.map((n) => (
          <AccordionItem key={n.id} value={n.name}>
            <AccordionTrigger>
              <div className="grid grid-cols-2 gap-1 md:gap-2">
                <div className="place-self-center">
                  <h4 className="text-md md:text-lg">{n.name}</h4>
                </div>
                <div className="place-self-center">
                  <p className="text-xs md:text-sm">
                    ({newsTime(new Date(n.updated_at.seconds))})
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="prose lg:prose-xl whitespace-pre-wrap">
                <ReactMarkdown>{n.text}</ReactMarkdown>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

export default News;
