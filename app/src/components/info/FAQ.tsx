import TextSection from "./TextSection";

function FAQ({ faq }: { faq: HTFAQ[] }) {
  return (
    <div>
      <h1 className="font-bold text-base sm:text-lg md:text-xl lg:text-2xl">
        FAQ
      </h1>
      {faq.map((f) => (
        <TextSection key={f.id} section={f.question} content={f.answer} />
      ))}
    </div>
  );
}

export default FAQ;
