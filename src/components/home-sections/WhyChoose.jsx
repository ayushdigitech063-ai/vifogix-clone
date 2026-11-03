import BannerHeading from "../sheared/BannerHeading";
import { whyChooseUs } from "../../data/home";

const WhyChooseUs = () => (
  <section className="bg-navy-900 py-16 md:py-20 text-white">
    <div className="mx-auto max-w-7xl px-4">
      <BannerHeading tone="dark"
        eyebrow="Why Us"
        title="Choose Us For A"
        highlight="Reason!"
        description="From driving traffic to building goodwill, we can be your partner in growth."
        className="mb-12"
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {whyChooseUs.map(({ title, description }, i) => (
          <article key={title} className="rounded-xl border border-white/10 bg-white/5 p-6 transition-shadow hover:shadow-md">
            <span className="text-3xl font-bold text-accent-yellow">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="mt-2 text-white">{title}</h3>
            <p className="mt-2 text-sm text-white/70">{description}</p>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default WhyChooseUs;