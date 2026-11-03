// FaqSection.jsx
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { faqs as defaultFaqs } from "../../data/linkbuilding";

const FaqSection = ({ title = "Frequently Asked Questions (FAQs)", items, tone = "default" }) => {
  const [openIndex, setOpenIndex] = useState(0);
  const list = items || defaultFaqs;
  const isCream = tone === "cream";

  return (
    <section className={`${isCream ? "bg-cream" : "bg-background"} py-16 md:py-20`}>
      <div className="mx-auto max-w-3xl px-4">
        <SectionHeading title={title} />
        <div className="space-y-3">
          {list.map(({ q, a }, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={q}
                className={`rounded-xl border transition-colors ${
                  isCream ? "bg-white" : "bg-surface"
                } ${isOpen ? "border-primary" : "border-border"}`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-medium text-fg"
                >
                  {q}
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 transition-transform ${
                      isOpen ? "rotate-180 text-primary" : "text-muted"
                    }`}
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
