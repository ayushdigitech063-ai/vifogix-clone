import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Globe,
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
  User,
  Check,
  X,
  MessageSquare,
  Eye,
} from "lucide-react";
import PageHeader from "../../components/admin/layout/PageHeader";
import { getAdminWebsites, reviewWebsiteStatus } from "../../services/websiteService";
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
  { value: "PENDING_VERIFICATION", label: "Pending Verification" },
  { value: "ACTIVE", label: "Active" },
  { value: "REJECTED", label: "Rejected" },
  { value: "SUSPENDED", label: "Suspended" },
];

const AdminWebsiteListing = () => {
  const toast = useToast();
  const [websites, setWebsites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // websiteId being reviewed
  const [error, setError] = useState("");

  // Filter state
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("ALL");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const [summaryCounts, setSummaryCounts] = useState({
    ALL: 0,
    PENDING_VERIFICATION: 0,
    ACTIVE: 0,
    REJECTED: 0,
    SUSPENDED: 0,
  });

  // Review modal state
  const [reviewModal, setReviewModal] = useState({
    isOpen: false,
    website: null,
    targetStatus: "ACTIVE", // ACTIVE or REJECTED
    notes: "",
    mozDA: "",
    ahrefsDR: "",
    semrushAS: "",
    monthlyTraffic: "",
    domainAge: "",
  });

  const fetchWebsites = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = {
        page,
        limit: pageSize,
        search: search.trim() || undefined,
        category: category !== "All" ? category : undefined,
        status: status !== "ALL" ? status : undefined,
      };

      const res = await getAdminWebsites(params);
      const data = res?.data || {};

      setWebsites(data.websites || []);
      const totalCount = data.pagination?.total ?? data.total ?? 0;
      const totalPagesCount =
        data.pagination?.totalPages ?? data.totalPages ?? Math.max(1, Math.ceil(totalCount / pageSize));

      setPagination({
        total: totalCount,
        totalPages: totalPagesCount,
      });
      if (data.summaryCounts) {
        setSummaryCounts(data.summaryCounts);
      }
    } catch (err) {
      setError(err.message || "Failed to load website listings.");
      toast.error(err.message || "Failed to load website listings.");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, category, status, toast]);

  useEffect(() => {
    let ignore = false;
    const params = {
      page,
      limit: pageSize,
      search: search.trim() || undefined,
      category: category !== "All" ? category : undefined,
      status: status !== "ALL" ? status : undefined,
    };

    getAdminWebsites(params)
      .then((res) => {
        if (!ignore) {
          const data = res?.data || {};
          setWebsites(data.websites || []);
          const totalCount = data.pagination?.total ?? data.total ?? 0;
          const totalPagesCount =
            data.pagination?.totalPages ?? data.totalPages ?? Math.max(1, Math.ceil(totalCount / pageSize));

          setPagination({
            total: totalCount,
            totalPages: totalPagesCount,
          });
          if (data.summaryCounts) {
            setSummaryCounts(data.summaryCounts);
          }
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(err.message || "Failed to load website listings.");
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [page, pageSize, search, category, status]);

  const openReviewModal = (website, targetStatus) => {
    setReviewModal({
      isOpen: true,
      website,
      targetStatus,
      notes: website.adminReviewNotes || "",
      mozDA: website.mozDA ?? "",
      ahrefsDR: website.ahrefsDR ?? "",
      semrushAS: website.semrushAS ?? "",
      monthlyTraffic: website.monthlyTraffic ?? "",
      domainAge: website.domainAge ?? "",
    });
  };

  const closeReviewModal = () => {
    setReviewModal({
      isOpen: false,
      website: null,
      targetStatus: "ACTIVE",
      notes: "",
      mozDA: "",
      ahrefsDR: "",
      semrushAS: "",
      monthlyTraffic: "",
      domainAge: "",
    });
  };

  const handleConfirmReview = async () => {
    if (!reviewModal.website) return;
    const websiteId = reviewModal.website._id;
    setActionLoading(websiteId);

    try {
      const payload = {
        status: reviewModal.targetStatus,
        adminReviewNotes: reviewModal.notes.trim() || undefined,
      };

      if (reviewModal.mozDA !== "") payload.mozDA = Number(reviewModal.mozDA);
      if (reviewModal.ahrefsDR !== "") payload.ahrefsDR = Number(reviewModal.ahrefsDR);
      if (reviewModal.semrushAS !== "") payload.semrushAS = Number(reviewModal.semrushAS);
      if (reviewModal.monthlyTraffic !== "") payload.monthlyTraffic = reviewModal.monthlyTraffic.trim();
      if (reviewModal.domainAge !== "") payload.domainAge = reviewModal.domainAge.trim();

      await reviewWebsiteStatus(websiteId, payload);
      toast.success(
        `Website ${reviewModal.website.domain} has been ${
          reviewModal.targetStatus === "ACTIVE" ? "approved" : "rejected"
        } successfully!`
      );
      closeReviewModal();
      fetchWebsites();
    } catch (err) {
      toast.error(err.message || "Failed to update review status.");
    } finally {
      setActionLoading(null);
    }
  };

  const renderStatusBadge = (s) => {
    switch (s) {
      case "ACTIVE":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
            <ShieldCheck className="h-3.5 w-3.5" />
            Active
          </span>
        );
      case "PENDING_VERIFICATION":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
            <Clock className="h-3.5 w-3.5 animate-pulse" />
            Pending Review
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700">
            <XCircle className="h-3.5 w-3.5" />
            Rejected
          </span>
        );
      case "SUSPENDED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-xs font-semibold text-gray-700">
            <AlertCircle className="h-3.5 w-3.5" />
            Suspended
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-xs font-medium text-gray-600">
            {s || "Unknown"}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Websites Management"
        description="Review publisher domains, verify SEO metrics, approve or reject listings."
        actions={
          <button
            type="button"
            onClick={fetchWebsites}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-3.5 py-2 text-xs font-semibold text-gray-600 shadow-sm transition hover:bg-cream hover:text-fg disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        }
      />

      {/* Metric Summary Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <button
          type="button"
          onClick={() => {
            setStatus("ALL");
            setPage(1);
          }}
          className={`rounded-2xl border p-4 text-left transition ${
            status === "ALL"
              ? "border-primary bg-primary/5 ring-1 ring-primary shadow-xs"
              : "border-border bg-white hover:border-gray-300"
          }`}
        >
          <p className="text-xs font-medium text-gray-500">Total Listings</p>
          <p className="mt-1 text-2xl font-bold text-fg">{summaryCounts.ALL}</p>
        </button>

        <button
          type="button"
          onClick={() => {
            setStatus("PENDING_VERIFICATION");
            setPage(1);
          }}
          className={`rounded-2xl border p-4 text-left transition ${
            status === "PENDING_VERIFICATION"
              ? "border-amber-400 bg-amber-50 ring-1 ring-amber-400 shadow-xs"
              : "border-border bg-white hover:border-gray-300"
          }`}
        >
          <p className="text-xs font-medium text-amber-700">Pending Review</p>
          <p className="mt-1 text-2xl font-bold text-amber-900">
            {summaryCounts.PENDING_VERIFICATION}
          </p>
        </button>

        <button
          type="button"
          onClick={() => {
            setStatus("ACTIVE");
            setPage(1);
          }}
          className={`rounded-2xl border p-4 text-left transition ${
            status === "ACTIVE"
              ? "border-emerald-400 bg-emerald-50 ring-1 ring-emerald-400 shadow-xs"
              : "border-border bg-white hover:border-gray-300"
          }`}
        >
          <p className="text-xs font-medium text-emerald-700">Active (Live)</p>
          <p className="mt-1 text-2xl font-bold text-emerald-900">{summaryCounts.ACTIVE}</p>
        </button>

        <button
          type="button"
          onClick={() => {
            setStatus("REJECTED");
            setPage(1);
          }}
          className={`rounded-2xl border p-4 text-left transition ${
            status === "REJECTED"
              ? "border-rose-400 bg-rose-50 ring-1 ring-rose-400 shadow-xs"
              : "border-border bg-white hover:border-gray-300"
          }`}
        >
          <p className="text-xs font-medium text-rose-700">Rejected</p>
          <p className="mt-1 text-2xl font-bold text-rose-900">{summaryCounts.REJECTED}</p>
        </button>
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by domain (e.g. techcrunch.com)..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-xl border border-border bg-surface py-2 pl-9 pr-3 text-xs text-fg placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Category & Status Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-1.5 text-xs text-gray-500">
            <Filter className="h-3.5 w-3.5" />
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
              className="bg-transparent text-xs font-medium text-fg focus:outline-none"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-1.5 text-xs text-gray-500">
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="bg-transparent text-xs font-medium text-fg focus:outline-none"
            >
              {statuses.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Table Content */}
      <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
        {loading ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-3 text-xs text-gray-500">Loading website listings...</p>
          </div>
        ) : error ? (
          <div className="flex min-h-[250px] flex-col items-center justify-center p-8 text-center text-accent-red">
            <AlertCircle className="h-8 w-8 mb-2" />
            <p className="text-sm font-semibold">{error}</p>
            <button
              type="button"
              onClick={fetchWebsites}
              className="mt-3 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white"
            >
              Try Again
            </button>
          </div>
        ) : websites.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center p-8 text-center">
            <Globe className="h-10 w-10 text-gray-300 mb-2" />
            <h3 className="text-sm font-bold text-fg">No websites found</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm">
              No website records matched your search filters. Try adjusting the category, status, or search term.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-cream/40 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-5 py-3.5">Website Domain</th>
                  <th className="px-4 py-3.5">Seller (Publisher)</th>
                  <th className="px-4 py-3.5">Category & Country</th>
                  <th className="px-4 py-3.5">Metrics (DA/DR/AS)</th>
                  <th className="px-4 py-3.5">Price</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {websites.map((w) => {
                  const seller = w.sellerId;
                  const isPending = w.status === "PENDING_VERIFICATION";
                  const isOperating = actionLoading === w._id;

                  return (
                    <tr key={w._id} className="transition-colors hover:bg-cream/20">
                      {/* Domain */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Globe className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 font-bold text-fg">
                              <Link
                                to={`/admin/websites/${w._id}`}
                                className="hover:text-primary transition hover:underline"
                                title="View website details"
                              >
                                {w.domain}
                              </Link>
                              <a
                                href={`https://${w.domain}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-primary transition"
                                title="Open website in new tab"
                              >
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </div>
                            <span className="text-[11px] text-gray-400">
                              {w.turnaroundDays}d turnaround • {w.linkType || "DoFollow"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Seller Info */}
                      <td className="px-4 py-4">
                        {seller ? (
                          <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cream text-xs font-semibold text-gray-700">
                              <User className="h-3.5 w-3.5" />
                            </div>
                            <div className="min-w-0">
                              <p className="truncate font-medium text-fg text-xs">
                                {seller.name || "Seller"}
                              </p>
                              <p className="truncate text-[11px] text-gray-400">{seller.email}</p>
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400 italic text-[11px]">Unknown Seller</span>
                        )}
                      </td>

                      {/* Category & Country */}
                      <td className="px-4 py-4">
                        <p className="font-medium text-fg">{w.category || "All"}</p>
                        <p className="text-[11px] text-gray-400">{w.country || "—"}</p>
                      </td>

                      {/* SEO Metrics */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <span className="rounded bg-cream px-1.5 py-0.5 font-mono text-[11px] text-gray-700" title="Moz DA">
                            DA: {w.mozDA ?? "—"}
                          </span>
                          <span className="rounded bg-cream px-1.5 py-0.5 font-mono text-[11px] text-gray-700" title="Ahrefs DR">
                            DR: {w.ahrefsDR ?? "—"}
                          </span>
                          <span className="rounded bg-cream px-1.5 py-0.5 font-mono text-[11px] text-gray-700" title="Semrush AS">
                            AS: {w.semrushAS ?? "—"}
                          </span>
                        </div>
                        {w.monthlyTraffic && (
                          <p className="mt-1 text-[11px] text-gray-400">
                            Traffic: {w.monthlyTraffic}
                          </p>
                        )}
                      </td>

                      {/* Price */}
                      <td className="px-4 py-4 font-semibold text-fg">
                        <span className="inline-flex items-center text-sm">
                          ₹{w.price}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4">{renderStatusBadge(w.status)}</td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to={`/admin/websites/${w._id}`}
                            className="inline-flex items-center gap-1 rounded-lg border border-border bg-white px-2.5 py-1 text-xs font-semibold text-gray-600 transition hover:bg-cream hover:text-fg"
                            title="View details"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span>Details</span>
                          </Link>

                          {isOperating ? (
                            <Loader2 className="h-4 w-4 animate-spin text-primary" />
                          ) : (
                            <>
                              {isPending && (
                                <button
                                  type="button"
                                  onClick={() => openReviewModal(w, "ACTIVE")}
                                  className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white shadow-xs transition hover:bg-emerald-700"
                                  title="Approve website"
                                >
                                  <Check className="h-3.5 w-3.5" />
                                  <span>Approve</span>
                                </button>
                              )}

                              {w.status !== "REJECTED" && (
                                <button
                                  type="button"
                                  onClick={() => openReviewModal(w, "REJECTED")}
                                  className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
                                  title="Reject website"
                                >
                                  <X className="h-3.5 w-3.5" />
                                  <span>Reject</span>
                                </button>
                              )}

                              {w.status === "REJECTED" && (
                                <button
                                  type="button"
                                  onClick={() => openReviewModal(w, "ACTIVE")}
                                  className="inline-flex items-center gap-1 rounded-lg border border-border bg-white px-2.5 py-1 text-xs font-semibold text-fg transition hover:bg-cream"
                                >
                                  <span>Re-activate</span>
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {pagination.total > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between border-t border-border bg-cream/20 px-5 py-3 gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs text-gray-500">
                Showing{" "}
                <span className="font-semibold text-fg">
                  {(page - 1) * pageSize + 1}
                </span>
                –
                <span className="font-semibold text-fg">
                  {Math.min(page * pageSize, pagination.total)}
                </span>{" "}
                of <span className="font-semibold text-fg">{pagination.total}</span> websites
              </span>

              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <span>Per page:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPage(1);
                  }}
                  className="rounded-lg border border-border bg-white px-2 py-1 text-xs font-semibold text-fg outline-none focus:border-primary"
                >
                  {[10, 20, 50, 100].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1 || loading}
                className="inline-flex items-center gap-1 rounded-lg border border-border bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-600 transition hover:bg-cream disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Prev</span>
              </button>

              {/* Numbered Page Buttons with Ellipsis */}
              <div className="flex items-center gap-1">
                {(() => {
                  const totalP = pagination.totalPages;
                  let pageList;
                  if (totalP <= 5) {
                    pageList = Array.from({ length: totalP }, (_, i) => i + 1);
                  } else if (page <= 3) {
                    pageList = [1, 2, 3, 4, "...", totalP];
                  } else if (page >= totalP - 2) {
                    pageList = [1, "...", totalP - 3, totalP - 2, totalP - 1, totalP];
                  } else {
                    pageList = [1, "...", page - 1, page, page + 1, "...", totalP];
                  }

                  return pageList.map((p, idx) => {
                    if (p === "...") {
                      return (
                        <span key={`dots-${idx}`} className="px-1 text-xs text-gray-400">
                          …
                        </span>
                      );
                    }
                    const isCurrent = p === page;
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPage(p)}
                        disabled={loading}
                        className={`h-7 w-7 rounded-lg text-xs font-semibold transition ${
                          isCurrent
                            ? "bg-primary text-white shadow-xs"
                            : "border border-border bg-white text-gray-700 hover:bg-cream"
                        }`}
                      >
                        {p}
                      </button>
                    );
                  });
                })()}
              </div>

              <button
                type="button"
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={page >= pagination.totalPages || loading}
                className="inline-flex items-center gap-1 rounded-lg border border-border bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-600 transition hover:bg-cream disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Next page"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Review & Metric Update Modal */}
      {reviewModal.isOpen && reviewModal.website && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-fg flex items-center gap-2">
                  {reviewModal.targetStatus === "ACTIVE" ? (
                    <span className="text-emerald-700">Approve Listing</span>
                  ) : (
                    <span className="text-rose-700">Reject Listing</span>
                  )}
                  <span className="font-mono text-xs text-gray-500">
                    ({reviewModal.website.domain})
                  </span>
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Confirm the review decision and adjust verified SEO metrics if needed.
                </p>
              </div>
              <button
                type="button"
                onClick={closeReviewModal}
                className="rounded-lg p-1 text-gray-400 hover:bg-cream hover:text-fg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Optional verified SEO metrics for Approval */}
              {reviewModal.targetStatus === "ACTIVE" && (
                <div className="rounded-xl border border-border bg-cream/40 p-3.5 space-y-3">
                  <p className="text-xs font-semibold text-fg">Verified SEO Metrics (Optional Overrides):</p>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[10px] font-semibold text-gray-500 mb-1">Moz DA</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={reviewModal.mozDA}
                        onChange={(e) => setReviewModal({ ...reviewModal, mozDA: e.target.value })}
                        className="w-full rounded-lg border border-border bg-white px-2.5 py-1.5 text-xs text-fg focus:outline-none focus:ring-1 focus:ring-primary"
                        placeholder="0-100"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-gray-500 mb-1">Ahrefs DR</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={reviewModal.ahrefsDR}
                        onChange={(e) => setReviewModal({ ...reviewModal, ahrefsDR: e.target.value })}
                        className="w-full rounded-lg border border-border bg-white px-2.5 py-1.5 text-xs text-fg focus:outline-none focus:ring-1 focus:ring-primary"
                        placeholder="0-100"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-gray-500 mb-1">Semrush AS</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={reviewModal.semrushAS}
                        onChange={(e) => setReviewModal({ ...reviewModal, semrushAS: e.target.value })}
                        className="w-full rounded-lg border border-border bg-white px-2.5 py-1.5 text-xs text-fg focus:outline-none focus:ring-1 focus:ring-primary"
                        placeholder="0-100"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Review Notes */}
              <div>
                <label className="block text-xs font-semibold text-fg mb-1.5 flex items-center gap-1.5">
                  <MessageSquare className="h-3.5 w-3.5 text-gray-400" />
                  <span>Admin Review Notes (Optional / Feedback to seller)</span>
                </label>
                <textarea
                  rows="3"
                  value={reviewModal.notes}
                  onChange={(e) => setReviewModal({ ...reviewModal, notes: e.target.value })}
                  placeholder={
                    reviewModal.targetStatus === "ACTIVE"
                      ? "e.g., Domain verified and metrics confirmed."
                      : "e.g., Domain metrics do not meet criteria or content is inaccessible."
                  }
                  className="w-full rounded-xl border border-border bg-white p-3 text-xs text-fg placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={closeReviewModal}
                  className="rounded-xl border border-border bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-cream"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmReview}
                  disabled={actionLoading === reviewModal.website._id}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold text-white shadow-sm transition ${
                    reviewModal.targetStatus === "ACTIVE"
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : "bg-rose-600 hover:bg-rose-700"
                  } disabled:opacity-50`}
                >
                  {actionLoading === reviewModal.website._id && (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  )}
                  <span>
                    {reviewModal.targetStatus === "ACTIVE" ? "Confirm Approval" : "Confirm Rejection"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminWebsiteListing;
