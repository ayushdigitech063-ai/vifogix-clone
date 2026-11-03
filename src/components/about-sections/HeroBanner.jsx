import { Link } from "react-router-dom";
import BannerHeading from "../sheared/BannerHeading";

const HeroBanner = ({ hero }) => {
  return (
    <section className="relative flex min-h-[560px] items-center overflow-hidden border-b border-border bg-gradient-to-r from-navy-800 via-navy-900 to-navy-950 text-white">
     
      {/* Soft blurred glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-accent-yellow/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-primary/25 blur-3xl"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center px-4 py-14 text-center md:py-24">
        {/* Centred Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-4 flex items-center gap-1.5 text-xs text-muted/70 md:text-sm"
        >
          <Link to="/" className="transition-colors hover:text-white">
            Home
          </Link>
          <span>/</span>
          <span className="font-medium text-white">About us</span>
        </nav>

        {/* Banner Heading */}
        <BannerHeading
          as="h1"
          align="center"
          maxWidth="2xl"
          tone="dark"
          title={
            <>
              {hero.title}
              <span className="mt-2 block text-accent-yellow">{hero.accent}</span>
            </>
          }
          titleClassName="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl"
          description={hero.description}
        >
          {/* CTA buttons */}
          <div className="flex flex-wrap justify-center gap-3">
            {hero.ctas?.map((c) => (
              <Link
                key={c.label}
                to={c.href}
                className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors ${
                  c.primary
                    ? "bg-accent-yellow text-fg hover:opacity-90"
                    : "border border-white/40 text-white hover:bg-white hover:text-fg"
                }`}
              >
                {c.label}
              </Link>
            ))}
          </div>
        </BannerHeading>

        {/* Stats Row */}
        {hero.stats && (
          <dl className="mx-auto mt-12 grid w-full max-w-4xl grid-cols-2 gap-6 border-t border-white/10 pt-8 md:grid-cols-4">
            {hero.stats.map((s) => (
              <div key={s.label}>
                <dt className="text-2xl font-extrabold text-accent-yellow md:text-3xl">
                  {s.value}
                </dt>
                <dd className="mt-1 text-xs text-gray-300">{s.label}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
};

export default HeroBanner;
