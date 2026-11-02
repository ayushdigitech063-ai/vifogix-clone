// HowItWorksSection.jsx
import SectionHeading from "../sheared/SectionHeading";
import { steps } from "../../data/linkbuilding";

const HowItWorksSection = () => (
  <section className="bg-surface py-16 md:py-20">
    <div className="mx-auto max-w-7xl px-4">
      <SectionHeading eyebrow="How it works" title="How Our Link Building Service Works" />
      <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map(({ title, description }, i) => (
          <li key={title} className="relative rounded-xl border border-border bg-background p-6">
            <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
              {i + 1}
            </span>
            <h3>{title}</h3>
            <p className="mt-2 text-sm text-muted">{description}</p>
          </li>
        ))}
      </ol>
    </div>
  </section>
);

export default HowItWorksSection;