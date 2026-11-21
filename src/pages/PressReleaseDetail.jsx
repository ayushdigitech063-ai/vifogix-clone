import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Globe,
  Share2,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  FileText,
  Clock,
  Sparkles,
  Loader2,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { getPublicPressReleaseById } from "../services/pressReleaseService";
import { packages as mockPackages } from "../data/pressRelease";

const PressReleaseDetail = () => {
  const { id } = useParams();
  const [pr, setPr] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchDetail = async () => {
      setLoading(true);
      setError(null);

      // 1. If valid 24-char ObjectId, query backend API
      if (id && /^[0-9a-fA-F]{24}$/.test(id)) {
        try {
          const res = await getPublicPressReleaseById(id);
          if (!isMounted) return;
          const apiPr = res?.data?.pressRelease || res?.data;
          if (apiPr) {
            setPr(apiPr);
            setLoading(false);
            return;
          }
        } catch {
          if (!isMounted) return;
          // Fallback check in mock data below if API doesn't find it
        }
      }

      // 2. Check local mock packages by slug or id
      const localMatch = mockPackages.find(
        (p) => String(p.id) === String(id) || p.slug === id
      );

      if (isMounted) {
        if (localMatch) {
          setPr({
            _id: localMatch.id,
            title: localMatch.title,
            packageDescription: `Guaranteed publication and distribution across premier outlets including ${localMatch.featured?.join(", ") || "trusted news channels"}. Maximum reach and indexed links to boost organic traffic and authority.`,
            outletDomain: localMatch.logoDomain || "",
            outletsCount: localMatch.highlights?.find((h) => h.includes("outlets")) ? parseInt(localMatch.highlights.find((h) => h.includes("outlets")), 10) : 1,
            price: localMatch.price,
            turnaroundDays: localMatch.days,
            maxLinksAllowed: localMatch.backlinks,
            linkType: "NoFollow",
            category: "Press Release",
            subCategories: ["Media & News", "Digital PR"],
            country: "Global",
            language: "English",
            mozDA: 65,
            ahrefsDR: 70,
            semrushAS: 60,
            maxWordsAllowed: 700,
            maxImagesAllowed: 2,
            hasSponsoredTag: true,
            isPrWritingAvailable: true,
            prWritingPrice: 25,
            included: localMatch.featured || [],
            excluded: [],
            highlights: localMatch.highlights || [],
          });
        } else {
          setError("Press release not found.");
        }
        setLoading(false);
      }
    };

    fetchDetail();
    return () => {
      isMounted = false;
    };
  }, [id]);

  useEffect(() => {
    if (pr?.title) {
      document.title = `${pr.title} | Press Release Package`;
    }
  }, [pr]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-gray-50 p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="mt-3 text-sm font-medium text-gray-500">Loading press release details...</span>
      </div>
    );
  }

  if (error || !pr) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 text-center">
        <AlertCircle className="h-12 w-12 text-rose-500 mb-3" />
        <h2 className="text-xl font-bold text-fg">Press Release Not Found</h2>
        <p className="mt-1 text-sm text-gray-500">
          The requested package could not be retrieved or is no longer available.
        </p>
        <Link
          to="/press-release"
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-primary-light"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Press Releases
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-16">
      {/* Top Header / Breadcrumb */}
      <div className="border-b border-border bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
          <Link
            to="/press-release"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-primary transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to All Packages
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Info (Left 2 cols) */}
          <div className="space-y-6 lg:col-span-2">
            {/* Hero Card */}
            <div className="rounded-2xl border border-border bg-white p-6 shadow-xs">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border bg-gray-50">
                    {pr.image ? (
                      <img src={pr.image} alt={pr.title} className="h-full w-full object-cover" />
                    ) : pr.outletDomain ? (
                      <img
                        src={`https://www.google.com/s2/favicons?domain=${pr.outletDomain}&sz=64`}
                        alt="Logo"
                        width="36"
                        height="36"
                      />
                    ) : (
                      <span className="text-2xl font-black text-primary">{pr.title ? pr.title[0] : "P"}</span>
                    )}
                  </div>
                  <div>
                    <h1 className="text-xl font-extrabold text-fg sm:text-2xl">{pr.title}</h1>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                      {pr.outletDomain && (
                        <span className="flex items-center gap-1">
                          <Globe className="h-3.5 w-3.5 text-gray-400" />
                          {pr.outletDomain}
                        </span>
                      )}
                      {pr.outletsCount > 1 && (
                        <span className="rounded-full bg-blue-50 px-2 py-0.5 font-semibold text-primary">
                          +{pr.outletsCount} Outlets
                        </span>
                      )}
                      <span className="rounded-full bg-cream px-2 py-0.5 font-medium text-fg">
                        {pr.category || "General"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({ title: pr.title, url: window.location.href }).catch(() => {});
                      } else {
                        navigator.clipboard.writeText(window.location.href);
                        alert("Link copied to clipboard!");
                      }
                    }}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-white text-gray-500 hover:bg-gray-50 transition"
                    title="Share"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* SEO Metrics Strip */}
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 rounded-xl border border-border bg-gray-50/60 p-3">
                <div className="text-center p-2">
                  <p className="text-[11px] font-semibold text-gray-400">Moz DA</p>
                  <p className="text-lg font-extrabold text-fg">{pr.mozDA ?? "—"}</p>
                </div>
                <div className="text-center p-2 border-l border-border/40">
                  <p className="text-[11px] font-semibold text-gray-400">Ahrefs DR</p>
                  <p className="text-lg font-extrabold text-fg">{pr.ahrefsDR ?? "—"}</p>
                </div>
                <div className="text-center p-2 border-l border-border/40">
                  <p className="text-[11px] font-semibold text-gray-400">Semrush AS</p>
                  <p className="text-lg font-extrabold text-fg">{pr.semrushAS ?? "—"}</p>
                </div>
                <div className="text-center p-2 border-l border-border/40">
                  <p className="text-[11px] font-semibold text-gray-400">Turnaround</p>
                  <p className="text-lg font-extrabold text-fg">{pr.turnaroundDays ? `${pr.turnaroundDays} Days` : "3 Days"}</p>
                </div>
              </div>
            </div>

            {/* Package Description */}
            <div className="rounded-2xl border border-border bg-white p-6 shadow-xs">
              <h2 className="text-base font-bold text-fg flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                Package Description & Coverage
              </h2>
              <div className="mt-4 whitespace-pre-line text-sm leading-relaxed text-gray-600">
                {pr.packageDescription || "Detailed distribution across high-authority networks and syndicated portals."}
              </div>

              {/* Inclusions and Exclusions */}
              {((Array.isArray(pr.included) && pr.included.length > 0) ||
                (Array.isArray(pr.excluded) && pr.excluded.length > 0)) && (
                <div className="mt-6 border-t border-border/60 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Featured Inclusions */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Featured Inclusions</h3>
                    {Array.isArray(pr.included) && pr.included.length > 0 ? (
                      <div className="mt-2.5 flex flex-wrap gap-2">
                        {pr.included.map((item, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-100"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                            {item}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-2 text-xs text-gray-400">None specified</p>
                    )}
                  </div>

                  {/* What's Excluded */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">What&apos;s Excluded</h3>
                    {Array.isArray(pr.excluded) && pr.excluded.length > 0 ? (
                      <div className="mt-2.5 flex flex-wrap gap-2">
                        {pr.excluded.map((item, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 border border-rose-100"
                          >
                            <XCircle className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                            {item}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-2 text-xs text-gray-400">None specified</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Publishing Specifications */}
            <div className="rounded-2xl border border-border bg-white p-6 shadow-xs">
              <h2 className="text-base font-bold text-fg flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Publishing Specifications
              </h2>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="rounded-xl border border-border bg-gray-50/50 p-3 flex justify-between items-center">
                  <span className="text-gray-500">Max Words Allowed</span>
                  <span className="font-bold text-fg">{pr.maxWordsAllowed || 500} words</span>
                </div>
                <div className="rounded-xl border border-border bg-gray-50/50 p-3 flex justify-between items-center">
                  <span className="text-gray-500">Backlinks Allowed</span>
                  <span className="font-bold text-fg">{pr.maxLinksAllowed || 2} ({pr.linkType || "NoFollow"})</span>
                </div>
                <div className="rounded-xl border border-border bg-gray-50/50 p-3 flex justify-between items-center">
                  <span className="text-gray-500">Images Included</span>
                  <span className="font-bold text-fg">{pr.maxImagesAllowed ?? 2} images</span>
                </div>
                <div className="rounded-xl border border-border bg-gray-50/50 p-3 flex justify-between items-center">
                  <span className="text-gray-500">Sponsored Tag</span>
                  <span className="font-bold text-fg">{pr.hasSponsoredTag ? "Yes" : "No"}</span>
                </div>
                <div className="rounded-xl border border-border bg-gray-50/50 p-3 flex justify-between items-center">
                  <span className="text-gray-500">Target Country</span>
                  <span className="font-bold text-fg">{pr.country || "Global"}</span>
                </div>
                <div className="rounded-xl border border-border bg-gray-50/50 p-3 flex justify-between items-center">
                  <span className="text-gray-500">Language</span>
                  <span className="font-bold text-fg">{pr.language || "English"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Order Card (Right col) */}
          <div className="space-y-6 lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-border bg-white p-6 shadow-xs">
              <div className="border-b border-border pb-4">
                <p className="text-xs font-semibold text-gray-400">Total Price</p>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-fg">${pr.price ?? 0}</span>
                  <span className="text-xs font-medium text-gray-500">/ release</span>
                </div>
              </div>

              {pr.isPrWritingAvailable && (
                <div className="my-4 rounded-xl border border-border bg-primary/5 p-3 text-xs">
                  <p className="font-bold text-primary flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5" />
                    PR Writing Add-on Available
                  </p>
                  <p className="mt-1 text-gray-600">
                    Professional press release writing for an additional <span className="font-bold text-fg">+${pr.prWritingPrice}</span>.
                  </p>
                </div>
              )}

              <div className="mt-5 space-y-2.5">
                <Link
                  to="/signup"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-white shadow-xs hover:bg-primary-light transition"
                >
                  Order Now · ${pr.price ?? 0}
                </Link>
                <Link
                  to="/contact-us"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-border py-2.5 text-xs font-semibold text-fg hover:bg-gray-50 transition"
                >
                  <HelpCircle className="h-4 w-4 text-gray-400" />
                  Have Questions? Talk to Support
                </Link>
              </div>

              <div className="mt-6 border-t border-border pt-4 text-[11px] text-gray-500 space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                  <span>Estimated delivery: {pr.turnaroundDays ? `${pr.turnaroundDays} business days` : "3 business days"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  <span>100% Guaranteed Publication or Money Back</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PressReleaseDetail;
