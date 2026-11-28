// src/pages/packageManagerAdmin/packageListing.jsx
import { useState, useEffect, useCallback } from "react";
import {
  Package,
  Plus,
  RefreshCw,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  Trash2,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit,
} from "lucide-react";
import { Link } from "react-router-dom";
import PageHeader from "../../components/admin/layout/PageHeader";
import {
  getPackageManagerPackages,
  changePackageManagerPackageStatus,
  deletePackageManagerPackage,
} from "../../services/packageManagerService";
import { togglePackageStatusSchema } from "../../schemas/package.schema";
import { useToast } from "../../hooks/useToast";

const PackageListing = () => {
  const toast = useToast();

  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  // Filters & Pagination
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Fetch Packages from /v1/package/packageList
  const fetchPackages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getPackageManagerPackages();
      const list =
        res?.data?.packages ||
        res?.packages ||
        (Array.isArray(res?.data) ? res.data : []) ||
        (Array.isArray(res) ? res : []);
      setPackages(list);
      console.log("Fetched packages:", list); // Debug log
    } catch (err) {
      toast.error(err.message || "Failed to load packages.");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  // Toggle active status
  const handleToggleStatus = async (pkg) => {
    const packageId = pkg._slug || pkg.slug;
    const newStatus = !pkg.isActive;
    console.log("status",newStatus)

    const validation = togglePackageStatusSchema.safeParse({ isActive: newStatus });
    if (!validation.success) {
      toast.error(validation.error.errors[0]?.message || "Invalid status toggle payload.");
      return;
    }
    const payload = {
      isActive : newStatus
    }
     setTogglingId(packageId);
    try {
      await changePackageManagerPackageStatus(packageId, payload);
      setPackages((prev) =>
        prev.map((item) =>
          (item._slug || item.slug) === packageId || (item._id || item.id) === packageId
            ? { ...item, isActive: newStatus }
            : item
        )
      );
      toast.success(`Package marked as ${newStatus ? "active" : "inactive"}.`);
    } catch (err) {
      toast.error(err.message || "Failed to update package status.");
    } finally {
      setTogglingId(null);
    }
  };

  // Delete Package by slug
  const handleDelete = async (pkg) => {
    const packageSlug = pkg.slug;
    console.log("Deleting package with slug:", packageSlug); // Debug log
    if (!packageSlug) {
      toast.error("Package slug is missing.");
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to delete "${pkg.name}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    setDeletingId(packageSlug);
    try {
      await deletePackageManagerPackage(packageSlug);
      setPackages((prev) =>
        prev.filter((item) => (item.slug || item._id || item.id) !== packageSlug)
      );
      toast.success("Package deleted successfully.");
    } catch (err) {
      toast.error(err.message || "Failed to delete package.");
    } finally {
      setDeletingId(null);
    }
  };

  // Filtered list
  const filteredPackages = packages.filter((pkg) => {
    const matchesSearch =
      (pkg.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (pkg.tagline || "").toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;

    if (statusFilter === "ACTIVE") return pkg.isActive === true;
    if (statusFilter === "INACTIVE") return pkg.isActive === false;
    return true;
  });

  const totalPages = Math.ceil(filteredPackages.length / pageSize) || 1;
  const paginatedPackages = filteredPackages.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Packages"
        description="View and manage all available package plans and pricing tiers."
        icon={Package}
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchPackages}
              disabled={loading}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-white px-3.5 py-2 text-xs font-semibold text-fg shadow-sm hover:bg-cream transition-colors disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin text-primary" : ""}`} />
              Refresh
            </button>
            <Link
              to="/package-manager/packages/new"
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Create Package
            </Link>
          </div>
        }
      />

      {/* Filter / Search Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search packages by name or tagline..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-xl border border-border bg-cream/40 py-2 pl-9 pr-4 text-xs font-medium text-fg placeholder:text-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
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
            className="rounded-xl border border-border bg-cream/40 px-3 py-2 text-xs font-semibold text-fg focus:border-indigo-500 focus:bg-white focus:outline-none"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active Only</option>
            <option value="INACTIVE">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Packages Table Card */}
      <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-cream/60 text-[11px] font-bold uppercase tracking-wider text-gray-500">
              <tr>
                <th className="py-3.5 pl-6 pr-3">Package Details</th>
                <th className="px-3 py-3.5">Price & Billing</th>
                <th className="px-3 py-3.5">Features / Activities</th>
                <th className="px-3 py-3.5 text-center">Popular</th>
                <th className="px-3 py-3.5 text-center">Status</th>
                <th className="py-3.5 pl-3 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
                      <span className="text-xs font-medium">Loading packages...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedPackages.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <AlertCircle className="h-8 w-8 text-gray-300" />
                      <span className="text-sm font-semibold text-fg">No Packages Found</span>
                      <span className="text-xs text-gray-400">
                        {search
                          ? "Try adjusting your search criteria"
                          : "Get started by creating your first package tier."}
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedPackages.map((pkg) => {
                  const id = pkg._id || pkg.id;
                  const slug = pkg.slug || id;
                  const isToggling = togglingId === (pkg._slug || pkg.slug);
                  const isDeleting = deletingId === slug;


                  return (
                    <tr key={id} className="hover:bg-cream/20 transition-colors">
                      {/* Package Details */}
                      <td className="py-4 pl-6 pr-3">
                        <div className="flex items-start gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                            <Package className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-fg text-sm">{pkg.name}</span>
                              {pkg.badgeText && (
                                <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold text-indigo-700">
                                  {pkg.badgeText}
                                </span>
                              )}
                            </div>
                            <p className="mt-0.5 max-w-xs truncate text-xs text-gray-500">
                              {pkg.tagline || "No description provided."}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Price & Billing */}
                      <td className="px-3 py-4 whitespace-nowrap">
                        {pkg.isCustomPrice ? (
                          <span className="font-bold text-indigo-600 text-sm">
                            {pkg.customPriceLabel || "Custom"}
                          </span>
                        ) : (
                          <div className="flex items-baseline gap-1">
                            <span className="font-extrabold text-fg text-sm">
                              ₹{pkg.price ?? pkg.basePrice ?? 0}
                            </span>
                            <span className="text-[11px] text-gray-400">
                              {pkg.billingCycle || "/mo"}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Features */}
                      <td className="px-3 py-4">
                        <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-[11px] font-medium text-gray-700">
                          {pkg.seoActivities?.length
                            ? `${pkg.seoActivities.length} activities`
                            : `${pkg.features?.length || 0} features`}
                        </span>
                      </td>

                      {/* Popular Badge */}
                      <td className="px-3 py-4 text-center whitespace-nowrap">
                        {pkg.isPopular ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-600 border border-amber-200">
                            <Sparkles className="h-3 w-3" />
                            Popular
                          </span>
                        ) : (
                          <span className="text-gray-300 text-xs">—</span>
                        )}
                      </td>

                      {/* Status Toggle */}
                      <td className="px-3 py-4 text-center whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(pkg)}
                          disabled={isToggling}
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-all cursor-pointer ${
                            pkg.isActive
                              ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                              : "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200"
                          } disabled:opacity-50`}
                        >
                          {isToggling ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : pkg.isActive ? (
                            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                          ) : (
                            <XCircle className="h-3 w-3 text-rose-600" />
                          )}
                          {pkg.isActive ? "Active" : "Inactive"}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-4 pl-3 pr-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            to={`/package-manager/packages/${slug}`}
                            title="View Package Details"
                            className="rounded-lg p-1.5 text-gray-500 hover:bg-cream hover:text-fg transition-colors cursor-pointer inline-flex items-center"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <Link
                            to={`/package-manager/packages/edit/${slug}`}
                            title="Edit Package"
                            className="rounded-lg p-1.5 text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer inline-flex items-center"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDelete(pkg)}
                            disabled={isDeleting}
                            title="Delete Package"
                            className="rounded-lg p-1.5 text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-50 cursor-pointer"
                          >
                            {isDeleting ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border px-6 py-3.5">
            <span className="text-xs text-gray-500">
              Showing {(page - 1) * pageSize + 1} to{" "}
              {Math.min(page * pageSize, filteredPackages.length)} of {filteredPackages.length}{" "}
              packages
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-lg border border-border p-1.5 text-gray-500 hover:bg-cream disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="px-2 text-xs font-semibold text-fg">
                {page} / {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="rounded-lg border border-border p-1.5 text-gray-500 hover:bg-cream disabled:opacity-40 cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PackageListing;
