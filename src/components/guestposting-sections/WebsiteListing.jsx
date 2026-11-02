import { useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import SectionHeading from "../sheared/SectionHeading";
import WebsiteCard from "./WebsiteCard";

const SORTS = {
  "best-selling": { label: "Best selling", fn: () => 0 },
  "price-low": { label: "Price: low to high", fn: (a, b) => a.price - b.price },
  "price-high": { label: "Price: high to low", fn: (a, b) => b.price - a.price },
  "dr-high": { label: "Highest DR", fn: (a, b) => b.dr - a.dr },
};

const WebsiteListing = ({ data, websites, onFiltersClick }) => {
  const [active, setActive] = useState("All");
  const [sort, setSort] = useState("best-selling");

  const categories = useMemo(
    () => ["All", ...new Set(websites.flatMap((w) => w.categories))],
    [websites]
  );

  const visible = useMemo(() => {
    const list = active === "All" ? websites : websites.filter((w) => w.categories.includes(active));
    return [...list].sort(SORTS[sort].fn);
  }, [websites, active, sort]);

  return (
    <section id="websites" className="bg-white py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading eyebrow={data.eyebrow} title={data.title} description={data.description} />

        <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  active === cat
                    ? "border-primary bg-primary text-white"
                    : "border-border bg-white text-gray-600 hover:border-primary hover:text-primary"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button
            onClick={onFiltersClick}
            className="flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-fg hover:bg-gray-50"
          >
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            Filters
          </button>
        </div>

        <div className="mt-6 flex items-center justify-between text-sm text-gray-500">
          <p>
            <strong className="text-fg">{visible.length}</strong> websites found
          </p>
          <label className="flex items-center gap-2">
            Sort by
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-lg border border-border bg-white px-3 py-2 text-fg"
            >
              {Object.entries(SORTS).map(([key, s]) => (
                <option key={key} value={key}>{s.label}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((site) => (
            <WebsiteCard key={site.domain} site={site} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WebsiteListing;
