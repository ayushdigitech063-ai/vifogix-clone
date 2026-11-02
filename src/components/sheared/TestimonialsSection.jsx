// TestimonialsSection.jsx
import { Star } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { testimonials } from "../../data/linkbuilding";

const TestimonialsSection = () => (
  <section className="bg-background py-16 md:py-20">
    <div className="mx-auto max-w-7xl px-4">
      <SectionHeading title="What Clients Say" />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map(({ name, date, text }) => (
          <figure key={name} className="rounded-xl border border-border bg-surface p-6">
            <div className="mb-3 flex gap-0.5 text-accent-yellow" aria-label="5 out of 5 stars">
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <blockquote className="text-sm text-fg">{text}</blockquote>
            <figcaption className="mt-4 flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                {name[0]}
              </span>
              <span>
                <span className="block text-sm font-semibold text-fg">{name}</span>
                <span className="block text-xs text-muted">{date}</span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;