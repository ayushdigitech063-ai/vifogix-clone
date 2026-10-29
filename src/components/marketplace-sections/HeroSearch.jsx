
import { useState } from "react";
import { Search } from "lucide-react";

const categories = [
  "Guest Post Packages",
  "Press Release",
  "SEO",
  "Writing",
  "Google My Business",
];


const HeroSearch = () =>{
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(categories[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // later: call the search service / update URL params
    console.log({ query, activeCategory });
  };

  return (
    <section className="bg-surface border-b border-border">
      <div className="mx-auto max-w-7xl px-4 py-14 text-center md:py-20">
        <h1>
          AI-Powered Link Building and{" "}
          <span className="text-primary">Guest Post Marketplace</span>
        </h1>
        <p className="mt-4 text-lg text-muted">
          Distribute on 70k+ Websites Across the Globe!
        </p>

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
          {categories.map((cat) => {
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
                    : "border-border bg-surface text-muted hover:border-primary-light hover:text-primary"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default HeroSearch;