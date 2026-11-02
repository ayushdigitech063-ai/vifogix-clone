import BannerHeading from "../sheared/BannerHeading";
import { featuredOn } from "../../data/home";

const FeaturedOn = () => {
  const loop = [...featuredOn, ...featuredOn]; // duplicated so the scroll loops seamlessly

  return (
    <section className="overflow-hidden border-y border-border bg-background py-14">
      <BannerHeading title="Get Featured On" className="mb-8" />
      <div className="relative">
        <div className="flex w-max animate-marquee gap-4 hover:[animation-play-state:paused] motion-reduce:animate-none">
          {loop.map((name, i) => (
            <span
              key={i}
              className="whitespace-nowrap rounded-xl border border-border bg-surface px-6 py-3 font-semibold text-muted"
            >
              {name}
            </span>
          ))}
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-linear-to-r from-background to-transparent" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-linear-to-l from-background to-transparent" />
      </div>
    </section>
  );
};

export default FeaturedOn;