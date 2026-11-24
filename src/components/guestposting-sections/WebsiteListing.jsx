import { useMemo, useState, useEffect } from "react";
import { SlidersHorizontal, Loader2 } from "lucide-react";
import SectionHeading from "../sheared/SectionHeading";
import WebsiteCard from "../marketplace-sections/WebsiteCard";
import {
  getMarketplaceWebsites,
  getMainCategories,
  getSubCategoriesByCategory,
} from "../../services/websiteService";
import { getMyWishlistedIds } from "../../services/wishlistService";
import { useAuth } from "../../hooks/useAuth";

const SORTS = {
  "best-selling": {
    label: "Best selling",
    fn: (a, b) => (b.totalDeals || b.deals || 0) - (a.totalDeals || a.deals || 0),
  },
  "price-low": {
    label: "Price: low to high",
    fn: (a, b) => (a.price || 0) - (b.price || 0),
  },
  "price-high": {
    label: "Price: high to low",
    fn: (a, b) => (b.price || 0) - (a.price || 0),
  },
  "dr-high": {
    label: "Highest DR",
    fn: (a, b) => (b.ahrefsDR ?? b.dr ?? 0) - (a.ahrefsDR ?? a.dr ?? 0),
  },
};

const WebsiteListing = ({ data, websites: defaultWebsites, onFiltersClick }) => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeSubCategory, setActiveSubCategory] = useState("All");
  const [sort, setSort] = useState("best-selling");

  // API state for categories and subcategories
  const [categoriesList, setCategoriesList] = useState(["All"]);
  const [subCategoriesList, setSubCategoriesList] = useState([]);
  const [subCategoriesLoading, setSubCategoriesLoading] = useState(false);

  // Websites list and loading
  const { isAuthenticated, user } = useAuth();
  const [apiWebsites, setApiWebsites] = useState([]);
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

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

  // Fetch Main Categories via router.get('/categories', getMainCategories)
  useEffect(() => {
    let mounted = true;
    const fetchCats = async () => {
      try {
        const cats = await getMainCategories();
        if (mounted && Array.isArray(cats) && cats.length > 0) {
          setCategoriesList(["All", ...cats]);
        }
      } catch (err) {
        void err;
      }
    };
    fetchCats();
    return () => {
      mounted = false;
    };
  }, []);

  // Fetch Subcategories via router.get('/subcategories', validate(getSubCategoriesQuerySchema), getSubCategoriesByCategory)
  useEffect(() => {
    let mounted = true;
    if (!activeCategory || activeCategory === "All") {
      return;
    }

    const fetchSubs = async () => {
      setSubCategoriesLoading(true);
      try {
        const subs = await getSubCategoriesByCategory(activeCategory);
        if (mounted) {
          setSubCategoriesList(Array.isArray(subs) && subs.length > 0 ? ["All", ...subs] : []);
        }
      } catch (err) {
        void err;
      } finally {
        if (mounted) setSubCategoriesLoading(false);
      }
    };

    fetchSubs();
    return () => {
      mounted = false;
    };
  }, [activeCategory]);

  // Fetch Marketplace Websites
  useEffect(() => {
    let mounted = true;
    const fetchWebsites = async () => {
      try {
        const params = {
          page: 1,
          limit: 100,
        };
        if (activeCategory && activeCategory !== "All") {
          params.category = activeCategory;
        }
        if (activeSubCategory && activeSubCategory !== "All") {
          params.subCategory = activeSubCategory;
        }

        const res = await getMarketplaceWebsites(params);
        if (!mounted) return;

        const items = res?.data?.websites || res?.websites || [];
        if (items.length > 0) {
          // Condition: only show website that has guest post price
          // (means if there is "contentWritingPrice": "0", 0, null, or undefined/doesn't exist)
          const guestPostSites = items.filter((w) => {
            const cwp = w.contentWritingPrice;
            return (
              cwp === undefined ||
              cwp === null ||
              cwp === "" ||
              cwp === "0" ||
              cwp === 0 ||
              Number(cwp) === 0
            );
          });
          setApiWebsites(guestPostSites.length > 0 ? guestPostSites : items);
        } else {
          setApiWebsites(defaultWebsites || []);
        }
      } catch (err) {
        if (!mounted) return;
        console.error("Guest post listings fetch error:", err);
        setApiWebsites(defaultWebsites || []);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchWebsites();
    return () => {
      mounted = false;
    };
  }, [activeCategory, activeSubCategory, defaultWebsites]);

  const sourceWebsites = useMemo(() => {
    return apiWebsites.length > 0 ? apiWebsites : defaultWebsites || [];
  }, [apiWebsites, defaultWebsites]);

  // Handle category selection
  const handleCategorySelect = (cat) => {
    setActiveCategory(cat);
    setActiveSubCategory("All");
    if (!cat || cat === "All") {
      setSubCategoriesList([]);
    }
  };

  const visible = useMemo(() => {
    let list = sourceWebsites;

    // Filter by subcategory locally if needed
    if (activeSubCategory && activeSubCategory !== "All") {
      list = list.filter((w) => {
        const subs = Array.isArray(w.subCategories) ? w.subCategories : [];
        return subs.includes(activeSubCategory);
      });
    }

    return [...list].sort(SORTS[sort]?.fn || (() => 0));
  }, [sourceWebsites, activeSubCategory, sort]);

  return (
    <section id="websites" className="bg-white py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading
          eyebrow={data.eyebrow}
          title={data.title}
          description={data.description}
        />

        {/* Categories Tabs */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {categoriesList.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategorySelect(cat)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  activeCategory === cat
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

        {/* Subcategories Filter Chips */}
        {subCategoriesList.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2 rounded-xl border border-border/60 bg-cream/30 p-3">
            <span className="text-xs font-semibold text-muted">Subcategories:</span>
            {subCategoriesLoading ? (
              <div className="flex items-center gap-1.5 text-xs text-muted">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                <span>Loading subcategories...</span>
              </div>
            ) : (
              subCategoriesList.map((sub) => (
                <button
                  key={sub}
                  onClick={() => setActiveSubCategory(sub)}
                  className={`rounded-lg px-3 py-1 text-xs font-medium transition ${
                    activeSubCategory === sub
                      ? "bg-primary text-white"
                      : "bg-surface text-fg hover:bg-white hover:text-primary border border-border"
                  }`}
                >
                  {sub}
                </button>
              ))
            )}
          </div>
        )}

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
                <option key={key} value={key}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {loading ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="text-xs font-medium text-muted">
              Loading guest posting websites...
            </span>
          </div>
        ) : visible.length > 0 ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((site) => {
              const websiteSlug = site._slug || site.slug ;
              return (
                <WebsiteCard
                  key={websiteSlug}
                  site={site}
                  isWishlisted={wishlistIds.has(websiteSlug)}
                  onWishlistToggle={handleWishlistToggle}
                />
              );
            })}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-dashed border-border bg-surface py-16 text-center">
            <p className="font-semibold text-fg">No guest posting websites found</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default WebsiteListing;
