import { Link } from "react-router-dom";
import BannerHeading from "../sheared/BannerHeading";

const HeroBanner = ({ hero }) => {
  return (
    <section className="relative flex min-h-[360px] items-center overflow-hidden border-b border-border bg-gradient-to-r from-[#171f38] via-[#101626] to-[#0a0e1a] text-white md:min-h-[400px]">
      {/* Subtle dot-grid layer */}
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

      {/* Soft blurred glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-accent-yellow/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-primary/20 blur-3xl"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center px-4 py-12 text-center md:py-16">
        {/* Centred Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-4 flex items-center gap-1.5 text-xs text-muted/70 md:text-sm"
        >
          <Link to="/" className="transition-colors hover:text-white">
            Home
          </Link>
          <span>/</span>
          <span className="font-medium text-white">Contact us</span>
        </nav>

        {/* Banner Heading */}
        <BannerHeading
          as="h1"
          align="center"
          maxWidth="2xl"
          tone="dark"
          title={
            <>
              {hero.title}{" "}
              <span className="text-accent-yellow">{hero.accent}</span>
            </>
          }
          titleClassName="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl"
          description={hero.description}
        />
      </div>
    </section>
  );
};

export default HeroBanner;

