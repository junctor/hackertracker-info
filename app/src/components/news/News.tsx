import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import React from "react";

function News({ news }: { news: HTNews[] }) {
  return (
    <div className="mx-5">
      <h1 className="font-bold text-base sm:text-lg md:text-xl lg:text-2xl">
        News
      </h1>
      <Accordion type="single" collapsible>
        {news
          .sort((a, b) => b.updated_at.seconds - a.updated_at.seconds)
          .map((n) => (
            <AccordionItem key={n.id} value={n.name}>
              <AccordionTrigger>{n.name}</AccordionTrigger>
              <AccordionContent>{n.text}</AccordionContent>
            </AccordionItem>
          ))}
      </Accordion>
    </div>
  );
}

export default News;
