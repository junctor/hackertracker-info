import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import React from "react";

function FAQ({ faq }: { faq: HTFAQ[] }) {
  return (
    <div>
      <h1 className="font-bold text-base sm:text-lg md:text-xl lg:text-2xl">
        FAQ
      </h1>
      <Accordion type="single" collapsible>
        {faq.map((f) => (
          <AccordionItem key={f.id} value={f.question}>
            <AccordionTrigger>{f.question}</AccordionTrigger>
            <AccordionContent>{f.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

export default FAQ;
