// src/pages/admin/AdminPressReleaseListing.jsx
import { useState, useEffect, useCallback, useId } from "react";
import {
  Newspaper,
  Search,
  RefreshCw,
  Eye,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Globe,
  Clock,
  ShieldCheck,
  X,
  User,
} from "lucide-react";
import PageHeader from "../../components/admin/layout/PageHeader";
import {
  getAllPressReleasesAdmin,
  getPressReleaseByIdAdmin,
  reviewPressReleaseStatus,
} from "../../services/pressReleaseService";
import { reviewPressReleaseStatusSchema } from "../../schemas/pressRelease.schema";
import { useToast } from "../../hooks/useToast";

const statuses = [
  { value: "ALL", label: "All Statuses" },
  { value: "PENDING_VERIFICATION", label: "Pending Verification" },
  { value: "ACTIVE", label: "Active" },
  { value: "REJECTED", label: "Rejected" },
  { value: "SUSPENDED", label: "Suspended" },
];

const AdminPressReleaseListing = () => {
  const toast = useToast();
  const reviewStatusSelectId = useId();
  const reviewNotesInputId = useId();

  const [pressReleases, setPressReleases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Filters & Pagination
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });

  // Detail Modal State
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedPR, setSelectedPR] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Review Status Modal State
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [targetPR, setTargetPR] = useState(null);
  const [reviewStatus, setReviewStatus] = useState("ACTIVE");
  const [reviewNotes, setReviewNotes] = useState("");
  const [reviewError, setReviewError] = useState("");

  const fetchPRs = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: pageSize,
      };
      if (search.trim()) params.search = search.trim();
      if (statusFilter !== "ALL") params.status = statusFilter;

      const res = await getAllPressReleasesAdmin(params);
      const list =
        res?.data?.pressReleases ||
        res?.data?.data ||
        res?.data ||
        (Array.isArray(res) ? res : []);
      setPressReleases(Array.isArray(list) ? list : []);

      const totalCount =
        res?.data?.pagination?.total ??
        res?.data?.total ??
        (Array.isArray(list) ? list.length : 0);
      const pagesCount =
        res?.data?.pagination?.totalPages ??
        Math.max(1, Math.ceil(totalCount / pageSize));
      setPagination({
        total: totalCount,
        totalPages: pagesCount,
      });
    } catch (err) {
      toast.error(err.message || "Failed to load press releases.");
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter, toast]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        const params = {
          page,
          limit: pageSize,
        };
        if (search.trim()) params.search = search.trim();
        if (statusFilter !== "ALL") params.status = statusFilter;

        const res = await getAllPressReleasesAdmin(params);
        if (!active) return;
        const list =
          res?.data?.pressReleases ||
          res?.data?.data ||
          res?.data ||
          (Array.isArray(res) ? res : []);
        setPressReleases(Array.isArray(list) ? list : []);

        const totalCount =
          res?.data?.pagination?.total ??
          res?.data?.total ??
          (Array.isArray(list) ? list.length : 0);
        const pagesCount =
          res?.data?.pagination?.totalPages ??
          Math.max(1, Math.ceil(totalCount / pageSize));
        setPagination({
          total: totalCount,
          totalPages: pagesCount,
        });
      } catch (err) {
        if (!active) return;
        toast.error(err.message || "Failed to load press releases.");
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [page, search, statusFilter, toast]);

  // Open Full PR Details View
  const handleViewPR = async (pr) => {
    const prId = pr._id || pr.id;
    setSelectedPR(pr);
    setDetailModalOpen(true);

    if (prId) {
      try {
        setDetailLoading(true);
        const res = await getPressReleaseByIdAdmin(prId);
        const fullData = res?.data?.pressRelease || res?.data || pr;
        setSelectedPR(fullData);
      } catch {
        // Fallback to table item
      } finally {
        setDetailLoading(false);
      }
    }
  };

  // Open Review Status Modal
  const handleOpenReviewModal = (pr) => {
    setTargetPR(pr);
    setReviewStatus(pr.status === "PENDING_VERIFICATION" ? "ACTIVE" : pr.status || "ACTIVE");
    setReviewNotes(pr.adminReviewNotes || "");
    setReviewError("");
    setReviewModalOpen(true);
  };

  // Submit Review Status
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError("");
    const prId = targetPR?._id || targetPR?.id;
    if (!prId) return;

    const payload = {
      status: reviewStatus,
      adminReviewNotes: reviewNotes.trim() || undefined,
    };

    
    const validation = reviewPressReleaseStatusSchema.safeParse({
      params: { prId },
      body: payload,
    });
    console.log("status",payload);

    if (!validation.success) {
      const issue = validation.error.issues[0];
      const msg = issue?.message || "Invalid review data.";
      setReviewError(msg);
      toast.error(msg, "Validation Error");
      return;
    }

    try {
      setActionLoading(true);
      await reviewPressReleaseStatus(prId, payload);

      setPressReleases((prev) =>
        prev.map((item) =>
          (item._id || item.id) === prId
            ? { ...item, status: reviewStatus, adminReviewNotes: reviewNotes.trim() }
            : item
        )
      );

      if (selectedPR && (selectedPR._id || selectedPR.id) === prId) {
        setSelectedPR((prev) => ({
          ...prev,
          status: reviewStatus,
          adminReviewNotes: reviewNotes.trim(),
        }));
      }

      toast.success(`Press release status updated to ${reviewStatus}.`, "Status Updated");
      setReviewModalOpen(false);
    } catch (err) {
      toast.error(err.message || "Failed to update review status.");
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (st) => {
    const s = String(st || "PENDING_VERIFICATION").toUpperCase();
    switch (s) {
      case "ACTIVE":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
            <CheckCircle2 className="h-3 w-3" />
            Active
          </span>
        );
      case "PENDING_VERIFICATION":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
            <Clock className="h-3 w-3" />
            Pending Verification
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700">
            <XCircle className="h-3 w-3" />
            Rejected
          </span>
        );
      case "SUSPENDED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-600">
            <AlertCircle className="h-3 w-3" />
            Suspended
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
            {s}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title="Press Release Management"
          description="Review publisher media outlet listings, verify publication requirements and manage status."
        />
        <button
          type="button"
          onClick={fetchPRs}
          disabled={loading}
          className="flex items-center gap-1.5 self-start sm:self-auto rounded-lg border border-border bg-white px-3 py-2 text-xs font-semibold text-fg hover:border-primary hover:text-primary disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col gap-3 rounded-xl border border-border bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by outlet title, domain or publisher..."
            className="w-full rounded-lg border border-border py-2 pl-9 pr-3 text-xs text-fg focus:border-primary focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-500">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-border bg-white px-3 py-2 text-xs font-medium text-fg focus:border-primary focus:outline-hidden"
          >
            {statuses.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Press Releases Table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-xs">
        {loading ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="mt-3 text-xs font-medium text-gray-500">Loading press releases...</span>
          </div>
        ) : pressReleases.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center p-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cream text-primary">
              <Newspaper className="h-6 w-6" />
            </div>
            <h3 className="mt-3 text-base font-bold text-fg">No Press Releases Found</h3>
            <p className="mt-1 max-w-sm text-xs text-gray-500">
              {search || statusFilter !== "ALL"
                ? "No press releases match your filter criteria."
                : "No press releases have been submitted yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-gray-50/75 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-5 py-3">Outlet / Package</th>
                  <th className="px-5 py-3">Seller / Publisher</th>
                  <th className="px-5 py-3">Category</th>
                  <th className="px-5 py-3">Metrics</th>
                  <th className="px-5 py-3">Price</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {pressReleases.map((pr) => {
                  const prId = pr._id || pr.id;
                  const sellerName = pr.sellerId?.name || pr.sellerName || "Publisher";
                  const sellerEmail = pr.sellerId?.email || pr.sellerEmail || "";

                  return (
                    <tr key={prId} className="transition-colors hover:bg-gray-50/60">
                      {/* Outlet / Title */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          {pr.image ? (
                            <img
                              src={pr.image}
                              alt={pr.title}
                              className="h-9 w-9 rounded-lg object-cover border border-border shrink-0"
                            />
                          ) : (
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold">
                              <Newspaper className="h-4 w-4" />
                            </div>
                          )}
                          <div className="min-w-0 max-w-xs">
                            <p className="font-semibold text-fg truncate">{pr.title}</p>
                            {pr.outletDomain && (
                              <p className="text-[11px] text-gray-500 truncate flex items-center gap-1">
                                <Globe className="h-3 w-3 shrink-0" />
                                {pr.outletDomain}
                                {pr.outletsCount > 1 && (
                                  <span className="font-medium text-primary ml-0.5">
                                    (+{pr.outletsCount} outlets)
                                  </span>
                                )}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Seller */}
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <User className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                          <div className="min-w-0">
                            <p className="font-medium text-fg truncate text-[11px]">{sellerName}</p>
                            {sellerEmail && (
                              <p className="text-[10px] text-gray-400 truncate">{sellerEmail}</p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span className="rounded-full bg-cream px-2.5 py-0.5 text-[11px] font-medium text-fg">
                          {pr.category || "General"}
                        </span>
                      </td>

                      {/* Metrics */}
                      <td className="px-5 py-3.5 whitespace-nowrap text-[11px]">
                        <span className="font-semibold text-fg">DA: {pr.mozDA ?? "—"}</span>
                        <span className="text-gray-300 mx-1">|</span>
                        <span className="font-semibold text-fg">DR: {pr.ahrefsDR ?? "—"}</span>
                      </td>

                      {/* Price */}
                      <td className="px-5 py-3.5 whitespace-nowrap font-bold text-fg">
                        ${pr.price ?? 0}
                        {pr.isPrWritingAvailable && (
                          <span className="block text-[10px] font-normal text-gray-400">
                            +${pr.prWritingPrice} Writing
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        {getStatusBadge(pr.status)}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleViewPR(pr)}
                            className="rounded-lg p-1.5 text-gray-500 hover:bg-cream hover:text-primary"
                            title="View PR Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenReviewModal(pr)}
                            className="rounded-lg p-1.5 text-gray-500 hover:bg-amber-50 hover:text-amber-600"
                            title="Review / Change Status"
                          >
                            <ShieldCheck className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {pagination.totalPages > 1 && (
          <div className="flex flex-col items-center justify-between gap-3 border-t border-border px-5 py-3 sm:flex-row">
            <span className="text-xs text-gray-500">
              Showing page <span className="font-semibold text-fg">{page}</span> of{" "}
              <span className="font-semibold text-fg">{pagination.totalPages}</span> ({pagination.total} total)
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1 || loading}
                className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-fg hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                Previous
              </button>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={page >= pagination.totalPages || loading}
                className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-fg hover:bg-gray-50 disabled:opacity-50"
              >
                Next
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Review Status Modal */}
      {reviewModalOpen && targetPR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 sm:p-6 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-md rounded-2xl border border-border bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <h3 className="text-base font-bold text-fg">Review Press Release</h3>
              </div>
              <button
                type="button"
                onClick={() => setReviewModalOpen(false)}
                disabled={actionLoading}
                className="rounded-lg p-1 text-gray-400 hover:text-fg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="mt-4 space-y-4 text-xs">
              <div>
                <p className="text-gray-500">
                  Outlet: <span className="font-bold text-fg">{targetPR.title}</span>
                </p>
                {targetPR.outletDomain && (
                  <p className="text-gray-400 text-[11px] mt-0.5">{targetPR.outletDomain}</p>
                )}
              </div>

              <div>
                <label htmlFor={reviewStatusSelectId} className="block font-bold text-fg">
                  Review Decision *
                </label>
                <select
                  id={reviewStatusSelectId}
                  value={reviewStatus}
                  onChange={(e) => setReviewStatus(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border bg-white px-3 py-2 text-xs font-medium text-fg focus:border-primary focus:outline-hidden"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="REJECTED">REJECTED</option>
                  <option value="SUSPENDED">SUSPENDED</option>
                </select>
              </div>

              <div>
                <label htmlFor={reviewNotesInputId} className="block font-bold text-fg">
                  Review Notes {reviewStatus !== "ACTIVE" && <span className="text-red-500">* (Required)</span>}
                </label>
                <textarea
                  id={reviewNotesInputId}
                  rows={3}
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder={
                    reviewStatus === "ACTIVE"
                      ? "Optional approval remarks..."
                      : "Reason for rejection or suspension (at least 3 characters)..."
                  }
                  className="mt-1 w-full rounded-lg border border-border p-2.5 text-xs text-fg focus:border-primary focus:outline-hidden"
                />
                {reviewError && <p className="mt-1 text-red-500 text-[11px]">{reviewError}</p>}
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-border pt-4">
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(false)}
                  disabled={actionLoading}
                  className="rounded-lg border border-border px-3 py-1.5 font-semibold text-fg hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-1.5 font-semibold text-white shadow-xs hover:bg-primary-light disabled:opacity-50"
                >
                  {actionLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View PR Details Modal */}
      {detailModalOpen && selectedPR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 sm:p-6 backdrop-blur-xs animate-fade-in">
          <div className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-border bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-3">
                {selectedPR.image ? (
                  <img
                    src={selectedPR.image}
                    alt={selectedPR.title}
                    className="h-10 w-10 rounded-lg object-cover border border-border shrink-0"
                  />
                ) : (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold">
                    <Newspaper className="h-5 w-5" />
                  </div>
                )}
                <div>
                  <h3 className="text-base font-bold text-fg">{selectedPR.title}</h3>
                  <p className="text-xs text-gray-500">{selectedPR.outletDomain || "Multi-outlet distribution"}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDetailModalOpen(false)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-fg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {detailLoading ? (
              <div className="flex min-h-[200px] flex-col items-center justify-center p-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span className="mt-2 text-xs text-gray-500">Fetching PR data...</span>
              </div>
            ) : (
              <div className="mt-4 space-y-3.5 text-xs">
                {/* Status & Pricing */}
                <div className="grid grid-cols-2 gap-3 rounded-xl border border-border bg-gray-50/50 p-3">
                  <div>
                    <span className="text-gray-400 font-medium">Publishing Price</span>
                    <p className="font-bold text-fg text-sm mt-0.5">${selectedPR.price ?? 0}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 font-medium">Status</span>
                    <div className="mt-0.5">{getStatusBadge(selectedPR.status)}</div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <span className="font-bold text-gray-400 uppercase tracking-wider text-[11px]">Description</span>
                  <p className="mt-1 text-fg rounded-xl border border-border bg-gray-50/30 p-2.5">
                    {selectedPR.packageDescription}
                  </p>
                </div>

                {/* Specs List */}
                <div className="space-y-1.5 border-t border-border/50 pt-2">
                  <div className="flex justify-between py-1 border-b border-border/30">
                    <span className="text-gray-500">Seller / Publisher</span>
                    <span className="font-semibold text-fg">
                      {selectedPR.sellerId?.name || selectedPR.sellerName || "—"}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/30">
                    <span className="text-gray-500">Category</span>
                    <span className="font-semibold text-fg">{selectedPR.category || "—"}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/30">
                    <span className="text-gray-500">Subcategories</span>
                    <span className="font-semibold text-fg">
                      {Array.isArray(selectedPR.subCategories) ? selectedPR.subCategories.join(", ") : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/30">
                    <span className="text-gray-500">Target Country</span>
                    <span className="font-semibold text-fg">{selectedPR.country || "—"}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/30">
                    <span className="text-gray-500">SEO Metrics</span>
                    <span className="font-semibold text-fg">
                      DA: {selectedPR.mozDA ?? "—"} | DR: {selectedPR.ahrefsDR ?? "—"} | AS: {selectedPR.semrushAS ?? "—"}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/30">
                    <span className="text-gray-500">Turnaround</span>
                    <span className="font-semibold text-fg">
                      {selectedPR.turnaroundDays ? `${selectedPR.turnaroundDays} Days` : "2 Days"}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/30">
                    <span className="text-gray-500">PR Content Writing</span>
                    <span className="font-semibold text-fg">
                      {selectedPR.isPrWritingAvailable ? `Available (+$${selectedPR.prWritingPrice})` : "Not available"}
                    </span>
                  </div>
                  {selectedPR.adminReviewNotes && (
                    <div className="flex justify-between py-1 border-b border-border/30">
                      <span className="text-gray-500">Admin Review Notes</span>
                      <span className="font-semibold text-amber-700">{selectedPR.adminReviewNotes}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                  <button
                    type="button"
                    onClick={() => {
                      setDetailModalOpen(false);
                      handleOpenReviewModal(selectedPR);
                    }}
                    className="rounded-lg border border-border px-3 py-1.5 font-semibold text-fg hover:bg-gray-50"
                  >
                    Change Status
                  </button>
                  <button
                    type="button"
                    onClick={() => setDetailModalOpen(false)}
                    className="rounded-lg bg-primary px-4 py-1.5 font-semibold text-white hover:bg-primary-light"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPressReleaseListing;
