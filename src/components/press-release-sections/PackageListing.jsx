import { useMemo, useState } from "react";
import PackageCard from "./PackageCard";
import PackageFilters from "./PackageFilters";

const SORTS = {
  recommended: { label: "Recommended", fn: () => 0 },
  "price-low": { label: "Price: Low to High", fn: (a, b) => a.price - b.price },
  "price-high": { label: "Price: High to Low", fn: (a, b) => b.price - a.price },
  "a-z": { label: "Reach A–Z", fn: (a, b) => a.title.localeCompare(b.title) },
};
const PER_PAGE = [6, 12, 24, 48];

const PackageListing = ({ packages }) => {
  const maxPrice = useMemo(() => Math.max(...packages.map((p) => p.price)), [packages]);
  const [price, setPrice] = useState(maxPrice);
  const [selected, setSelected] = useState([]);
  const [sort, setSort] = useState("recommended");
  const [perPage, setPerPage] = useState(6);
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const outlets = useMemo(() => {
    const counts = {};
    packages.forEach((p) => p.featured.forEach((o) => (counts[o] = (counts[o] || 0) + 1)));
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [packages]);

  const filtered = useMemo(() => {
    const list = packages.filter(
      (p) => p.price <= price && (selected.length === 0 || p.featured.some((o) => selected.includes(o)))
    );
    return [...list].sort(SORTS[sort].fn);
  }, [packages, price, selected, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const current = Math.min(page, totalPages);
  const start = (current - 1) * perPage;
  const visible = filtered.slice(start, start + perPage);

  const toggleOutlet = (name) => {
    setSelected((prev) => (prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]));
    setPage(1);
  };
  const reset = () => {
    setPrice(maxPrice);
    setSelected([]);
    setPage(1);
  };

  return (
    <section id="packages" className="bg-white py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          {/* Sidebar */}
          <div className={`${showFilters ? "block" : "hidden"} lg:block`}>
            <PackageFilters
              price={price}
              maxPrice={maxPrice}
              onPrice={(v) => { setPrice(v); setPage(1); }}
              outlets={outlets}
              selected={selected}
              onToggle={toggleOutlet}
              onReset={reset}
            />
          </div>

          {/* Results */}
          <div>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 text-sm">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="rounded-full border border-border px-4 py-2 font-medium text-fg lg:hidden"
              >
                Filters
              </button>

              <p className="text-gray-500">
                <strong className="text-fg">{filtered.length}</strong> packages
              </p>

              <div className="flex flex-wrap items-center gap-3 text-gray-500">
                <select
                  value={sort}
                  onChange={(e) => { setSort(e.target.value); setPage(1); }}
                  className="rounded-lg border border-border bg-white px-3 py-2 text-fg"
                >
                  {Object.entries(SORTS).map(([k, s]) => (
                    <option key={k} value={k}>{s.label}</option>
                  ))}
                </select>
                <label className="flex items-center gap-2">
                  <select
                    value={perPage}
                    onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }}
                    className="rounded-lg border border-border bg-white px-3 py-2 text-fg"
                  >
                    {PER_PAGE.map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                  per page
                </label>
              </div>
            </div>

            {visible.length === 0 ? (
              <p className="rounded-2xl border border-border p-10 text-center text-gray-500">
                No packages match your filters.
              </p>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {visible.map((pkg) => (
                  <PackageCard key={pkg.id} pkg={pkg} />
                ))}
              </div>
            )}

            {/* Pagination */}
            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 text-sm text-gray-500">
              <p>
                Showing {filtered.length === 0 ? 0 : start + 1}–{Math.min(start + perPage, filtered.length)} of {filtered.length} packages
              </p>
              <div className="flex items-center gap-1">
                <button
                  disabled={current === 1}
                  onClick={() => setPage(current - 1)}
                  className="rounded-lg border border-border px-3 py-1.5 disabled:opacity-40"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    className={`h-9 w-9 rounded-lg border text-sm font-medium ${
                      n === current
                        ? "border-primary bg-primary text-white"
                        : "border-border text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {n}
                  </button>
                ))}
                <button
                  disabled={current === totalPages}
                  onClick={() => setPage(current + 1)}
                  className="rounded-lg border border-border px-3 py-1.5 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PackageListing;