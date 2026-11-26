// src/pages/admin/AdminPackages.jsx
import { useState, useEffect, useCallback, useId } from "react";
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
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit,
} from "lucide-react";
import PageHeader from "../../components/admin/layout/PageHeader";
import {
  getAdminPackages,
  createPackage,
  updatePackage,
  changePackageStatus,
  deletePackage,
} from "../../services/packageService";
import {
  createPackageSchema,
  updatePackageSchema,
  togglePackageStatusSchema,
} from "../../schemas/package.schema";
import { useToast } from "../../hooks/useToast";

const initialFormState = {
  name: "",
  tagline: "",
  price: "",
  isCustomPrice: false,
  customPriceLabel: "Custom",
  billingCycle: "/mo",
  features: [""],
  isPopular: false,
  badgeText: "",
  buttonText: "Get Started",
  displayOrder: 1,
  isActive: true,
};

const AdminPackages = () => {
  const toast = useToast();
  const nameInputId = useId();
  const taglineInputId = useId();
  const priceInputId = useId();
  const customPriceCheckId = useId();
  const customPriceLabelId = useId();
  const billingCycleId = useId();
  const popularCheckId = useId();
  const badgeTextId = useId();
  const buttonTextId = useId();
  const displayOrderId = useId();
  const activeCheckId = useId();

  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  // Filters & Pagination
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // View Details Modal State
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

  // Modal State (Add/Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackageId, setEditingPackageId] = useState(null);
  const [formData, setFormData] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState({});

  const fetchPackages = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAdminPackages();
      const list = res?.data?.packages || res?.data || (Array.isArray(res) ? res : []);
      setPackages(Array.isArray(list) ? list : []);
    } catch (err) {
      toast.error(err.message || "Failed to load packages.");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        const res = await getAdminPackages();
        if (!active) return;
        const list = res?.data?.packages || res?.data || (Array.isArray(res) ? res : []);
        setPackages(Array.isArray(list) ? list : []);
      } catch (err) {
        if (!active) return;
        toast.error(err.message || "Failed to load packages.");
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [toast]);

  // Form feature handlers
  const handleFeatureChange = (index, value) => {
    setFormData((prev) => {
      const nextFeatures = [...prev.features];
      nextFeatures[index] = value;
      return { ...prev, features: nextFeatures };
    });
  };

  const addFeatureInput = () => {
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, ""],
    }));
  };

  const removeFeatureInput = (index) => {
    setFormData((prev) => {
      if (prev.features.length <= 1) return prev;
      return {
        ...prev,
        features: prev.features.filter((_, i) => i !== index),
      };
    });
  };

  const handleOpenAddModal = () => {
    setEditingPackageId(null);
    setFormData({
      ...initialFormState,
      displayOrder: packages.length + 1,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (pkg) => {
    const pkgId = pkg._id || pkg.id;
    setEditingPackageId(pkgId);
    setFormData({
      name: pkg.name || "",
      tagline: pkg.tagline || "",
      price: pkg.price !== undefined && pkg.price !== null ? pkg.price : "",
      isCustomPrice: Boolean(pkg.isCustomPrice),
      customPriceLabel: pkg.customPriceLabel || "Custom",
      billingCycle: pkg.billingCycle !== undefined && pkg.billingCycle !== null ? pkg.billingCycle : "/mo",
      features: Array.isArray(pkg.features) && pkg.features.length > 0 ? pkg.features : [""],
      isPopular: Boolean(pkg.isPopular),
      badgeText: pkg.badgeText || "",
      buttonText: pkg.buttonText || "Get Started",
      displayOrder: pkg.displayOrder || 1,
      isActive: pkg.isActive !== undefined ? Boolean(pkg.isActive) : true,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (actionLoading) return;
    setIsModalOpen(false);
    setEditingPackageId(null);
    setFormErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});

    // Filter out empty features
    const cleanedFeatures = formData.features
      .map((f) => f.trim())
      .filter((f) => f.length > 0);

    const payload = {
      name: formData.name.trim().toUpperCase(),
      tagline: formData.tagline.trim(),
      isCustomPrice: Boolean(formData.isCustomPrice),
      customPriceLabel: formData.customPriceLabel.trim() || "Custom",
      billingCycle: formData.billingCycle ? formData.billingCycle.trim() : null,
      price: formData.isCustomPrice
        ? null
        : formData.price === "" || formData.price === null
        ? null
        : Number(formData.price),
      features: cleanedFeatures,
      isPopular: Boolean(formData.isPopular),
      badgeText: formData.badgeText?.trim() ? formData.badgeText.trim() : null,
      buttonText: formData.buttonText?.trim() ? formData.buttonText.trim() : "Get Started",
      displayOrder: Number(formData.displayOrder) || 1,
      isActive: Boolean(formData.isActive),
    };

    // Client-side Zod validation
    const schemaToUse = editingPackageId ? updatePackageSchema : createPackageSchema;
    const validation = schemaToUse.safeParse(payload);
    if (!validation.success) {
      const fieldErrors = {};
      validation.error.issues.forEach((issue) => {
        const fieldName = issue.path[0];
        if (fieldName && !fieldErrors[fieldName]) {
          fieldErrors[fieldName] = issue.message;
        }
      });
      setFormErrors(fieldErrors);
      toast.error("Please correct the errors in the form.", "Validation Error");
      return;
    }

    try {
      setActionLoading(true);
      if (editingPackageId) {
        const res = await updatePackage(editingPackageId, payload);
        const updated = res?.data?.package || res?.data || { ...payload, _id: editingPackageId };
        setPackages((prev) =>
          prev.map((item) => ((item._id || item.id) === editingPackageId ? { ...item, ...updated } : item))
        );
        toast.success(res?.message || "Package updated successfully!", "Updated");
      } else {
        const res = await createPackage(payload);
        const created = res?.data?.package || res?.data || payload;
        setPackages((prev) => [...prev, created]);
        toast.success(res?.message || "Package added successfully!", "Success");
      }
      setIsModalOpen(false);
      setEditingPackageId(null);
      fetchPackages();
    } catch (err) {
      toast.error(
        err.message || (editingPackageId ? "Failed to update package." : "Failed to create package."),
        editingPackageId ? "Update Error" : "Creation Error"
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusChange = async (pkg, newStatus) => {
    const pkgSlug = pkg._slug || pkg.slug || pkg._id || pkg.id;
    if (!pkgSlug) return;

    // Validate params & body with togglePackageStatusSchema
    const validation = togglePackageStatusSchema.safeParse({
      params: { packageId: pkgSlug },
      body: { status: newStatus },
    });

    if (!validation.success) {
      const msg = validation.error.issues[0]?.message || "Invalid status payload";
      toast.error(msg, "Validation Error");
      return;
    }

    try {
      setTogglingId(pkg._id || pkg.id || pkgSlug);
      const res = await changePackageStatus(pkgSlug, { status: newStatus });
      setPackages((prev) =>
        prev.map((item) =>
          (item._id || item.id) === (pkg._id || pkg.id) || item.slug === pkgSlug
            ? { ...item, status: newStatus, isActive: newStatus === "ACTIVE" }
            : item
        )
      );
      if (
        selectedPackage &&
        ((selectedPackage._id || selectedPackage.id) === (pkg._id || pkg.id) ||
          selectedPackage.slug === pkgSlug)
      ) {
        setSelectedPackage((prev) => ({
          ...prev,
          status: newStatus,
          isActive: newStatus === "ACTIVE",
        }));
      }
      toast.success(res?.message || `Package status updated to ${newStatus}.`);
    } catch (err) {
      toast.error(err.message || "Failed to update package status.");
    } finally {
      setTogglingId(null);
    }
  };

  const handleToggleStatus = async (pkg) => {
    const pkgSlug = pkg._slug || pkg.slug;
    console.log("new slug" , pkgSlug)
    if (!pkgSlug) return;

    const newStatus = !pkg.isActive;
    const status = pkg.status;

    // Validate params & body with togglePackageStatusSchema
    const validation = togglePackageStatusSchema.safeParse({
      params: { packageId: pkgSlug },
      body: { status: status },
    });

    if (!validation.success) {
      const msg = validation.error.issues[0]?.message || "Invalid status payload";
      toast.error(msg, "Validation Error");
      return;
    }

    try {
      setTogglingId(pkgSlug);
      const res = await changePackageStatus(pkgSlug, {  status: status});
      setPackages((prev) =>
        prev.map((item) =>
          (item._id || item.id) === pkgSlug ? { ...item, status: status} : item
        )
      );
      if (selectedPackage && (selectedPackage._id || selectedPackage.id) === pkgSlug) {
        setSelectedPackage((prev) => ({ ...prev, status: status }));
      }
      toast.success(res?.message || `Package ${newStatus ? "activated" : "deactivated"} successfully.`);
    } catch (err) {
      toast.error(err.message || "Failed to update package status.");
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (pkgId) => {
    if (!window.confirm("Are you sure you want to delete this package?")) return;

    try {
      setDeletingId(pkgId);
      await deletePackage(pkgId);
      setPackages((prev) => prev.filter((p) => (p._id || p.id) !== pkgId));
      toast.success("Package deleted successfully.");
    } catch (err) {
      toast.error(err.message || "Failed to delete package.");
    } finally {
      setDeletingId(null);
    }
  };

  // Filtered list
  const filteredPackages = packages.filter((pkg) => {
    const nameMatch = pkg.name?.toLowerCase().includes(search.toLowerCase());
    const taglineMatch = pkg.tagline?.toLowerCase().includes(search.toLowerCase());
    const matchesSearch = !search || nameMatch || taglineMatch;

    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "ACTIVE" && pkg.isActive) ||
      (statusFilter === "INACTIVE" && !pkg.isActive);

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title="Packages Management"
          description="Create, manage, and configure link building and guest posting packages."
        />
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchPackages}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-2 text-xs font-semibold text-fg hover:border-primary hover:text-primary disabled:opacity-50"
            title="Refresh packages"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-primary-light"
          >
            <Plus className="h-4 w-4" />
            Add Package
          </button>
        </div>
      </div>

      {/* Filters Toolbar */}
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
            placeholder="Search packages by name or tagline..."
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
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active Only</option>
            <option value="INACTIVE">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Packages Table Listing */}
      <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-xs">
        {loading ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="mt-3 text-xs font-medium text-gray-500">Loading packages...</span>
          </div>
        ) : filteredPackages.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center p-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cream text-primary">
              <Package className="h-6 w-6" />
            </div>
            <h3 className="mt-3 text-base font-bold text-fg">No Packages Found</h3>
            <p className="mt-1 max-w-sm text-xs text-gray-500">
              {search || statusFilter !== "ALL"
                ? "No packages match the selected search or filter criteria."
                : "Get started by creating your first service package."}
            </p>
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="mt-4 flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-primary-light"
            >
              <Plus className="h-4 w-4" />
              Add First Package
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-gray-50/75 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-5 py-3">Package</th>
                  <th className="px-5 py-3">Price</th>
                  <th className="px-5 py-3">Features</th>
                  <th className="px-5 py-3">Order</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredPackages
                  .slice((page - 1) * pageSize, page * pageSize)
                  .map((pkg) => {
                    const pkgId = pkg._id || pkg.id;
                    const isDeleting = deletingId === pkgId;
                    const isToggling = togglingId === pkgId;

                    return (
                      <tr key={pkgId || pkg.name} className="transition-colors hover:bg-gray-50/60">
                        {/* Package Name & Badges */}
                        <td className="px-5 py-3.5">
                          <div className="flex flex-col gap-1 max-w-xs">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold uppercase text-fg">{pkg.name}</span>
                              {pkg.isPopular && (
                                <span className="inline-flex items-center gap-0.5 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                                  <Sparkles className="h-2.5 w-2.5" />
                                  Popular
                                </span>
                              )}
                              {pkg.badgeText && (
                                <span className="rounded-full bg-cream px-2 py-0.5 text-[10px] font-semibold text-fg">
                                  {pkg.badgeText}
                                </span>
                              )}
                            </div>
                            <p className="text-gray-500 text-[11px] line-clamp-1">{pkg.tagline}</p>
                          </div>
                        </td>

                        {/* Price */}
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          {pkg.isCustomPrice ? (
                            <span className="font-bold text-fg">{pkg.customPriceLabel || "Custom"}</span>
                          ) : (
                            <span className="font-bold text-fg">
                              ₹{pkg.price ?? 0}
                              <span className="text-[11px] font-normal text-gray-400 ml-1">
                                {pkg.billingCycle || "/mo"}
                              </span>
                            </span>
                          )}
                        </td>

                        {/* Features Count & Preview */}
                        <td className="px-5 py-3.5">
                          <div className="max-w-xs">
                            <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-700">
                              {pkg.features?.length || 0} Features
                            </span>
                            <p className="mt-1 text-[11px] text-gray-500 truncate">
                              {(pkg.features || []).join(", ")}
                            </p>
                          </div>
                        </td>

                        {/* Display Order */}
                        <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap font-medium">
                          #{pkg.displayOrder ?? 1}
                        </td>

                        {/* Status */}
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <div className="relative inline-flex items-center">
                            <select
                              value={pkg.status || (pkg.isActive ? "ACTIVE" : "SUSPENDED")}
                              onChange={(e) => handleStatusChange(pkg, e.target.value)}
                              disabled={isToggling}
                              className={`rounded-lg border px-2.5 py-1 text-xs font-semibold focus:outline-hidden transition-colors cursor-pointer ${
                                (pkg.status || (pkg.isActive ? "ACTIVE" : "SUSPENDED")) === "ACTIVE"
                                  ? "border-emerald-200 bg-emerald-50 text-emerald-700 focus:border-emerald-500"
                                  : (pkg.status || "") === "REJECTED"
                                  ? "border-rose-200 bg-rose-50 text-rose-700 focus:border-rose-500"
                                  : "border-amber-200 bg-amber-50 text-amber-700 focus:border-amber-500"
                              } disabled:opacity-50`}
                            >
                              <option value="ACTIVE">ACTIVE</option>
                              <option value="REJECTED">REJECTED</option>
                              <option value="SUSPENDED">SUSPENDED</option>
                            </select>
                            {isToggling && (
                              <Loader2 className="ml-1.5 h-3.5 w-3.5 animate-spin text-gray-500" />
                            )}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-3.5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedPackage(pkg);
                                setViewModalOpen(true);
                              }}
                              className="rounded-lg p-1.5 text-gray-500 hover:bg-cream hover:text-primary"
                              title="View package details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleOpenEditModal(pkg)}
                              className="rounded-lg p-1.5 text-gray-500 hover:bg-cream hover:text-primary"
                              title="Edit package"
                            >
                              <Edit className="h-4 w-4" />
                            </button>

                            {/* <button
                              type="button"
                              onClick={() => handleToggleStatus(pkg)}
                              disabled={isToggling}
                              className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition-colors ${
                                pkg.isActive
                                  ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
                                  : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                              }`}
                              title={pkg.isActive ? "Deactivate package" : "Activate package"}
                            >
                              {isToggling ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : pkg.isActive ? (
                                "Deactivate"
                              ) : (
                                "Activate"
                              )}
                            </button> */}

                            <button
                              type="button"
                              onClick={() => handleDelete(pkgId)}
                              disabled={isDeleting}
                              className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
                              title="Delete package"
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
                  })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {filteredPackages.length > pageSize && (
          <div className="flex flex-col items-center justify-between gap-3 border-t border-border px-5 py-3 sm:flex-row">
            <span className="text-xs text-gray-500">
              Showing page <span className="font-semibold text-fg">{page}</span> of{" "}
              <span className="font-semibold text-fg">
                {Math.ceil(filteredPackages.length / pageSize)}
              </span>{" "}
              ({filteredPackages.length} total)
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
                onClick={() =>
                  setPage((p) =>
                    Math.min(Math.ceil(filteredPackages.length / pageSize), p + 1)
                  )
                }
                disabled={
                  page >= Math.ceil(filteredPackages.length / pageSize) || loading
                }
                className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-fg hover:bg-gray-50 disabled:opacity-50"
              >
                Next
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* View Package Details Modal */}
      {viewModalOpen && selectedPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 sm:p-6 backdrop-blur-xs animate-fade-in">
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Package className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold uppercase text-fg">{selectedPackage.name}</h3>
                  <p className="text-xs text-gray-500">{selectedPackage.tagline}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewModalOpen(false)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-fg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 space-y-4 text-xs">
              {/* Badges & Status */}
              <div className="flex items-center justify-between rounded-xl border border-border bg-gray-50/50 p-3">
                <div>
                  <span className="text-gray-400 font-medium">Pricing</span>
                  <p className="font-bold text-fg text-sm mt-0.5">
                    {selectedPackage.isCustomPrice
                      ? selectedPackage.customPriceLabel || "Custom"
                      : `₹${selectedPackage.price ?? 0} ${selectedPackage.billingCycle || "/mo"}`}
                  </p>
                </div>
                <div>
                  <span className="text-gray-400 font-medium">Status</span>
                  <div className="mt-0.5">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        selectedPackage.isActive
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {selectedPackage.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Details List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between border-b border-border/50 py-2">
                  <span className="text-gray-500">Order Priority</span>
                  <span className="font-semibold text-fg">#{selectedPackage.displayOrder ?? 1}</span>
                </div>

                <div className="flex items-center justify-between border-b border-border/50 py-2">
                  <span className="text-gray-500">Button Text</span>
                  <span className="font-semibold text-fg">{selectedPackage.buttonText || "Get Started"}</span>
                </div>

                {selectedPackage.badgeText && (
                  <div className="flex items-center justify-between border-b border-border/50 py-2">
                    <span className="text-gray-500">Badge Text</span>
                    <span className="font-semibold text-fg">{selectedPackage.badgeText}</span>
                  </div>
                )}

                <div className="flex items-center justify-between border-b border-border/50 py-2">
                  <span className="text-gray-500">Popular Highlight</span>
                  <span className="font-semibold text-fg">{selectedPackage.isPopular ? "Yes" : "No"}</span>
                </div>
              </div>

              {/* Features List */}
              <div>
                <p className="font-bold text-gray-400 uppercase tracking-wider text-[11px] mb-2">
                  Included Features ({selectedPackage.features?.length || 0})
                </p>
                <ul className="space-y-1.5 rounded-xl border border-border bg-gray-50/30 p-3">
                  {(selectedPackage.features || []).map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-fg">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Close Button */}
              <div className="flex justify-end pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setViewModalOpen(false)}
                  className="rounded-lg bg-primary px-4 py-1.5 font-semibold text-white hover:bg-primary-light"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Package Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4 sm:p-6 backdrop-blur-xs animate-fade-in">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-white p-6 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Package className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-fg">
                    {editingPackageId ? "Edit Package" : "Add New Package"}
                  </h2>
                  <p className="text-xs text-gray-500">
                    {editingPackageId
                      ? "Update package details, pricing, and features."
                      : "Fill in package details and features."}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                disabled={actionLoading}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-fg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              {/* Package Name */}
              <div>
                <label htmlFor={nameInputId} className="flex items-center justify-between text-xs font-bold text-fg">
                  <span>Package Name *</span>
                  <span className="text-[10px] text-gray-400 font-normal">Auto-uppercased</span>
                </label>
                <input
                  id={nameInputId}
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value.toUpperCase() }))}
                  placeholder="e.g. STARTER GUEST POSTS"
                  className={`mt-1 w-full rounded-lg border px-3 py-2 text-xs uppercase text-fg focus:border-primary focus:outline-hidden ${
                    formErrors.name ? "border-red-500" : "border-border"
                  }`}
                />
                {formErrors.name && (
                  <p className="mt-1 text-[11px] text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {formErrors.name}
                  </p>
                )}
              </div>

              {/* Tagline */}
              <div>
                <label htmlFor={taglineInputId} className="block text-xs font-bold text-fg">
                  Tagline *
                </label>
                <input
                  id={taglineInputId}
                  type="text"
                  required
                  value={formData.tagline}
                  onChange={(e) => setFormData((prev) => ({ ...prev, tagline: e.target.value }))}
                  placeholder="e.g. Ideal for individuals and startups wanting clean backlinks"
                  className={`mt-1 w-full rounded-lg border px-3 py-2 text-xs text-fg focus:border-primary focus:outline-hidden ${
                    formErrors.tagline ? "border-red-500" : "border-border"
                  }`}
                />
                {formErrors.tagline && (
                  <p className="mt-1 text-[11px] text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {formErrors.tagline}
                  </p>
                )}
              </div>

              {/* Price & Custom Pricing Grid */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor={priceInputId} className="text-xs font-bold text-fg">
                      Price ($) {!formData.isCustomPrice && "*"}
                    </label>
                    <label htmlFor={customPriceCheckId} className="flex items-center gap-1.5 cursor-pointer text-[11px] text-primary font-medium">
                      <input
                        id={customPriceCheckId}
                        type="checkbox"
                        checked={formData.isCustomPrice}
                        onChange={(e) => setFormData((prev) => ({ ...prev, isCustomPrice: e.target.checked }))}
                        className="rounded border-border text-primary focus:ring-primary h-3.5 w-3.5"
                      />
                      Custom Price
                    </label>
                  </div>
                  <input
                    id={priceInputId}
                    type="number"
                    min="0"
                    step="any"
                    disabled={formData.isCustomPrice}
                    value={formData.price}
                    onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                    placeholder={formData.isCustomPrice ? "N/A (Custom)" : "49"}
                    className={`mt-1 w-full rounded-lg border px-3 py-2 text-xs text-fg focus:border-primary focus:outline-hidden disabled:bg-gray-50 disabled:text-gray-400 ${
                      formErrors.price ? "border-red-500" : "border-border"
                    }`}
                  />
                  {formErrors.price && (
                    <p className="mt-1 text-[11px] text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {formErrors.price}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor={customPriceLabelId} className="block text-xs font-bold text-fg">
                    Custom Price Label
                  </label>
                  <input
                    id={customPriceLabelId}
                    type="text"
                    disabled={!formData.isCustomPrice}
                    value={formData.customPriceLabel}
                    onChange={(e) => setFormData((prev) => ({ ...prev, customPriceLabel: e.target.value }))}
                    placeholder="Custom / Contact Us"
                    className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-xs text-fg focus:border-primary focus:outline-hidden disabled:bg-gray-50 disabled:text-gray-400"
                  />
                </div>
              </div>

              {/* Billing Cycle & Button Text */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor={billingCycleId} className="block text-xs font-bold text-fg">
                    Billing Cycle
                  </label>
                  <input
                    id={billingCycleId}
                    type="text"
                    value={formData.billingCycle}
                    onChange={(e) => setFormData((prev) => ({ ...prev, billingCycle: e.target.value }))}
                    placeholder="/mo or one-time"
                    className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-xs text-fg focus:border-primary focus:outline-hidden"
                  />
                </div>

                <div>
                  <label htmlFor={buttonTextId} className="block text-xs font-bold text-fg">
                    Button Text
                  </label>
                  <input
                    id={buttonTextId}
                    type="text"
                    value={formData.buttonText}
                    onChange={(e) => setFormData((prev) => ({ ...prev, buttonText: e.target.value }))}
                    placeholder="Get Started"
                    className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-xs text-fg focus:border-primary focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Features List Field */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-fg">
                    Features List * (At least 1)
                  </label>
                  <button
                    type="button"
                    onClick={addFeatureInput}
                    className="flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
                  >
                    <Plus className="h-3 w-3" />
                    Add Another Feature
                  </button>
                </div>
                <div className="mt-2 space-y-2 max-h-48 overflow-y-auto pr-1">
                  {formData.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={feat}
                        onChange={(e) => handleFeatureChange(idx, e.target.value)}
                        placeholder={`Feature #${idx + 1} (e.g. 5 guest posts on DR 50+ websites)`}
                        className="flex-1 rounded-lg border border-border px-3 py-2 text-xs text-fg focus:border-primary focus:outline-hidden"
                      />
                      {formData.features.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFeatureInput(idx)}
                          className="rounded-lg border border-border p-2 text-gray-400 hover:border-red-200 hover:text-red-500"
                          title="Remove feature"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {formErrors.features && (
                  <p className="mt-1 text-[11px] text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {formErrors.features}
                  </p>
                )}
              </div>

              {/* Badge Text & Display Order */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor={badgeTextId} className="block text-xs font-bold text-fg">
                    Badge Text (Optional)
                  </label>
                  <input
                    id={badgeTextId}
                    type="text"
                    value={formData.badgeText}
                    onChange={(e) => setFormData((prev) => ({ ...prev, badgeText: e.target.value }))}
                    placeholder="e.g. Best Value / Limited"
                    className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-xs text-fg focus:border-primary focus:outline-hidden"
                  />
                </div>

                <div>
                  <label htmlFor={displayOrderId} className="block text-xs font-bold text-fg">
                    Display Order
                  </label>
                  <input
                    id={displayOrderId}
                    type="number"
                    min="1"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData((prev) => ({ ...prev, displayOrder: e.target.value }))}
                    className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-xs text-fg focus:border-primary focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Checkboxes: isPopular & isActive */}
              <div className="flex flex-wrap items-center gap-6 rounded-xl border border-border bg-gray-50/50 p-3">
                <label htmlFor={popularCheckId} className="flex items-center gap-2 cursor-pointer text-xs font-medium text-fg">
                  <input
                    id={popularCheckId}
                    type="checkbox"
                    checked={formData.isPopular}
                    onChange={(e) => setFormData((prev) => ({ ...prev, isPopular: e.target.checked }))}
                    className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                  />
                  Mark as Most Popular
                </label>

                <label htmlFor={activeCheckId} className="flex items-center gap-2 cursor-pointer text-xs font-medium text-fg">
                  <input
                    id={activeCheckId}
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
                    className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                  />
                  Active & Visible to Users
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={actionLoading}
                  className="rounded-lg border border-border px-4 py-2 text-xs font-semibold text-fg hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-primary-light disabled:opacity-50"
                >
                  {actionLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  {editingPackageId ? "Update Package" : "Save Package"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPackages;
