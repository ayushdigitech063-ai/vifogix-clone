import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Trash2, ArrowRight, ExternalLink } from "lucide-react";

const INITIAL_WISHLIST = [
  {
    id: "w1",
    name: "TechRadar Insights",
    url: "techradar.com",
    category: "Technology",
    da: 89,
    dr: 87,
    traffic: "450K+",
    price: 320,
    turnaroundTime: "2-3 days",
  },
  {
    id: "w2",
    name: "Business Insider Pulse",
    url: "businessinsider.com",
    category: "Finance & Business",
    da: 92,
    dr: 90,
    traffic: "1.2M+",
    price: 650,
    turnaroundTime: "3-5 days",
  },
  {
    id: "w3",
    name: "HealthLine Trends",
    url: "healthline.com",
    category: "Health & Wellness",
    da: 85,
    dr: 84,
    traffic: "280K+",
    price: 240,
    turnaroundTime: "1-2 days",
  },
];

const Wishlist = () => {
  const [items, setItems] = useState(INITIAL_WISHLIST);

  const removeItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearAll = () => {
    setItems([]);
  };

  return (
    <div className="min-h-[70vh] bg-bg py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Heart className="h-5 w-5 fill-primary text-primary" />
              </span>
              <h1 className="text-2xl font-bold tracking-tight text-fg sm:text-3xl">
                My Wishlist
              </h1>
            </div>
            <p className="mt-1 text-sm text-muted">
              Websites and publications you have saved for future guest posts and link placements.
            </p>
          </div>

          {items.length > 0 && (
            <button
              onClick={clearAll}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-3.5 py-2 text-xs font-semibold text-muted transition hover:border-red-300 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
              Clear Wishlist
            </button>
          )}
        </div>

        {/* Content */}
        {items.length === 0 ? (
          <div className="flex min-h-[380px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-white p-8 text-center shadow-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cream text-muted">
              <Heart className="h-8 w-8 text-muted" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-fg">Your wishlist is empty</h3>
            <p className="mt-1 max-w-md text-xs text-muted">
              Explore our verified marketplace of top-ranking publishers and bookmark websites to collaborate with.
            </p>
            <Link
              to="/marketplace"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-light"
            >
              Browse Marketplace
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-border bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <span className="rounded-full bg-cream px-2.5 py-0.5 text-xs font-medium text-fg">
                      {item.category}
                    </span>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="rounded-lg p-1.5 text-muted transition hover:bg-red-50 hover:text-red-600"
                      title="Remove from wishlist"
                      aria-label="Remove"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <h3 className="mt-3 text-base font-bold text-fg group-hover:text-primary">
                    {item.name}
                  </h3>
                  <a
                    href={`https://${item.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex items-center gap-1 text-xs text-muted hover:text-primary"
                  >
                    {item.url}
                    <ExternalLink className="h-3 w-3" />
                  </a>

                  {/* Metrics */}
                  <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-bg/50 p-3 text-center">
                    <div>
                      <span className="block text-[11px] font-medium text-muted">DA</span>
                      <span className="text-sm font-bold text-fg">{item.da}</span>
                    </div>
                    <div>
                      <span className="block text-[11px] font-medium text-muted">DR</span>
                      <span className="text-sm font-bold text-fg">{item.dr}</span>
                    </div>
                    <div>
                      <span className="block text-[11px] font-medium text-muted">Traffic</span>
                      <span className="text-sm font-bold text-fg">{item.traffic}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 border-t border-border pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="block text-[11px] text-muted">Price</span>
                      <span className="text-lg font-extrabold text-fg">${item.price}</span>
                    </div>
                    <Link
                      to={`/marketplace`}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-primary-light"
                    >
                      <ShoppingBag className="h-3.5 w-3.5" />
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
