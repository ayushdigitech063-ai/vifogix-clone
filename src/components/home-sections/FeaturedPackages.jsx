import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import BannerHeading from "../sheared/BannerHeading";
import { packages } from "../../data/home";

const FeaturedPackages = () => (
  <section className="bg-surface py-16 md:py-20">
    <div className="mx-auto max-w-6xl px-4">
      <BannerHeading
        eyebrow="Featured Packages"
        title="Ready-Made Packages for"
        highlight="Faster Results"
        className="mb-12"
      />
      <div className="grid gap-6 md:grid-cols-3">
        {packages.map((p) => (
          <article
            key={p.name}
            className={`relative flex flex-col rounded-2xl border bg-background p-7 ${
              p.featured ? "border-primary shadow-lg" : "border-border"
            }`}
          >
            {p.featured && (
              <span className="absolute -top-3 left-7 rounded-full bg-accent-yellow px-3 py-0.5 text-xs font-bold text-fg">
                Best value
              </span>
            )}
            <h3>{p.name}</h3>
            <p className="mt-3 text-4xl font-bold text-fg">
              {p.price} <span className="text-base font-medium text-muted">{p.note}</span>
            </p>
            <ul className="my-6 flex-1 space-y-3">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-fg">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {f}
                </li>
              ))}
            </ul>
            <Link
              to="/marketplace"
              className={`rounded-lg px-4 py-2.5 text-center text-sm font-semibold ${
                p.featured
                  ? "bg-primary text-white hover:bg-primary-light"
                  : "border border-border bg-surface text-fg hover:border-primary-light hover:text-primary"
              }`}
            >
              Get Package
            </Link>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturedPackages;