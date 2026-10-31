// FaqSection.jsx
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { faqs } from "../../data/linkbuilding";

const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="bg-background py-16 md:py-20">
      <div className="mx-auto max-w-3xl px-4">
        <SectionHeading title="Frequently Asked Questions (FAQs)" />
        <div className="space-y-3">
          {faqs.map(({ q, a }, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={q} className="rounded-xl border border-border bg-surface">
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-medium text-fg"
                >
                  {q}
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-muted transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isOpen && <p className="px-5 pb-4 text-sm text-muted">{a}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;