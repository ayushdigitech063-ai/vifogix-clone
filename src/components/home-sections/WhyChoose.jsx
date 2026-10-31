import BannerHeading from "../sheared/BannerHeading";
import { whyChooseUs } from "../../data/home";

const WhyChooseUs = () => (
  <section className="bg-background py-16 md:py-20">
    <div className="mx-auto max-w-7xl px-4">
      <BannerHeading
        eyebrow="Why Vefogix"
        title="Choose Us For A"
        highlight="Reason!"
        description="From driving traffic to building goodwill, we can be your partner in growth."
        className="mb-12"
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {whyChooseUs.map(({ title, description }, i) => (
          <article key={title} className="rounded-xl border border-border bg-surface p-6 transition-shadow hover:shadow-md">
            <span className="text-3xl font-bold text-primary/30">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="mt-2">{title}</h3>
            <p className="mt-2 text-sm text-muted">{description}</p>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default WhyChooseUs;