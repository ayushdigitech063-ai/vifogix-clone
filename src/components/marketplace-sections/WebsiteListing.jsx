// src/components/marketplace-sections/WebsiteListing.jsx
import { useRef, useState } from "react";
import { websites } from "../../data/websites";
import { useWebsiteFilters } from "../../hooks/useWebsiteFilters";
import SectionHeading from "../sheared/SectionHeading";
import CategoryChips from "./CategoryChips";
import ResultsToolbar from "./ResultsToolbar";
import WebsiteCard from "./WebsiteCard";
import FilterModal from "./FilterModal";
import Pagination from "./Pagination";

const PAGE_SIZE = 8; // use 3 while you only have a few rows, so pagination is visible

const WebsiteListing = () => {
  const sectionRef = useRef(null);
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const { filters, categories, results, activeCount, updateFilters, clearFilters } =
    useWebsiteFilters(websites);

  // any filter change sends the user back to page 1
  const handleChange = (patch) => {
    updateFilters(patch);
    setPage(1);
  };

  const handleClear = () => {
    clearFilters();
    setPage(1);
  };

  const handlePageChange = (nextPage) => {
    setPage(nextPage);
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const totalPages = Math.ceil(results.length / PAGE_SIZE);
  const start = (page - 1) * PAGE_SIZE;
  const visible = results.slice(start, start + PAGE_SIZE);

  return (
    <section ref={sectionRef} className="scroll-mt-20 bg-background pb-16">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading
          eyebrow="Websites"
          title="Boost Your SEO with Trusted Guest Posts"
          description="High-quality guest posts and backlinks, no matter the package you choose"
        />

        <CategoryChips
          categories={categories}
          active={filters.category}
          onSelect={(category) => handleChange({ category })}
          activeCount={activeCount}
          onOpenFilters={() => setFiltersOpen(true)}
        />

        <ResultsToolbar
          count={results.length}
          sort={filters.sort}
          onSortChange={(sort) => handleChange({ sort })}
        />

        {visible.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visible.map((site) => (
              <WebsiteCard key={site.id} site={site} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-surface py-16 text-center">
            <p className="font-semibold text-fg">No websites match your filters</p>
            <button onClick={handleClear} className="mt-3 text-sm font-semibold text-primary hover:underline">
              Clear filters
            </button>
          </div>
        )}

        <Pagination page={page} totalPages={totalPages} onChange={handlePageChange} />
      </div>

      {filtersOpen && (
        <FilterModal
          websites={websites}
          filters={filters}
          onApply={handleChange}
          onClose={() => setFiltersOpen(false)}
        />
      )}
    </section>
  );
};

export default WebsiteListing;