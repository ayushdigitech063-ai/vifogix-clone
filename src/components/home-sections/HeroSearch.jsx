// src/components/home-sections/HeroSearch.jsx
import { useState } from "react";
import { useToast } from "../../hooks/useToast";
import { Search, Link2, TrendingUp, FileText } from "lucide-react";
import BannerHeading, { Highlight } from "../sheared/BannerHeading";
import DataPartner from "./DataPartner";
import VideoBackground from "./VideoBackground";
import StatsBar from "./StatsBar";

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

const HeroSearch = ({ variant = "light" }) => {
  const isVideo = variant === "video";
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const toast = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) {
      toast.info("Please enter a search query (e.g. 'tech blogs with DR 50+').");
      return;
    }
    console.log({ query, activeCategory });
    toast.success(`Searching for: "${query}"`);
  };

  return (
    <section
      className={`relative flex min-h-[580px] items-center overflow-hidden border-b border-border ${
        isVideo ? "bg-navy-900" : "bg-surface"
      }`}
    >
      {isVideo ? <VideoBackground /> : <HeroBackground />}

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-14 md:py-20 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Heading, Search & Data Partners */}
          <div className="text-center lg:col-span-7 lg:text-left">
            <BannerHeading
              as="h1"
              align="left"
              centerOnMobile={true}
              maxWidth="full"
              tone={isVideo ? "dark" : "light"}
              title={
                <>
                  <Highlight>AI-Powered</Highlight> Link Building and Guest Post Marketplace
                </>
              }
              description={
                <>
                  Distribute on{" "}
                  <strong className={`font-semibold ${isVideo ? "text-white" : "text-fg"}`}>
                    128k+
                  </strong>{" "}
                  Websites Across the Globe!
                </>
              }
            />

            <form
              onSubmit={handleSubmit}
              className="mt-8 flex max-w-2xl items-center gap-2 rounded-xl border border-border bg-surface p-2 shadow-sm focus-within:border-primary-light mx-auto lg:mx-0"
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
                className="rounded-lg bg-accent-yellow px-5 py-2 text-sm font-semibold text-navy-900 hover:bg-accent-yellow/90"
              >
                Search
              </button>
            </form>

            <div
              className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start"
              aria-label="Marketplace categories"
            >
              <DataPartner tone={isVideo ? "light" : "dark"} />
            </div>
          </div>

          {/* Right Column: Animated Circle StatsBar */}
          <div className="flex items-center justify-center lg:col-span-5">
            <StatsBar />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSearch;
