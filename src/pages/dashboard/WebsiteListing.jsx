import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Globe,
  Plus,
  Search,
  ExternalLink,
  ShieldCheck,
  Clock,
  AlertCircle,
  XCircle,
  Loader2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Filter,
  DollarSign,
  Calendar,
} from "lucide-react";
import { getSellerWebsites } from "../../services/websiteService";
import { useToast } from "../../hooks/useToast";

const categories = [
  "All",
  "Technology",
  "Business & Finance",
  "Health & Wellness",
  "SEO & Marketing",
  "Travel & Tourism",
  "Education",
  "Lifestyle",
  "Real Estate",
  "Food & Beverage",
  "News & Media",
  "Crypto & Web3",
];

const statuses = [
  { value: "ALL", label: "All Statuses" },
  { value: "ACTIVE", label: "Active" },
  { value: "PENDING_VERIFICATION", label: "Pending Verification" },
  { value: "REJECTED", label: "Rejected" },
  { value: "SUSPENDED", label: "Suspended" },
];

const WebsiteListing = () => {
  const toast = useToast();
  const [websites, setWebsites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters & Pagination State
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("ALL");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 1,
    currentPage: 1,
  });

  const fetchListings = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const queryParams = {
        page,
        limit,
        ...(search.trim() ? { search: search.trim() } : {}),
        ...(category !== "All" ? { category } : {}),
        ...(status !== "ALL" ? { status } : {}),
      };

      const res = await getSellerWebsites(queryParams);

      // Support varied data shapes: res.data.websites, res.data.docs, res.data (array), or res.data.data
      const resultData = res?.data || {};
      const list = Array.isArray(resultData)
        ? resultData
        : Array.isArray(resultData.websites)
        ? resultData.websites
        : Array.isArray(resultData.docs)
        ? resultData.docs
        : Array.isArray(resultData.data)
        ? resultData.data
        : [];

      setWebsites(list);
      setPagination({
        total: resultData.total || resultData.count || list.length,
        totalPages: resultData.totalPages || Math.ceil((resultData.total || list.length) / limit) || 1,
        currentPage: page,
      });
    } catch (err) {
      const message = err.message || "Failed to load website listings.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, category, status, toast]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  // Handle Search Input Submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchListings();
  };

  const getStatusBadge = (siteStatus, isVerified) => {
    const norm = siteStatus ? siteStatus.toUpperCase() : "PENDING_VERIFICATION";

    if (norm === "ACTIVE" || isVerified) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-xs font-semibold text-emerald-600">
          <ShieldCheck className="h-3 w-3" />
          Active
        </span>
      );
    }

    if (norm === "PENDING_VERIFICATION") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-accent-yellow/15 border border-accent-yellow/30 px-2.5 py-0.5 text-xs font-semibold text-fg">
          <Clock className="h-3 w-3 text-accent-yellow" />
          Pending Verification
        </span>
      );
    }

    if (norm === "REJECTED") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-accent-red/10 border border-accent-red/20 px-2.5 py-0.5 text-xs font-semibold text-accent-red">
          <XCircle className="h-3 w-3" />
          Rejected
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-cream border border-border px-2.5 py-0.5 text-xs font-semibold text-muted">
        <AlertCircle className="h-3 w-3" />
        {norm}
      </span>
    );
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 animate-fade-in pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-2">
            <Globe className="h-3.5 w-3.5" />
            Inventory Management
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-fg tracking-tight">
            My Websites
          </h1>
          <p className="text-sm text-muted mt-1">
            Track and manage your listed domains, live metrics, and review statuses.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchListings}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3.5 py-2.5 text-xs font-semibold text-fg hover:bg-cream transition-colors disabled:opacity-50"
            title="Refresh listings"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-primary" : "text-muted"}`} />
            <span>Refresh</span>
          </button>

          <Link
            to="/publisher-dashboard/websites/new"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-primary-light transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Website</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-border bg-surface p-4 sm:p-5 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
          {/* Search by Domain */}
          <form onSubmit={handleSearchSubmit} className="relative md:col-span-2">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              placeholder="Search by domain (e.g. react.dev)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-full rounded-xl border border-border bg-cream/30 pl-10 pr-4 text-xs sm:text-sm text-fg outline-none transition focus:border-primary focus:bg-surface focus:ring-1 focus:ring-primary"
            />
          </form>

          {/* Category Dropdown */}
          <div>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
              className="h-10 w-full rounded-xl border border-border bg-surface px-3 text-xs sm:text-sm font-medium text-fg outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
              aria-label="Filter by category"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "All" ? "All Categories" : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Status Dropdown */}
          <div>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="h-10 w-full rounded-xl border border-border bg-surface px-3 text-xs sm:text-sm font-medium text-fg outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
              aria-label="Filter by status"
            >
              {statuses.map((st) => (
                <option key={st.value} value={st.value}>
                  {st.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Websites Listing Table / Cards */}
      <div className="rounded-2xl border border-border bg-surface shadow-xs overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
            <p className="text-sm font-semibold text-fg">Loading website listings...</p>
            <p className="text-xs text-muted mt-1">Retrieving verified metrics from backend</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-4">
            <AlertCircle className="h-8 w-8 text-accent-red mb-3" />
            <p className="text-sm font-semibold text-fg">Failed to load websites</p>
            <p className="text-xs text-muted mt-1 max-w-sm">{error}</p>
            <button
              onClick={fetchListings}
              className="mt-4 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary-light"
            >
              Try Again
            </button>
          </div>
        ) : websites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-cream text-muted mb-3">
              <Globe className="h-7 w-7" />
            </div>
            <h3 className="text-base font-bold text-fg">No websites registered yet</h3>
            <p className="text-xs sm:text-sm text-muted mt-1 max-w-md">
              You haven&apos;t added any websites to your inventory. Add your domain to start receiving guest posting orders.
            </p>
            <Link
              to="/publisher-dashboard/websites/new"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-primary-light"
            >
              <Plus className="h-4 w-4" />
              <span>Add Your First Website</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-cream/40 text-[11px] font-bold uppercase tracking-wider text-muted">
                  <th className="py-3.5 px-4 sm:px-6">Domain & Info</th>
                  <th className="py-3.5 px-4">Metrics (DA/DR/AS)</th>
                  <th className="py-3.5 px-4">Monthly Traffic</th>
                  <th className="py-3.5 px-4">Pricing</th>
                  <th className="py-3.5 px-4">Turnaround</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Added On</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-xs sm:text-sm">
                {websites.map((site) => {
                  const createdAt = site.createdAt
                    ? new Date(site.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "—";

                  return (
                    <tr
                      key={site._id || site.id || site.domain}
                      className="hover:bg-cream/30 transition-colors group"
                    >
                      {/* Domain & Category */}
                      <td className="py-4 px-4 sm:px-6">
                        <div className="flex items-start gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-sm">
                            {site.domain ? site.domain.charAt(0).toUpperCase() : "W"}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-fg group-hover:text-primary transition-colors">
                                {site.domain}
                              </span>
                              <a
                                href={`https://${site.domain}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted hover:text-fg p-0.5"
                                title={`Visit ${site.domain}`}
                              >
                                <ExternalLink className="h-3.5 w-3.5" />
                              </a>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                              <span className="rounded-md bg-cream px-2 py-0.5 text-[10px] font-semibold text-muted">
                                {site.category || "General"}
                              </span>
                              <span className="text-[11px] text-muted">
                                {site.country} ({site.language || "English"})
                              </span>
                              <span className="text-[10px] text-primary font-medium">
                                {site.linkType || "DoFollow"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Authority Metrics */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5 font-mono text-xs">
                          <span
                            className="rounded bg-cream px-1.5 py-0.5 text-fg font-semibold"
                            title="Moz Domain Authority"
                          >
                            DA {site.mozDA !== null && site.mozDA !== undefined ? site.mozDA : "—"}
                          </span>
                          <span
                            className="rounded bg-primary/10 px-1.5 py-0.5 text-primary font-semibold"
                            title="Ahrefs Domain Rating"
                          >
                            DR {site.ahrefsDR !== null && site.ahrefsDR !== undefined ? site.ahrefsDR : "—"}
                          </span>
                          <span
                            className="rounded bg-accent-yellow/20 px-1.5 py-0.5 text-fg font-semibold"
                            title="Semrush Authority Score"
                          >
                            AS {site.semrushAS !== null && site.semrushAS !== undefined ? site.semrushAS : "—"}
                          </span>
                        </div>
                      </td>

                      {/* Monthly Traffic */}
                      <td className="py-4 px-4">
                        <span className="font-semibold text-fg">
                          {site.monthlyTraffic || "—"}
                        </span>
                        {site.domainAge && (
                          <p className="text-[10px] text-muted mt-0.5">
                            Age: {site.domainAge}
                          </p>
                        )}
                      </td>

                      {/* Pricing */}
                      <td className="py-4 px-4">
                        <div className="font-bold text-fg">
                          ${Number(site.price || 0).toFixed(2)}
                        </div>
                        {Number(site.contentWritingPrice) > 0 && (
                          <p className="text-[10px] text-muted">
                            +${Number(site.contentWritingPrice).toFixed(2)} writing
                          </p>
                        )}
                      </td>

                      {/* Turnaround & Links */}
                      <td className="py-4 px-4">
                        <span className="font-medium text-fg">
                          {site.turnaroundDays || 3} Days
                        </span>
                        <p className="text-[10px] text-muted mt-0.5">
                          Max {site.maxLinksAllowed || 2} links
                        </p>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        {getStatusBadge(site.status, site.isVerified)}
                        {site.adminReviewNotes && (
                          <p className="text-[10px] text-accent-red mt-1 max-w-[140px] truncate" title={site.adminReviewNotes}>
                            Note: {site.adminReviewNotes}
                          </p>
                        )}
                      </td>

                      {/* Added Date */}
                      <td className="py-4 px-4 text-right text-muted text-xs">
                        {createdAt}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {!loading && websites.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between border-t border-border px-4 sm:px-6 py-3.5 gap-3 bg-cream/20">
            <p className="text-xs text-muted">
              Showing page <span className="font-semibold text-fg">{pagination.currentPage}</span> of{" "}
              <span className="font-semibold text-fg">{pagination.totalPages}</span> ({pagination.total} listings)
            </p>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={page <= 1}
                className="inline-flex items-center gap-1 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-fg hover:bg-cream transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous</span>
              </button>

              <button
                onClick={() => setPage((prev) => Math.min(pagination.totalPages, prev + 1))}
                disabled={page >= pagination.totalPages}
                className="inline-flex items-center gap-1 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-fg hover:bg-cream transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WebsiteListing;

