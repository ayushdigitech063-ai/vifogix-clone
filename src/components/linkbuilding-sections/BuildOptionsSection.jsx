// BuildOptionsSection.jsx
import SectionHeading from "../sheared/SectionHeading";
import { buildOptions, benefits } from "../../data/linkbuilding";

const BuildOptionsSection = () => (
  <section className="bg-surface py-16 md:py-20">
    <div className="mx-auto max-w-7xl px-4">
      <SectionHeading title="Choose How You Want to Build Your Link Profile" />

      <div className="grid gap-6 md:grid-cols-2">
        {buildOptions.map(({ title, description }) => (
          <article key={title} className="rounded-xl border border-primary/30 bg-primary/5 p-8">
            <h3 className="text-xl text-primary">{title}</h3>
            <p className="mt-3 text-muted">{description}</p>
          </article>
        ))}
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {benefits.map(({ title, description }, i) => (
          <article key={title} className="rounded-xl border border-border bg-background p-6">
            <span className="text-sm font-bold text-accent-red">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="mt-1">{title}</h3>
            <p className="mt-2 text-sm text-muted">{description}</p>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default BuildOptionsSection;