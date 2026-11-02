const BlogFilters = ({
  categories = [],
  activeCategory = "All",
  onSelectCategory,
  sort = "newest",
  onSortChange,
}) => {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Category Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((cat) => {
          const isActive = cat === activeCategory;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => onSelectCategory(cat)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                isActive
                  ? "border-primary bg-primary text-white"
                  : "border-border bg-white text-gray-600 hover:border-primary hover:text-primary"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Sort Select */}
      <div className="flex items-center gap-2 self-end sm:self-auto">
        <label htmlFor="blog-sort" className="text-xs font-medium text-gray-500 whitespace-nowrap">
          Sort by:
        </label>
        <select
          id="blog-sort"
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-semibold text-fg outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="a-z">Title A–Z</option>
        </select>
      </div>
    </div>
  );
};

export default BlogFilters;
