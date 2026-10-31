// WhyChooseSection.jsx
import SectionHeading from "../sheared/SectionHeading";
import { whyChoose } from "../../data/linkbuilding";

const WhyChooseSection = () => (
  <section className="bg-surface py-16 md:py-20">
    <div className="mx-auto max-w-7xl px-4">
      <SectionHeading
        eyebrow="Why Vefogix"
        title="Why Businesses Choose Us for Link Building Services"
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {whyChoose.map(({ title, description }, i) => (
          <article key={title} className="rounded-xl border border-border bg-background p-6">
            <span className="text-3xl font-bold text-primary/30">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-2">{title}</h3>
            <p className="mt-2 text-sm text-muted">{description}</p>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default WhyChooseSection;