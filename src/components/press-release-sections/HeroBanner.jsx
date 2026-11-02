import { Link } from "react-router-dom";
import BannerHeading from "../sheared/BannerHeading";

const HeroBanner = ({ data }) => (
  <section className="relative flex min-h-[560px] items-center overflow-hidden border-b border-border bg-gradient-to-r from-[#171f38] via-[#101626] to-[#0a0e1a] text-white">
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 opacity-20"
      style={{
        backgroundImage: "radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
        maskImage: "radial-gradient(ellipse at center, black 25%, transparent 75%)",
        WebkitMaskImage: "radial-gradient(ellipse at center, black 25%, transparent 75%)",
      }}
    />
    <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-accent-yellow/10 blur-3xl" />
    <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />

    <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center px-4 py-14 text-center md:py-24">
      <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1.5 text-xs text-muted/70 md:text-sm">
        <Link to="/" className="transition-colors hover:text-white">Home</Link>
        <span>/</span>
        <span className="font-medium text-white">Press Release</span>
      </nav>

      <BannerHeading
        as="h1"
        align="center"
        maxWidth="2xl"
        tone="dark"
        title={
          <>
            {data.title}
            <span className="mt-2 block text-accent-yellow">{data.accent}</span>
          </>
        }
        titleClassName="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl"
        description={data.description}
      >
        <div className="flex flex-wrap justify-center gap-3">
          {data.ctas.map((c) => (
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
    </div>
  </section>
);

export default HeroBanner;