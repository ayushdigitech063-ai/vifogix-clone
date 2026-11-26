import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Globe,
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
  Clock,
  AlertCircle,
  XCircle,
  Loader2,
  DollarSign,
  User,
  Calendar,
  Check,
  X,
  MessageSquare,
  BarChart2,
  Tag,
  MapPin,
  Link2,
  RefreshCw,
} from "lucide-react";
import PageHeader from "../../components/admin/layout/PageHeader";
import { getAdminWebsiteDetail, reviewWebsiteStatus } from "../../services/websiteService";
import { useToast } from "../../hooks/useToast";

const AdminWebsiteDetail = () => {
  const { websiteId } = useParams();
  const toast = useToast();

  const [website, setWebsite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // Review modal state
  const [reviewModal, setReviewModal] = useState({
    isOpen: false,
    targetStatus: "ACTIVE",
    notes: "",
    mozDA: "",
    ahrefsDR: "",
    semrushAS: "",
    monthlyTraffic: "",
    domainAge: "",
  });

  const fetchDetail = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getAdminWebsiteDetail(websiteId);
      const data = res?.data || res;
      setWebsite(data);
    } catch (err) {
      setError(err.message || "Failed to load website details.");
      toast.error(err.message || "Failed to load website details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    getAdminWebsiteDetail(websiteId)
      .then((res) => {
        if (!ignore) {
          setWebsite(res?.data || res);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(err.message || "Failed to load website details.");
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [websiteId]);

  const openReviewModal = (targetStatus) => {
    if (!website) return;
    setReviewModal({
      isOpen: true,
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
    setActionLoading(true);
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
        `Website ${website.domain} has been ${
          reviewModal.targetStatus === "ACTIVE" ? "approved" : "rejected"
        } successfully!`
      );
      closeReviewModal();
      fetchDetail();
    } catch (err) {
      toast.error(err.message || "Failed to update review status.");
    } finally {
      setActionLoading(false);
    }
  };

  const renderStatusBadge = (s) => {
    switch (s) {
      case "ACTIVE":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            <ShieldCheck className="h-3.5 w-3.5" />
            Active (Verified)
          </span>
        );
      case "PENDING_VERIFICATION":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
            <Clock className="h-3.5 w-3.5 animate-pulse" />
            Pending Verification
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
            <XCircle className="h-3.5 w-3.5" />
            Rejected
          </span>
        );
      case "SUSPENDED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-700">
            <AlertCircle className="h-3.5 w-3.5" />
            Suspended
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600">
            {s || "Unknown"}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center space-y-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-xs text-gray-500">Loading website details...</p>
      </div>
    );
  }

  if (error || !website) {
    return (
      <div className="space-y-6">
        <Link
          to="/admin/websites"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-fg transition"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Websites</span>
        </Link>
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center text-rose-700">
          <AlertCircle className="h-8 w-8 mx-auto mb-2" />
          <h3 className="text-base font-bold">Failed to load website</h3>
          <p className="text-xs mt-1 text-rose-600">{error || "Website listing was not found."}</p>
          <button
            type="button"
            onClick={fetchDetail}
            className="mt-4 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const seller = website.sellerId;
  const isPending = website.status === "PENDING_VERIFICATION";

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <Link
          to="/admin/websites"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-fg transition mb-3"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Websites List</span>
        </Link>
        <PageHeader
          title={website.domain}
          description="Detailed listing specifications, verified metrics, commercial terms and publisher identity."
          actions={
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={fetchDetail}
                className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-white px-3.5 py-2 text-xs font-semibold text-gray-600 shadow-sm transition hover:bg-cream"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Refresh</span>
              </button>

              {isPending && (
                <button
                  type="button"
                  onClick={() => openReviewModal("ACTIVE")}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                >
                  <Check className="h-3.5 w-3.5" />
                  <span>Approve Website</span>
                </button>
              )}

              {website.status !== "REJECTED" && (
                <button
                  type="button"
                  onClick={() => openReviewModal("REJECTED")}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
                >
                  <X className="h-3.5 w-3.5" />
                  <span>Reject</span>
                </button>
              )}

              {website.status === "REJECTED" && (
                <button
                  type="button"
                  onClick={() => openReviewModal("ACTIVE")}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-primary-light"
                >
                  <span>Re-activate Listing</span>
                </button>
              )}
            </div>
          }
        />
      </div>

      {/* Hero Banner Card */}
      <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Globe className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl font-bold text-fg">{website.domain}</h2>
                <a
                  href={`https://${website.domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-primary transition"
                  title="Visit website"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Listing ID: <span className="font-mono">{website._id}</span>
              </p>
            </div>
          </div>

          <div>{renderStatusBadge(website.status)}</div>
        </div>

        {website.adminReviewNotes && (
          <div className="mt-5 rounded-xl border border-border bg-cream/50 p-3.5 text-xs text-gray-700">
            <span className="font-semibold text-fg">Admin Review Notes: </span>
            {website.adminReviewNotes}
          </div>
        )}
      </div>

      {/* Grid: 3 Column Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column (2 Cols): Metrics & Commercial Details */}
        <div className="space-y-6 lg:col-span-2">
          {/* SEO & Performance Metrics */}
          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-sm font-bold text-fg flex items-center gap-2">
                <BarChart2 className="h-4 w-4 text-primary" />
                <span>SEO & Authority Metrics</span>
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="rounded-xl border border-border bg-cream/30 p-3.5">
                <p className="text-[11px] font-semibold text-gray-500">Moz DA</p>
                <p className="text-xl font-bold text-fg mt-1">{website.mozDA ?? "—"}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Domain Authority</p>
              </div>

              <div className="rounded-xl border border-border bg-cream/30 p-3.5">
                <p className="text-[11px] font-semibold text-gray-500">Ahrefs DR</p>
                <p className="text-xl font-bold text-fg mt-1">{website.ahrefsDR ?? "—"}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Domain Rating</p>
              </div>

              <div className="rounded-xl border border-border bg-cream/30 p-3.5">
                <p className="text-[11px] font-semibold text-gray-500">Semrush AS</p>
                <p className="text-xl font-bold text-fg mt-1">{website.semrushAS ?? "—"}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Authority Score</p>
              </div>

              <div className="rounded-xl border border-border bg-cream/30 p-3.5">
                <p className="text-[11px] font-semibold text-gray-500">Monthly Traffic</p>
                <p className="text-base font-bold text-fg mt-1">{website.monthlyTraffic || "—"}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Estimated visitors</p>
              </div>

              <div className="rounded-xl border border-border bg-cream/30 p-3.5">
                <p className="text-[11px] font-semibold text-gray-500">Domain Age</p>
                <p className="text-base font-bold text-fg mt-1">{website.domainAge || "—"}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Historical age</p>
              </div>

              <div className="rounded-xl border border-border bg-cream/30 p-3.5">
                <p className="text-[11px] font-semibold text-gray-500">Link Type</p>
                <p className="text-base font-bold text-fg mt-1">{website.linkType || "DoFollow"}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Attribute</p>
              </div>
            </div>
          </div>

          {/* Pricing & Commercial Specs */}
          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-sm font-bold text-fg flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-primary" />
                <span>Commercial Terms & Pricing</span>
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="rounded-xl border border-border bg-cream/30 p-3.5">
                <p className="text-[11px] font-semibold text-gray-500">Publishing Price</p>
                <p className="text-lg font-bold text-emerald-700 mt-1">₹{website.price}</p>
              </div>

              <div className="rounded-xl border border-border bg-cream/30 p-3.5">
                <p className="text-[11px] font-semibold text-gray-500">Content Writing</p>
                <p className="text-lg font-bold text-fg mt-1">
                  ₹{website.contentWritingPrice ?? 0}
                </p>
              </div>

              <div className="rounded-xl border border-border bg-cream/30 p-3.5">
                <p className="text-[11px] font-semibold text-gray-500">Turnaround Time</p>
                <p className="text-lg font-bold text-fg mt-1">{website.turnaroundDays} Days</p>
              </div>

              <div className="rounded-xl border border-border bg-cream/30 p-3.5">
                <p className="text-[11px] font-semibold text-gray-500">Max Links Allowed</p>
                <p className="text-lg font-bold text-fg mt-1">{website.maxLinksAllowed ?? 2}</p>
              </div>
            </div>

            {website.samplePostUrl && (
              <div className="rounded-xl border border-border bg-cream/20 p-3 flex items-center justify-between">
                <div className="flex items-center gap-2 truncate">
                  <Link2 className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-xs font-medium text-fg truncate">
                    Sample Post URL: {website.samplePostUrl}
                  </span>
                </div>
                <a
                  href={website.samplePostUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline ml-2 shrink-0"
                >
                  <span>Open URL</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1 Col): Target Audience & Publisher Info */}
        <div className="space-y-6">
          {/* Target Audience */}
          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-fg flex items-center gap-2 border-b border-border pb-3">
              <Tag className="h-4 w-4 text-primary" />
              <span>Target & Classification</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Category:</span>
                <span className="font-semibold text-fg">{website.category || "All"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>Country:</span>
                </span>
                <span className="font-semibold text-fg">{website.country || "—"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Language:</span>
                <span className="font-semibold text-fg">{website.language || "English"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Submitted:</span>
                </span>
                <span className="font-semibold text-fg">
                  {website.createdAt
                    ? new Date(website.createdAt).toLocaleDateString()
                    : "—"}
                </span>
              </div>
            </div>
          </div>

          {/* Seller (Publisher) Profile */}
          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-fg flex items-center gap-2 border-b border-border pb-3">
              <User className="h-4 w-4 text-primary" />
              <span>Seller Information</span>
            </h3>

            {seller ? (
              <div className="space-y-3 text-xs">
                <div>
                  <p className="text-[10px] font-semibold text-gray-400 uppercase">Seller Name</p>
                  <p className="text-sm font-bold text-fg mt-0.5">{seller.name || "Seller"}</p>
                </div>

                <div>
                  <p className="text-[10px] font-semibold text-gray-400 uppercase">Seller Email</p>
                  <p className="text-xs text-gray-700 mt-0.5">{seller.email}</p>
                </div>

                <div>
                  <p className="text-[10px] font-semibold text-gray-400 uppercase">Role</p>
                  <span className="inline-block mt-1 rounded bg-cream px-2 py-0.5 text-[10px] font-semibold text-primary">
                    {seller.role || "SELLER"}
                  </span>
                </div>

                {seller.socialProfiles && (
                  <div className="pt-2 border-t border-border space-y-1.5">
                    <p className="text-[10px] font-semibold text-gray-400 uppercase">Social Profiles</p>
                    {seller.socialProfiles.linkedin && (
                      <a
                        href={seller.socialProfiles.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-[11px] text-primary hover:underline"
                      >
                        <ExternalLink className="h-3 w-3" />
                        <span>LinkedIn</span>
                      </a>
                    )}
                    {seller.socialProfiles.facebook && (
                      <a
                        href={seller.socialProfiles.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-[11px] text-primary hover:underline"
                      >
                        <ExternalLink className="h-3 w-3" />
                        <span>Facebook</span>
                      </a>
                    )}
                    {seller.socialProfiles.instagram && (
                      <a
                        href={seller.socialProfiles.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-[11px] text-primary hover:underline"
                      >
                        <ExternalLink className="h-3 w-3" />
                        <span>Instagram</span>
                      </a>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-gray-400 italic">No seller details attached.</p>
            )}
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {reviewModal.isOpen && (
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
                  <span className="font-mono text-xs text-gray-500">({website.domain})</span>
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Confirm verification decision and optional metrics updates.
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

              <div>
                <label className="block text-xs font-semibold text-fg mb-1.5 flex items-center gap-1.5">
                  <MessageSquare className="h-3.5 w-3.5 text-gray-400" />
                  <span>Admin Review Notes</span>
                </label>
                <textarea
                  rows="3"
                  value={reviewModal.notes}
                  onChange={(e) => setReviewModal({ ...reviewModal, notes: e.target.value })}
                  placeholder="Review feedback or rejection explanation..."
                  className="w-full rounded-xl border border-border bg-white p-3 text-xs text-fg placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

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
                  disabled={actionLoading}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold text-white shadow-sm transition ${
                    reviewModal.targetStatus === "ACTIVE"
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : "bg-rose-600 hover:bg-rose-700"
                  } disabled:opacity-50`}
                >
                  {actionLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
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

export default AdminWebsiteDetail;
