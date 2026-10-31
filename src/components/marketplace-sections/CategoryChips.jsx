
import { SlidersHorizontal } from "lucide-react";

const CategoryChips = ({ categories, active, onSelect, activeCount, onOpenFilters }) => (
  <div className="flex items-center gap-3">
    <div
      role="tablist"
      aria-label="Website categories"
      className="flex flex-1 gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {categories.map((cat) => {
        const isActive = cat === active;
        return (
          <button
            key={cat}
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect(cat)}
            className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
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

    <button
      onClick={onOpenFilters}
      className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-fg hover:border-primary-light hover:text-primary"
    >
      <SlidersHorizontal className="h-4 w-4" />
      Filters
      {activeCount > 0 && (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs text-white">
          {activeCount}
        </span>
      )}
    </button>
  </div>
);

export default CategoryChips;