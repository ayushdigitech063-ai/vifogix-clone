import { useState, useMemo } from "react";
import { FileText } from "lucide-react";
import BlogFilters from "./BlogFilters";
import BlogCard from "./BlogCard";
import Sidebar from "./Sidebar";

const SORTS = {
  newest: (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  oldest: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  "a-z": (a, b) => a.title.localeCompare(b.title),
};

const ITEMS_PER_PAGE = 6;

const BlogListing = ({
  posts = [],
  categories = [],
  popularTags = [],
  newsletter,
  searchQuery,
  onSearchChange,
  activeCategory,
  onCategoryChange,
}) => {
  const [sort, setSort] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter & Sort
  const filteredPosts = useMemo(() => {
    let result = [...posts];

    // Category filter
    if (activeCategory && activeCategory !== "All") {
      result = result.filter(
        (p) => p.category.toLowerCase() === activeCategory.toLowerCase()
      );
    }

    // Search query filter (title and excerpt, case-insensitive)
    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    // Sort
    if (SORTS[sort]) {
      result.sort(SORTS[sort]);
    }

    return result;
  }, [posts, activeCategory, searchQuery, sort]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / ITEMS_PER_PAGE));
  const validPage = Math.min(currentPage, totalPages);
  const startIndex = (validPage - 1) * ITEMS_PER_PAGE;
  const paginatedPosts = filteredPosts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handleCategorySelect = (cat) => {
    onCategoryChange(cat);
    setCurrentPage(1);
  };

  const handleSortChange = (newSort) => {
    setSort(newSort);
    setCurrentPage(1);
  };

  const handleTagClick = (tag) => {
    onSearchChange(tag);
    setCurrentPage(1);
  };

  return (
    <section className="bg-cream/40 py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4">
        {/* Category pills and sort dropdown */}
        <BlogFilters
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={handleCategorySelect}
          sort={sort}
          onSortChange={handleSortChange}
        />

        {/* Results counter */}
        <div className="mb-6 flex items-center justify-between text-xs text-gray-500">
          <p>
            Showing{" "}
            <span className="font-semibold text-fg">
              {filteredPosts.length === 0 ? 0 : startIndex + 1}–
              {Math.min(startIndex + ITEMS_PER_PAGE, filteredPosts.length)}
            </span>{" "}
            of <span className="font-semibold text-fg">{filteredPosts.length}</span>{" "}
            articles found
          </p>

          {(searchQuery || (activeCategory && activeCategory !== "All")) && (
            <button
              type="button"
              onClick={() => {
                onSearchChange("");
                onCategoryChange("All");
                setCurrentPage(1);
              }}
              className="font-medium text-primary hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Content Layout with Grid + Sidebar */}
        <div className="flex flex-col gap-10 lg:flex-row">
          {/* Main Articles Grid Area */}
          <div className="flex-1">
            {filteredPosts.length === 0 ? (
              <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-white p-8 text-center">
                <FileText className="h-12 w-12 text-gray-400" aria-hidden="true" />
                <h3 className="mt-4 text-base font-bold text-fg">
                  No articles found
                </h3>
                <p className="mt-1 max-w-sm text-sm text-gray-500">
                  No articles match your search. Try a different keyword or browse our main categories.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onSearchChange("");
                    onCategoryChange("All");
                    setCurrentPage(1);
                  }}
                  className="mt-4 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white transition hover:opacity-90"
                >
                  Reset all filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                  {paginatedPosts.map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>

                {/* Pagination (matching Press Release package pagination style) */}
                {totalPages > 1 && (
                  <nav
                    aria-label="Pagination"
                    className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6 text-sm text-gray-500"
                  >
                    <p>
                      Page {validPage} of {totalPages}
                    </p>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={validPage === 1}
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        className="rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-semibold text-fg transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Previous
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (num) => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => setCurrentPage(num)}
                            aria-current={num === validPage ? "page" : undefined}
                            className={`h-8 w-8 rounded-lg border text-xs font-medium transition ${
                              num === validPage
                                ? "border-primary bg-primary text-white"
                                : "border-border bg-white text-gray-600 hover:bg-gray-50"
                            }`}
                          >
                            {num}
                          </button>
                        )
                      )}

                      <button
                        type="button"
                        disabled={validPage === totalPages}
                        onClick={() =>
                          setCurrentPage((p) => Math.min(totalPages, p + 1))
                        }
                        className="rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-semibold text-fg transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Next
                      </button>
                    </div>
                  </nav>
                )}
              </>
            )}
          </div>

          {/* Sidebar */}
          <Sidebar
            tags={popularTags}
            onTagClick={handleTagClick}
            newsletter={newsletter}
          />
        </div>
      </div>
    </section>
  );
};

export default BlogListing;

