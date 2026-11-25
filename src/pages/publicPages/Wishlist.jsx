import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Trash2, ArrowRight, ExternalLink, Loader2 } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import { useWishlist } from "../../hooks/useWishlist";
import { getMyWishlist, removeFromWishlist } from "../../services/wishlistService";
import { getWebsiteSlug } from "../../utils/websiteHelpers";

const Wishlist = () => {
  const { isAuthenticated } = useAuth();
  const toast = useToast();
  const { removeItem } = useWishlist();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(Boolean(isAuthenticated));
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    let active = true;
    if (!isAuthenticated) {
      return;
    }

    const loadWishlist = async () => {
      try {
        const res = await getMyWishlist({ page: 1, limit: 50 });
        if (!active) return;
        const websites = res?.data?.websites || [];
        setItems(websites);
      } catch (err) {
        if (!active) return;
        toast.error(err.message || "Failed to load wishlist.");
      } finally {
        if (active) setLoading(false);
      }
    };

    loadWishlist();
    return () => {
      active = false;
    };
  }, [isAuthenticated, toast]);

  const handleRemove = async (websiteId) => {
    setDeletingId(websiteId);
    try {
      if (removeItem) {
        await removeItem(websiteId);
      } else {
        await removeFromWishlist(websiteId);
      }
      setItems((prev) => prev.filter((item) => (item._id || item.id) !== websiteId));
      toast.success("Removed from wishlist.");
    } catch (err) {
      toast.error(err.message || "Failed to remove item.");
    } finally {
      setDeletingId(null);
    }
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
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex min-h-[350px] flex-col items-center justify-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="text-xs font-medium text-muted">Loading your wishlisted websites...</span>
          </div>
        ) : items.length === 0 ? (
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
            {items.map((item) => {
              const websiteId = item._id || item.id;
              const da = item.mozDA ?? item.da ?? "—";
              const dr = item.ahrefsDR ?? item.dr ?? "—";
              const traffic = item.ahrefsTraffic || item.traffic?.ahrefs || item.traffic || item.monthlyTraffic || "—";
              const domain = item.domain || item.name || item.url || "";
              const price = item.price ?? 0;

              return (
                <div
                  key={websiteId}
                  className="group relative flex flex-col justify-between rounded-2xl border border-border bg-white p-5 shadow-sm transition hover:shadow-md"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <span className="rounded-full bg-cream px-2.5 py-0.5 text-xs font-medium text-fg">
                        {item.category || "General"}
                      </span>
                      <button
                        onClick={() => handleRemove(websiteId)}
                        disabled={deletingId === websiteId}
                        className="rounded-lg p-1.5 text-muted transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                        title="Remove from wishlist"
                        aria-label="Remove"
                      >
                        {deletingId === websiteId ? (
                          <Loader2 className="h-4 w-4 animate-spin text-red-600" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>

                    <h3 className="mt-3 text-base font-bold text-fg group-hover:text-primary">
                      {domain}
                    </h3>
                    <a
                      href={`https://${domain}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex items-center gap-1 text-xs text-muted hover:text-primary"
                    >
                      {domain}
                      <ExternalLink className="h-3 w-3" />
                    </a>

                    {/* Metrics */}
                    <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-bg/50 p-3 text-center">
                      <div>
                        <span className="block text-[11px] font-medium text-muted">DA</span>
                        <span className="text-sm font-bold text-fg">{da}</span>
                      </div>
                      <div>
                        <span className="block text-[11px] font-medium text-muted">DR</span>
                        <span className="text-sm font-bold text-fg">{dr}</span>
                      </div>
                      <div>
                        <span className="block text-[11px] font-medium text-muted">Traffic</span>
                        <span className="text-sm font-bold text-fg">{traffic}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 border-t border-border pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="block text-[11px] text-muted">Price</span>
                        <span className="text-lg font-extrabold text-fg">₹{price}</span>
                      </div>
                      <Link
                        to={`/website/${getWebsiteSlug(item)}`}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-primary-light"
                      >
                        <ShoppingBag className="h-3.5 w-3.5" />
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
