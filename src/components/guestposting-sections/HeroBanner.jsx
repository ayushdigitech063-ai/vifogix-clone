import BannerHeading from "../sheared/BannerHeading";
import heroBackground from "../../assets/images/hero-guest-posting-services.png";

const HeroBanner = ({ data }) => (
  <section className="relative flex min-h-[560px] items-center overflow-hidden border-b border-border bg-[#23314e] text-white">
    {/* Background Image with Overlay */}
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
      <img
        src={heroBackground}
        alt=""
        className="h-full w-full object-cover object-center"
      />
    </div>

    <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-14 text-left md:py-24">
      <nav className="mb-3 text-sm text-gray-400">
        {data.breadcrumb.map((b, i) => (
          <span key={b.label}>
            {i > 0 && <span className="mx-1">/</span>}
            {b.href ? (
              <a href={b.href} className="hover:text-white">{b.label}</a>
            ) : (
              <span className="font-medium text-white">{b.label}</span>
            )}
          </span>
        ))}
      </nav>

      <BannerHeading
        as="h1"
        align="left"
        maxWidth="md"
        title={
          <>
            {data.title}
            <span className="block text-accent-yellow">{data.accent}</span>
          </>
        }
        titleClassName="text-white md:text-5xl"
        description={data.description}
      >
        <div className="flex flex-wrap justify-center gap-3">
          {data.ctas.map((c) => (
            <a
              key={c.label}
              href={c.href}
              className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors ${
                c.primary
                  ? "bg-accent-yellow text-fg hover:opacity-90"
                  : "border border-white/40 text-white hover:bg-white hover:text-fg"
              }`}
            >
              {c.label}
            </a>
          ))}
        </div>
      </BannerHeading>

      <dl className="mx-auto mt-10 ml-0.5 grid max-w-4xl grid-cols-2 gap-6 md:grid-cols-4">
        {data.stats.map((s) => (
          <div key={s.label}>
            <dt className="text-2xl font-extrabold text-accent-yellow md:text-3xl">{s.value}</dt>
            <dd className="mt-1 text-xs text-gray-300">{s.label}</dd>
          </div>
        ))}
      </dl>
    </div>
  </section>
);

export default HeroBanner;
