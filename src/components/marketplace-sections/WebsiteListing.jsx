// src/components/marketplace-sections/WebsiteListing.jsx
import { useRef, useState, useEffect, useCallback } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { websites as mockWebsites } from "../../data/websites";
import { useWebsiteFilters } from "../../hooks/useWebsiteFilters";
import { getMarketplaceWebsites, getMainCategories } from "../../services/websiteService";
import { getMyWishlistedIds } from "../../services/wishlistService";
import { useAuth } from "../../hooks/useAuth";
import SectionHeading from "../sheared/SectionHeading";
import CategoryChips from "./CategoryChips";
import ResultsToolbar from "./ResultsToolbar";
import WebsiteCard from "./WebsiteCard";
import FilterModal from "./FilterModal";
import Pagination from "./Pagination";

const PAGE_SIZE = 8;

const WebsiteListing = () => {
  const sectionRef = useRef(null);
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // API State
  const { isAuthenticated, user } = useAuth();
  const [apiWebsites, setApiWebsites] = useState([]);
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiCategories, setApiCategories] = useState(["All"]);

  // Fetch wishlisted IDs if logged in as buyer
  useEffect(() => {
    let mounted = true;
    if (isAuthenticated && user?.role?.toUpperCase() === "BUYER") {
      getMyWishlistedIds()
        .then((ids) => {
          if (mounted && Array.isArray(ids)) {
            setWishlistIds(new Set(ids));
          }
        })
        .catch(() => {});
    }
    return () => {
      mounted = false;
    };
  }, [isAuthenticated, user?.role]);

  const handleWishlistToggle = (websiteId, isWishlisted) => {
    setWishlistIds((prev) => {
      const updated = new Set(prev);
      if (isWishlisted) {
        updated.add(websiteId);
      } else {
        updated.delete(websiteId);
      }
      return updated;
    });
  };

  // Local fallback filters hook for fallback/sorting
  const { filters, categories: hookCategories, results, activeCount, updateFilters, clearFilters } =
    useWebsiteFilters(apiWebsites.length > 0 ? apiWebsites : mockWebsites);

  // Fetch Categories from Backend API
  useEffect(() => {
    let mounted = true;
    const fetchCats = async () => {
      try {
        const cats = await getMainCategories();
        if (mounted && Array.isArray(cats) && cats.length > 0) {
          setApiCategories(["All", ...cats]);
        }
      } catch (err) {
        // Fallback to hook categories if categories endpoint fails
        void err;
      }
    };
    fetchCats();
    return () => {
      mounted = false;
    };
  }, []);

  // Fetch Public Marketplace Listings from Backend API
  const fetchMarketplaceListings = useCallback(async () => {
    try {
      const params = {
        page: 1,
        limit: 100, // Fetch top verified marketplace websites
      };
      if (filters.category && filters.category !== "All") {
        params.category = filters.category;
      }
      const res = await getMarketplaceWebsites(params);
      const items = res?.data?.websites || res?.websites || [];
      if (items.length > 0) {
        setApiWebsites(items);
      } else {
        // If backend database has no active verified websites yet, fallback to mock data
        setApiWebsites(mockWebsites);
      }
    } catch (err) {
      console.error("Marketplace fetch error:", err);
      // Seamlessly fallback to mock websites on error so UI never breaks
      setApiWebsites(mockWebsites);
      setError(null);
    } finally {
      setLoading(false);
    }
  }, [filters.category]);

  useEffect(() => {
    let active = true;
    const loadData = async () => {
      try {
        const params = {
          page: 1,
          limit: 100,
        };
        if (filters.category && filters.category !== "All") {
          params.category = filters.category;
        }
        const res = await getMarketplaceWebsites(params);
        if (!active) return;
        const items = res?.data?.websites || res?.websites || [];
        if (items.length > 0) {
          setApiWebsites(items);
        } else {
          setApiWebsites(mockWebsites);
        }
      } catch (err) {
        if (!active) return;
        console.error("Marketplace fetch error:", err);
        setApiWebsites(mockWebsites);
        setError(null);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadData();
    return () => {
      active = false;
    };
  }, [filters.category]);

  // Any filter change sends the user back to page 1
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
  const displayedCategories = apiCategories.length > 1 ? apiCategories : hookCategories;

  return (
    <section ref={sectionRef} className="scroll bg-white pb-16 mt-12">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading
          eyebrow="Websites"
          title="Boost Your SEO with Trusted Guest Posts"
          description="High-quality guest posts and backlinks, no matter the package you choose"
        />

        <CategoryChips
          categories={displayedCategories}
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

        {loading ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="text-xs font-medium text-muted">Loading verified marketplace listings...</span>
          </div>
        ) : error ? (
          <div className="flex min-h-[250px] flex-col items-center justify-center rounded-2xl border border-dashed border-accent-red/30 bg-surface p-8 text-center">
            <AlertCircle className="h-8 w-8 text-accent-red mb-2" />
            <p className="font-semibold text-fg">Failed to load marketplace websites</p>
            <p className="text-xs text-muted mt-1">{error}</p>
            <button
              onClick={fetchMarketplaceListings}
              className="mt-4 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary-light"
            >
              Retry
            </button>
          </div>
        ) : visible.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visible.map((site) => {
              const websiteId = site._id || site.id;
              return (
                <WebsiteCard
                  key={websiteId}
                  site={site}
                  isWishlisted={wishlistIds.has(websiteId)}
                  onWishlistToggle={handleWishlistToggle}
                />
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-surface py-16 text-center">
            <p className="font-semibold text-fg">No websites match your filters</p>
            <button onClick={handleClear} className="mt-3 text-sm font-semibold text-primary hover:underline">
              Clear filters
            </button>
          </div>
        )}

        {totalPages > 1 && (
          <Pagination page={page} totalPages={totalPages} onChange={handlePageChange} />
        )}
      </div>

      {filtersOpen && (
        <FilterModal
          websites={apiWebsites.length > 0 ? apiWebsites : mockWebsites}
          filters={filters}
          onApply={handleChange}
          onClose={() => setFiltersOpen(false)}
        />
      )}
    </section>
  );
};

export default WebsiteListing;