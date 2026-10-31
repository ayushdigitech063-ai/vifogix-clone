
import { Link } from "react-router-dom";
import BannerHeading from "../sheared/BannerHeading";
import { flexibleServices } from "../../data/home";

const FlexibleServices = () => (
  <section className="bg-surface py-16 md:py-20">
    <div className="mx-auto max-w-6xl px-4">
      <BannerHeading
        eyebrow="Flexible Solutions"
        title="Flexible Guest Posting &"
        highlight="Link Building Services"
        className="mb-12"
      />

      <div className="grid gap-6 md:grid-cols-2">
        {flexibleServices.map(({ icon: Icon, title, description }) => (
          <article key={title} className="flex gap-4 rounded-xl border border-border bg-background p-6">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="h-6 w-6" />
            </span>
            <div>
              <h3>{title}</h3>
              <p className="mt-2 text-sm text-muted">{description}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-10 flex flex-col items-start justify-between gap-6 rounded-2xl bg-primary p-8 md:flex-row md:items-center">
        <div>
          <h3 className="text-xl text-white">Need help with your content or links?</h3>
          <p className="mt-1 text-white/80">Talk to an expert and keep building your online authority.</p>
        </div>
        <Link to="/contact-us" className="rounded-lg bg-accent-yellow px-6 py-3 font-semibold text-fg hover:opacity-90">
          Contact Us
        </Link>
      </div>
    </div>
  </section>
);

export default FlexibleServices;