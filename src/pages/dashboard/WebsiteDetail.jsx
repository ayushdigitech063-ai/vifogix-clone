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
  Edit,
  BarChart2,
  DollarSign,
  Link2,
  Tag,
  MapPin,
  Calendar,
  FileText,
} from "lucide-react";
import { getMyWebsiteDetails } from "../../services/websiteService";
import { useToast } from "../../hooks/useToast";

const WebsiteDetail = () => {
  const { slug } = useParams();
  const toast = useToast();

  const [website, setWebsite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const fetchDetail = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getMyWebsiteDetails(slug);
        if (!active) return;
        const data = res?.data?.website || res?.data || res;
        setWebsite(data);
      } catch (err) {
        if (!active) return;
        const msg = err.message || "Failed to load website details.";
        setError(msg);
        toast.error(msg);
      } finally {
        if (active) setLoading(false);
      }
    };

    if (slug) {
      fetchDetail();
    }

    return () => {
      active = false;
    };
  }, [slug, toast]);

  const getStatusBadge = (siteStatus, isVerified) => {
    const norm = siteStatus ? siteStatus.toUpperCase() : "PENDING_VERIFICATION";

    if (norm === "ACTIVE" || isVerified) {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-600">
          <ShieldCheck className="h-3.5 w-3.5" />
          Active
        </span>
      );
    }

    if (norm === "PENDING_VERIFICATION") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-yellow/15 border border-accent-yellow/30 px-3 py-1 text-xs font-semibold text-fg">
          <Clock className="h-3.5 w-3.5 text-accent-yellow" />
          Pending Verification
        </span>
      );
    }

    if (norm === "REJECTED") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-red/10 border border-accent-red/20 px-3 py-1 text-xs font-semibold text-accent-red">
          <XCircle className="h-3.5 w-3.5" />
          Rejected
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-cream border border-border px-3 py-1 text-xs font-semibold text-muted">
        <AlertCircle className="h-3.5 w-3.5" />
        {norm}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-[55vh] flex-col items-center justify-center text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
        <p className="text-sm font-semibold text-fg">Loading website details...</p>
      </div>
    );
  }

  if (error || !website) {
    return (
      <div className="mx-auto max-w-4xl py-16 text-center">
        <AlertCircle className="mx-auto h-10 w-10 text-accent-red mb-3" />
        <h2 className="text-lg font-bold text-fg">Unable to load website details</h2>
        <p className="text-sm text-muted mt-1">{error || "Website listing not found."}</p>
        <Link
          to="/publisher-dashboard/websites"
          className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary-light"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to My Websites
        </Link>
      </div>
    );
  }

  const editSlug = website.slug || slug;
  const createdAt = website.createdAt
    ? new Date(website.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "—";

  return (
    <div className="mx-auto max-w-5xl space-y-6 animate-fade-in pb-12">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            to="/publisher-dashboard/websites"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-fg transition-colors mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to My Websites</span>
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-fg tracking-tight">
              {website.domain}
            </h1>
            {getStatusBadge(website.status, website.isVerified)}
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-muted">
            <a
              href={`https://${website.domain}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-primary hover:underline font-medium"
            >
              <span>Visit Website</span>
              <ExternalLink className="h-3 w-3" />
            </a>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              Added {createdAt}
            </span>
          </div>
        </div>

        <Link
          to={`/publisher-dashboard/websites/${editSlug}/edit`}
          className="inline-flex items-center gap-2 self-start sm:self-auto rounded-xl bg-primary px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-primary-light transition-colors"
        >
          <Edit className="h-4 w-4" />
          <span>Edit Website</span>
        </Link>
      </div>

      {/* Admin Review Notes */}
      {website.adminReviewNotes && (
        <div className="rounded-2xl border border-accent-red/20 bg-accent-red/5 p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-accent-red shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-fg">Admin Review Notes</p>
            <p className="text-xs text-muted mt-0.5">{website.adminReviewNotes}</p>
          </div>
        </div>
      )}

      {/* Authority & Traffic Metrics */}
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <BarChart2 className="h-4 w-4 text-primary" />
          <h2 className="text-base font-bold text-fg">SEO &amp; Traffic Metrics</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="rounded-xl bg-cream/50 border border-border p-3.5">
            <p className="text-[11px] font-semibold text-muted uppercase">Moz DA</p>
            <p className="text-xl font-extrabold text-fg mt-1">
              {website.mozDA ?? "—"}
            </p>
          </div>
          <div className="rounded-xl bg-cream/50 border border-border p-3.5">
            <p className="text-[11px] font-semibold text-muted uppercase">Ahrefs DR</p>
            <p className="text-xl font-extrabold text-primary mt-1">
              {website.ahrefsDR ?? "—"}
            </p>
          </div>
          <div className="rounded-xl bg-cream/50 border border-border p-3.5">
            <p className="text-[11px] font-semibold text-muted uppercase">Semrush AS</p>
            <p className="text-xl font-extrabold text-fg mt-1">
              {website.semrushAS ?? "—"}
            </p>
          </div>
          <div className="rounded-xl bg-cream/50 border border-border p-3.5">
            <p className="text-[11px] font-semibold text-muted uppercase">Monthly Traffic</p>
            <p className="text-xl font-extrabold text-fg mt-1">
              {website.monthlyTraffic || "—"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 text-xs">
          <div>
            <p className="text-muted">Semrush Traffic</p>
            <p className="font-semibold text-fg mt-0.5">{website.semrushTraffic || "—"}</p>
          </div>
          <div>
            <p className="text-muted">Ahrefs Traffic</p>
            <p className="font-semibold text-fg mt-0.5">{website.ahrefsTraffic || "—"}</p>
          </div>
          <div>
            <p className="text-muted">Followed Backlinks</p>
            <p className="font-semibold text-fg mt-0.5">{website.followedBacklinks || "—"}</p>
          </div>
          <div>
            <p className="text-muted">NoFollow Backlinks</p>
            <p className="font-semibold text-fg mt-0.5">{website.noFollowedBacklinks || "—"}</p>
          </div>
        </div>
      </div>

      {/* Pricing & Publishing Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <DollarSign className="h-4 w-4 text-primary" />
            <h2 className="text-base font-bold text-fg">Pricing &amp; Delivery</h2>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted">Guest Post Price</span>
              <span className="font-bold text-fg">₹{Number(website.price || 0).toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted">Content Writing Price</span>
              <span className="font-semibold text-fg">
                ₹{Number(website.contentWritingPrice || 0).toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted">Turnaround Time</span>
              <span className="font-semibold text-fg">{website.turnaroundDays || 3} Days</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted">Max Links Allowed</span>
              <span className="font-semibold text-fg">{website.maxLinksAllowed || 2} Links</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted">Link Type</span>
              <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                <Link2 className="h-3 w-3" />
                {website.linkType || "DoFollow"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted">Total Deals</span>
              <span className="font-semibold text-fg">{website.totalDeals ?? 0}</span>
            </div>
          </div>
        </div>

        {/* Categorization & Region */}
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <Globe className="h-4 w-4 text-primary" />
            <h2 className="text-base font-bold text-fg">Category &amp; Details</h2>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5" /> Category
              </span>
              <span className="font-semibold text-fg">{website.category || "—"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" /> Country &amp; Language
              </span>
              <span className="font-semibold text-fg">
                {website.country || "—"} ({website.language || "English"})
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted">Domain Age</span>
              <span className="font-semibold text-fg">{website.domainAge || "—"}</span>
            </div>
            {website.samplePostUrl && (
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted flex items-center gap-1.5 shrink-0">
                  <FileText className="h-3.5 w-3.5" /> Sample Post
                </span>
                <a
                  href={website.samplePostUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium text-primary hover:underline truncate"
                >
                  {website.samplePostUrl}
                </a>
              </div>
            )}
            {Array.isArray(website.subCategories) && website.subCategories.length > 0 && (
              <div className="pt-1">
                <p className="text-xs text-muted mb-2">Subcategories</p>
                <div className="flex flex-wrap gap-1.5">
                  {website.subCategories.map((sub) => (
                    <span
                      key={sub}
                      className="rounded-lg bg-cream border border-border px-2.5 py-0.5 text-xs font-medium text-fg"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebsiteDetail;
