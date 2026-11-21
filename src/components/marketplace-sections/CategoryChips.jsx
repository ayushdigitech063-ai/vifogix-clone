
import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CategoryChips = ({ categories, active, onSelect, activeCount, onOpenFilters }) => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 2);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 2);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [categories]);

  const scroll = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const distance = direction === "left" ? -240 : 240;
    el.scrollBy({ left: distance, behavior: "smooth" });
  };

  return (
    <div className="flex items-center gap-3">
      {/* Slider container with left/right buttons */}
      <div className="relative flex flex-1 items-center min-w-0">
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => scroll("left")}
            aria-label="Scroll left"
            className="absolute left-0 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-white/95 text-fg shadow-sm backdrop-blur-xs transition hover:bg-gray-50 hover:text-primary"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}

        <div
          ref={scrollRef}
          role="tablist"
          aria-label="Website categories"
          className="flex flex-1 gap-2 overflow-x-auto scroll-smooth py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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

        {canScrollRight && (
          <button
            type="button"
            onClick={() => scroll("right")}
            aria-label="Scroll right"
            className="absolute right-0 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-white/95 text-fg shadow-sm backdrop-blur-xs transition hover:bg-gray-50 hover:text-primary"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>

      <button
        onClick={onOpenFilters}
        className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-fg hover:border-primary-light hover:text-primary"
      >
        {/* <SlidersHorizontal className="h-4 w-4" /> */}
        Filters
        {activeCount > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs text-white">
            {activeCount}
          </span>
        )}
      </button>
    </div>
  );
};

export default CategoryChips;
