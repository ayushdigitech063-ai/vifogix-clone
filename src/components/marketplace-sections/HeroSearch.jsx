// src/components/marketplace-sections/HeroSearch.jsx
import { useState } from "react";
import { Search, Link2, TrendingUp, FileText } from "lucide-react";
import BannerHeading from "../sheared/BannerHeading";

const categories = [
  "Guest Post Packages",
  "Press Release",
  "SEO",
  "Writing",
  "Google My Business",
];

const gridMask = "radial-gradient(ellipse at center, black 30%, transparent 75%)";

const HeroBackground = () => (
  <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
    {/* Faint grid, fading out toward the edges */}
    <div
      className="absolute inset-0 opacity-70"
      style={{
        backgroundImage:
          "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
        maskImage: gridMask,
        WebkitMaskImage: gridMask,
      }}
    />

    {/* Drifting colour blobs */}
    <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-primary-light/25 blur-3xl animate-blob motion-reduce:animate-none" />
    <div className="absolute -right-24 top-0 h-80 w-80 rounded-full bg-accent-yellow/25 blur-3xl animate-blob [animation-delay:3s] motion-reduce:animate-none" />
    <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-primary/15 blur-3xl animate-blob [animation-delay:6s] motion-reduce:animate-none" />

    {/* Floating chips (desktop only) */}
    <div className="absolute left-[8%] top-[28%] hidden items-center gap-2 rounded-full border border-border bg-surface/80 px-3 py-1.5 text-xs font-semibold text-primary shadow-sm backdrop-blur animate-float motion-reduce:animate-none lg:flex">
      <TrendingUp className="h-3.5 w-3.5" /> DR 70+
    </div>
    <div className="absolute right-[9%] top-[22%] hidden items-center gap-2 rounded-full border border-border bg-surface/80 px-3 py-1.5 text-xs font-semibold text-primary shadow-sm backdrop-blur animate-float [animation-delay:1.5s] motion-reduce:animate-none lg:flex">
      <Link2 className="h-3.5 w-3.5" /> Dofollow Link
    </div>
    <div className="absolute bottom-[18%] left-[14%] hidden items-center gap-2 rounded-full border border-border bg-surface/80 px-3 py-1.5 text-xs font-semibold text-primary shadow-sm backdrop-blur animate-float [animation-delay:3s] motion-reduce:animate-none lg:flex">
      <FileText className="h-3.5 w-3.5" /> Guest Post
    </div>
    <div className="absolute bottom-[24%] right-[13%] hidden items-center gap-2 rounded-full border border-border bg-surface/80 px-3 py-1.5 text-xs font-semibold text-primary shadow-sm backdrop-blur animate-float [animation-delay:4.5s] motion-reduce:animate-none lg:flex">
      <TrendingUp className="h-3.5 w-3.5" /> 50K+ Traffic
    </div>
  </div>
);

const HeroSearch = () => {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(categories[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ query, activeCategory });
  };

  return (
    <section className="relative overflow-hidden border-b border-border bg-surface">
      <HeroBackground />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-14 text-center md:py-20">
        <BannerHeading
          as="h1"
          title="AI-Powered Link Building and"
          highlight="Guest Post Marketplace"
          description="Distribute on 70k+ Websites Across the Globe!"
        />

        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-8 flex max-w-2xl items-center gap-2 rounded-xl border border-border bg-surface p-2 shadow-sm focus-within:border-primary-light"
        >
          <Search className="ml-2 h-5 w-5 shrink-0 text-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="AI Search: try 'tech blogs with DR 50+'"
            className="w-full bg-transparent px-2 py-2 text-fg outline-none placeholder:text-muted"
            aria-label="Search marketplace"
          />
          <button
            type="submit"
            className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary-light"
          >
            Search
          </button>
        </form>

        <div
          className="mt-8 flex flex-wrap justify-center gap-3"
          role="tablist"
          aria-label="Marketplace categories"
        >
          {/* {categories.map((cat) => {
            const isActive = cat === activeCategory;
            return (
              <button
                key={cat}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "border-primary bg-primary text-white"
                    : "border-border bg-surface/80 text-muted hover:border-primary-light hover:text-primary"
                }`}
              >
                {cat}
              </button>
            );
          })} */}
        </div>
      </div>
    </section>
  );
};

export default HeroSearch;
