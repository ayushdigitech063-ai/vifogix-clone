// src/pages/packageManagerAdmin/packageDetail.jsx
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Package,
  ArrowLeft,
  Edit,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  Check,
  Calendar,
} from "lucide-react";
import PageHeader from "../../components/admin/layout/PageHeader";
import { getManagedPackage } from "../../services/packageManagerService";
import { useToast } from "../../hooks/useToast";

const PackageDetail = () => {
  const { slug } = useParams();
  const toast = useToast();

  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const fetchPackage = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getManagedPackage(slug);
        if (!active) return;
        const data = res?.data?.package || res?.package || res?.data || res;
        setPkg(data);
      } catch (err) {
        if (!active) return;
        const msg = err.message || "Failed to load package details.";
        setError(msg);
        toast.error(msg);
      } finally {
        if (active) setLoading(false);
      }
    };

    if (slug) {
      fetchPackage();
    }

    return () => {
      active = false;
    };
  }, [slug, toast]);

  if (loading) {
    return (
      <div className="flex min-h-[55vh] flex-col items-center justify-center text-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mb-3" />
        <p className="text-sm font-semibold text-fg">Loading package details...</p>
      </div>
    );
  }

  if (error || !pkg) {
    return (
      <div className="mx-auto max-w-4xl py-16 text-center">
        <AlertCircle className="mx-auto h-10 w-10 text-rose-500 mb-3" />
        <h2 className="text-lg font-bold text-fg">Unable to load package details</h2>
        <p className="text-sm text-gray-500 mt-1">{error || "Package not found."}</p>
        <Link
          to="/package-manager/packages"
          className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Packages
        </Link>
      </div>
    );
  }

  const editSlug = pkg.slug || pkg._id || pkg.id || slug;
  const createdAt = pkg.createdAt
    ? new Date(pkg.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "—";

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/package-manager/packages"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-fg transition-colors mb-3"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Packages</span>
        </Link>

        <PageHeader
          title={pkg.name}
          description={pkg.tagline || "No description provided."}
          icon={Package}
          actions={
            <Link
              to={`/package-manager/packages/edit/${editSlug}`}
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors"
            >
              <Edit className="h-4 w-4" />
              Edit Package
            </Link>
          }
        />
      </div>

      {/* Summary & Pricing */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
            Price &amp; Billing
          </p>
          <p className="mt-2 text-2xl font-extrabold text-fg">
            {pkg.isCustomPrice
              ? pkg.customPriceLabel || "Custom"
              : `₹${pkg.price ?? pkg.basePrice ?? 0}`}
            {!pkg.isCustomPrice && (
              <span className="ml-1 text-xs font-medium text-gray-400">
                {pkg.billingCycle || "/mo"}
              </span>
            )}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
            Status &amp; Visibility
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold border ${
                pkg.isActive
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-rose-50 text-rose-700 border-rose-200"
              }`}
            >
              {pkg.isActive ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              ) : (
                <XCircle className="h-3.5 w-3.5 text-rose-600" />
              )}
              {pkg.isActive ? "Active" : "Inactive"}
            </span>
            {pkg.isPopular && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-600 border border-amber-200">
                <Sparkles className="h-3.5 w-3.5" />
                Popular
              </span>
            )}
            {pkg.badgeText && (
              <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                {pkg.badgeText}
              </span>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
            Metadata
          </p>
          <div className="mt-2 space-y-1 text-xs">
            <p className="text-gray-500">
              Display Order:{" "}
              <span className="font-bold text-fg">{pkg.displayOrder ?? 1}</span>
            </p>
            <p className="text-gray-500 flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              Created: <span className="font-semibold text-fg">{createdAt}</span>
            </p>
          </div>
        </div>
      </div>

      {/* SEO Activities or Features */}
      <div className="rounded-2xl border border-border bg-white p-6 shadow-sm space-y-4">
        {pkg.seoActivities && pkg.seoActivities.length > 0 ? (
          <>
            <h2 className="text-base font-bold text-fg">Monthly SEO Activities</h2>
            <div className="overflow-hidden rounded-xl border border-border">
              <table className="w-full text-left text-xs">
                <thead className="bg-cream/60 font-semibold text-gray-500 uppercase text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Activity</th>
                    <th className="py-3 px-4 text-center">Monthly Qty</th>
                    <th className="py-3 px-4 text-right">Unit Add-On ($)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {pkg.seoActivities.map((act, i) => (
                    <tr key={i} className="hover:bg-cream/20">
                      <td className="py-3 px-4 font-medium text-fg">{act.name}</td>
                      <td className="py-3 px-4 text-center text-gray-600">{act.monthlyQty}</td>
                      <td className="py-3 px-4 text-right font-semibold text-fg">
                        ${act.unitAddOn}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : pkg.features && pkg.features.length > 0 ? (
          <>
            <h2 className="text-base font-bold text-fg">Included Features</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              {pkg.features.map((feat, idx) => (
                <li key={idx} className="flex items-center gap-2 text-fg">
                  <Check className="h-4 w-4 text-indigo-600 shrink-0" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="text-xs text-gray-500">No activities or features listed for this package.</p>
        )}
      </div>
    </div>
  );
};

export default PackageDetail;
