// src/pages/dashboard/PressReleaseListing.jsx
import { useState, useEffect, useCallback, useId } from "react";
import {
  Newspaper,
  Plus,
  RefreshCw,
  Search,
  Eye,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Globe,
  X,
  Clock,
} from "lucide-react";
import {
  getMyPressReleases,
  addPressRelease,
  getMyPressReleaseById,
  deleteMyPressRelease,
} from "../../services/pressReleaseService";
import {
  getMainCategories,
  getSubCategoriesByCategory,
} from "../../services/websiteService";
import { createPressReleaseSchema } from "../../schemas/pressRelease.schema";
import { useToast } from "../../hooks/useToast";

const statuses = [
  { value: "ALL", label: "All Statuses" },
  { value: "ACTIVE", label: "Active" },
  { value: "PENDING_VERIFICATION", label: "Pending Verification" },
  { value: "REJECTED", label: "Rejected" },
  { value: "SUSPENDED", label: "Suspended" },
];

const initialForm = {
  title: "",
  packageDescription: "",
  image: "",
  outletDomain: "",
  outletsCount: 1,
  included: [""],
  excluded: [""],
  category: "",
  subCategories: [],
  country: "United States",
  otherCountriesCount: 0,
  language: "English",
  mozDA: "",
  ahrefsDR: "",
  semrushAS: "",
  monthlyTraffic: "",
  estimatedReach: "",
  maxWordsAllowed: 500,
  extraWordPricePer100: 0,
  maxLinksAllowed: 3,
  linkType: "NoFollow",
  maxImagesAllowed: 2,
  hasSponsoredTag: true,
  price: "",
  isPrWritingAvailable: false,
  prWritingPrice: 0,
  turnaroundDays: 2,
};

const PressReleaseListing = () => {
  const toast = useToast();

  const titleId = useId();
  const descId = useId();
  const imageId = useId();
  const domainId = useId();
  const outletsCountId = useId();
  const categoryId = useId();
  const countryId = useId();
  const otherCountriesId = useId();
  const languageId = useId();
  const mozDAId = useId();
  const ahrefsDRId = useId();
  const semrushASId = useId();
  const monthlyTrafficId = useId();
  const estimatedReachId = useId();
  const maxWordsId = useId();
  const extraWordsPriceId = useId();
  const maxLinksId = useId();
  const linkTypeId = useId();
  const maxImagesId = useId();
  const sponsoredCheckId = useId();
  const priceId = useId();
  const prWritingCheckId = useId();
  const prWritingPriceId = useId();
  const turnaroundId = useId();

  const [pressReleases, setPressReleases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Filters & Pagination
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Add PR Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState(initialForm);
  const [formErrors, setFormErrors] = useState({});

  // Dynamic Categories & Subcategories
  const [categoriesList, setCategoriesList] = useState([]);
  const [subCategoriesList, setSubCategoriesList] = useState([]);
  const [loadingSubCats, setLoadingSubCats] = useState(false);

  // View Details Modal State
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedPR, setSelectedPR] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);

  // Fetch Press Releases
  const fetchPRs = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (statusFilter !== "ALL") params.status = statusFilter;

      const res = await getMyPressReleases(params);
      const list =
        res?.data?.pressReleases ||
        res?.data?.data ||
        res?.data ||
        (Array.isArray(res) ? res : []);
      setPressReleases(Array.isArray(list) ? list : []);
    } catch (err) {
      toast.error(err.message || "Failed to load press releases.");
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, toast]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        const params = {};
        if (search.trim()) params.search = search.trim();
        if (statusFilter !== "ALL") params.status = statusFilter;

        const res = await getMyPressReleases(params);
        if (!active) return;
        const list =
          res?.data?.pressReleases ||
          res?.data?.data ||
          res?.data ||
          (Array.isArray(res) ? res : []);
        setPressReleases(Array.isArray(list) ? list : []);
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
  }, [search, statusFilter, toast]);

  // Load Main Categories on Mount
  useEffect(() => {
    let active = true;
    getMainCategories()
      .then((cats) => {
        if (active && Array.isArray(cats)) {
          setCategoriesList(cats);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  // Fetch Subcategories on Category Change
  const handleCategorySelect = async (categoryName) => {
    setFormData((prev) => ({
      ...prev,
      category: categoryName,
      subCategories: [],
    }));
    if (!categoryName) {
      setSubCategoriesList([]);
      return;
    }
    try {
      setLoadingSubCats(true);
      const subs = await getSubCategoriesByCategory(categoryName);
      setSubCategoriesList(Array.isArray(subs) ? subs : []);
    } catch {
      setSubCategoriesList([]);
    } finally {
      setLoadingSubCats(false);
    }
  };

  const handleSubCategoryToggle = (sub) => {
    setFormData((prev) => {
      const exists = prev.subCategories.includes(sub);
      return {
        ...prev,
        subCategories: exists
          ? prev.subCategories.filter((s) => s !== sub)
          : [...prev.subCategories, sub],
      };
    });
  };

  // Dynamic Array Handlers: Included & Excluded
  const handleArrayItemChange = (field, index, value) => {
    setFormData((prev) => {
      const copy = [...prev[field]];
      copy[index] = value;
      return { ...prev, [field]: copy };
    });
  };

  const addArrayItem = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData((prev) => {
      if (prev[field].length <= 1) return { ...prev, [field]: [""] };
      return {
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index),
      };
    });
  };

  // Open Details Modal
  const handleViewPR = async (pr) => {
    const prId = pr._id || pr.id;
    setSelectedPR(pr);
    setViewModalOpen(true);

    if (prId) {
      try {
        setViewLoading(true);
        const res = await getMyPressReleaseById(prId);
        const fullData = res?.data?.pressRelease || res?.data || pr;
        setSelectedPR(fullData);
      } catch {
        // Fallback to table row item
      } finally {
        setViewLoading(false);
      }
    }
  };

  // Delete PR
  const handleDeletePR = async (prId) => {
    if (!window.confirm("Are you sure you want to remove this press release?")) return;

    try {
      setDeletingId(prId);
      await deleteMyPressRelease(prId);
      setPressReleases((prev) => prev.filter((p) => (p._id || p.id) !== prId));
      toast.success("Press release deleted successfully.", "Removed");
    } catch (err) {
      toast.error(err.message || "Failed to delete press release.");
    } finally {
      setDeletingId(null);
    }
  };

  // Open Add PR Form Modal
  const handleOpenAddModal = () => {
    setFormData(initialForm);
    setFormErrors({});
    setIsAddModalOpen(true);
  };

  // Submit Add PR Form
  const handleSubmitPR = async (e) => {
    e.preventDefault();
    setFormErrors({});

    const cleanIncluded = formData.included.map((s) => s.trim()).filter(Boolean);
    const cleanExcluded = formData.excluded.map((s) => s.trim()).filter(Boolean);

    const payload = {
      title: formData.title.trim(),
      packageDescription: formData.packageDescription.trim(),
      image: formData.image?.trim() || null,
      outletDomain: formData.outletDomain?.trim() || null,
      outletsCount: Number(formData.outletsCount) || 1,
      included: cleanIncluded,
      excluded: cleanExcluded,
      category: formData.category,
      subCategories: formData.subCategories,
      country: formData.country.trim(),
      otherCountriesCount: Number(formData.otherCountriesCount) || 0,
      language: formData.language.trim() || "English",
      mozDA: formData.mozDA === "" || formData.mozDA === null ? null : Number(formData.mozDA),
      ahrefsDR: formData.ahrefsDR === "" || formData.ahrefsDR === null ? null : Number(formData.ahrefsDR),
      semrushAS: formData.semrushAS === "" || formData.semrushAS === null ? null : Number(formData.semrushAS),
      monthlyTraffic: formData.monthlyTraffic?.trim() || null,
      estimatedReach: formData.estimatedReach?.trim() || null,
      maxWordsAllowed: Number(formData.maxWordsAllowed) || 500,
      extraWordPricePer100: Number(formData.extraWordPricePer100) || 0,
      maxLinksAllowed: Number(formData.maxLinksAllowed) || 3,
      linkType: formData.linkType || "NoFollow",
      maxImagesAllowed: Number(formData.maxImagesAllowed) >= 0 ? Number(formData.maxImagesAllowed) : 2,
      hasSponsoredTag: Boolean(formData.hasSponsoredTag),
      price: Number(formData.price),
      isPrWritingAvailable: Boolean(formData.isPrWritingAvailable),
      prWritingPrice: formData.isPrWritingAvailable ? Number(formData.prWritingPrice) || 0 : 0,
      turnaroundDays: Number(formData.turnaroundDays) || 2,
    };

    // Client-side Zod validation
    const validation = createPressReleaseSchema.safeParse(payload);
    if (!validation.success) {
      const fieldErrors = {};
      validation.error.issues.forEach((issue) => {
        const fieldName = issue.path[0];
        if (fieldName && !fieldErrors[fieldName]) {
          fieldErrors[fieldName] = issue.message;
        }
      });
      setFormErrors(fieldErrors);
      toast.error("Please correct the highlighted fields.", "Validation Error");
      return;
    }

    try {
      setActionLoading(true);
      const res = await addPressRelease(payload);
      const created = res?.data?.pressRelease || res?.data || payload;
      setPressReleases((prev) => [created, ...prev]);
      toast.success(res?.message || "Press release created successfully!", "Success");
      setIsAddModalOpen(false);
      fetchPRs();
    } catch (err) {
      toast.error(err.message || "Failed to submit press release.", "Submission Failed");
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (st) => {
    const s = String(st || "PENDING_VERIFICATION").toUpperCase();
    switch (s) {
      case "ACTIVE":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
            <CheckCircle2 className="h-3 w-3" />
            Active
          </span>
        );
      case "PENDING_VERIFICATION":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700">
            <Clock className="h-3 w-3" />
            Pending Verification
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-[11px] font-semibold text-rose-700">
            <XCircle className="h-3 w-3" />
            Rejected
          </span>
        );
      case "SUSPENDED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-semibold text-gray-600">
            <AlertCircle className="h-3 w-3" />
            Suspended
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-700">
            {s}
          </span>
        );
    }
  };

  // Filtered PRs
  const filteredPRs = pressReleases.filter((pr) => {
    const titleMatch = pr.title?.toLowerCase().includes(search.toLowerCase());
    const domainMatch = pr.outletDomain?.toLowerCase().includes(search.toLowerCase());
    const catMatch = pr.category?.toLowerCase().includes(search.toLowerCase());
    const matchesSearch = !search || titleMatch || domainMatch || catMatch;

    const matchesStatus =
      statusFilter === "ALL" ||
      String(pr.status || "PENDING_VERIFICATION").toUpperCase() === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-fg">Press Releases</h1>
          <p className="mt-1 text-xs text-gray-500">
            Manage your media outlet packages, publishing specifications, and distribution deals.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchPRs}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-2 text-xs font-semibold text-fg hover:border-primary hover:text-primary disabled:opacity-50"
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
            Add Press Release
          </button>
        </div>
      </div>

      {/* Filter Bar */}
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
            placeholder="Search by title, domain or category..."
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
        ) : filteredPRs.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center p-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cream text-primary">
              <Newspaper className="h-6 w-6" />
            </div>
            <h3 className="mt-3 text-base font-bold text-fg">No Press Releases Found</h3>
            <p className="mt-1 max-w-sm text-xs text-gray-500">
              {search || statusFilter !== "ALL"
                ? "No press releases match your filter criteria."
                : "You haven't added any press release listings yet."}
            </p>
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="mt-4 flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-primary-light"
            >
              <Plus className="h-4 w-4" />
              Add First Press Release
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-gray-50/75 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-5 py-3">Outlet / Title</th>
                  <th className="px-5 py-3">Category</th>
                  <th className="px-5 py-3">Metrics (DA/DR)</th>
                  <th className="px-5 py-3">Price</th>
                  <th className="px-5 py-3">Turnaround</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredPRs
                  .slice((page - 1) * pageSize, page * pageSize)
                  .map((pr) => {
                    const prId = pr._id || pr.id;
                    const isDeleting = deletingId === prId;

                    return (
                      <tr key={prId} className="transition-colors hover:bg-gray-50/60">
                        {/* Title & Domain */}
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
                                    <span className="font-medium text-primary">
                                      (+{pr.outletsCount} outlets)
                                    </span>
                                  )}
                                </p>
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

                        {/* SEO Metrics */}
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-[11px]">
                            <span className="font-semibold text-fg">DA: {pr.mozDA ?? "—"}</span>
                            <span className="text-gray-300">|</span>
                            <span className="font-semibold text-fg">DR: {pr.ahrefsDR ?? "—"}</span>
                          </div>
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

                        {/* Turnaround */}
                        <td className="px-5 py-3.5 whitespace-nowrap text-gray-500">
                          {pr.turnaroundDays ? `${pr.turnaroundDays} Days` : "2 Days"}
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
                              title="View PR details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeletePR(prId)}
                              disabled={isDeleting}
                              className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
                              title="Delete PR"
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

        {/* Pagination */}
        {filteredPRs.length > pageSize && (
          <div className="flex flex-col items-center justify-between gap-3 border-t border-border px-5 py-3 sm:flex-row">
            <span className="text-xs text-gray-500">
              Showing page <span className="font-semibold text-fg">{page}</span> of{" "}
              <span className="font-semibold text-fg">
                {Math.ceil(filteredPRs.length / pageSize)}
              </span>{" "}
              ({filteredPRs.length} total)
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
                    Math.min(Math.ceil(filteredPRs.length / pageSize), p + 1)
                  )
                }
                disabled={page >= Math.ceil(filteredPRs.length / pageSize) || loading}
                className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-fg hover:bg-gray-50 disabled:opacity-50"
              >
                Next
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Press Release Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4 sm:p-6 backdrop-blur-xs animate-fade-in">
          <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-border bg-white p-6 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Newspaper className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-fg">Add Press Release Package</h2>
                  <p className="text-xs text-gray-500">Provide outlet details, pricing, and distribution rules.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                disabled={actionLoading}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-fg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmitPR} className="mt-5 space-y-5 text-xs">
              {/* Section 1: Basic Identity */}
              <div className="space-y-3">
                <h3 className="font-bold uppercase tracking-wider text-[11px] text-primary">1. Basic PR Identity & Media</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label htmlFor={titleId} className="block font-bold text-fg">
                      Title / Outlet Name *
                    </label>
                    <input
                      id={titleId}
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g. Yahoo Finance & Bloomberg Global Distribution"
                      className={`mt-1 w-full rounded-lg border px-3 py-2 text-fg focus:border-primary focus:outline-hidden ${
                        formErrors.title ? "border-red-500" : "border-border"
                      }`}
                    />
                    {formErrors.title && <p className="mt-1 text-red-500 text-[11px]">{formErrors.title}</p>}
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor={descId} className="block font-bold text-fg">
                      Package Description *
                    </label>
                    <textarea
                      id={descId}
                      rows={3}
                      required
                      value={formData.packageDescription}
                      onChange={(e) => setFormData((prev) => ({ ...prev, packageDescription: e.target.value }))}
                      placeholder="Explain publication details, audience reach, and distribution network..."
                      className={`mt-1 w-full rounded-lg border p-2.5 text-fg focus:border-primary focus:outline-hidden ${
                        formErrors.packageDescription ? "border-red-500" : "border-border"
                      }`}
                    />
                    {formErrors.packageDescription && (
                      <p className="mt-1 text-red-500 text-[11px]">{formErrors.packageDescription}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor={domainId} className="block font-bold text-fg">
                      Outlet Domain (Optional)
                    </label>
                    <input
                      id={domainId}
                      type="text"
                      value={formData.outletDomain}
                      onChange={(e) => setFormData((prev) => ({ ...prev, outletDomain: e.target.value }))}
                      placeholder="finance.yahoo.com"
                      className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-fg focus:border-primary focus:outline-hidden"
                    />
                    {formErrors.outletDomain && (
                      <p className="mt-1 text-red-500 text-[11px]">{formErrors.outletDomain}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor={outletsCountId} className="block font-bold text-fg">
                      Number of Outlets
                    </label>
                    <input
                      id={outletsCountId}
                      type="number"
                      min="1"
                      value={formData.outletsCount}
                      onChange={(e) => setFormData((prev) => ({ ...prev, outletsCount: e.target.value }))}
                      className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-fg focus:border-primary focus:outline-hidden"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor={imageId} className="block font-bold text-fg">
                      Image / Logo URL (Optional)
                    </label>
                    <input
                      id={imageId}
                      type="url"
                      value={formData.image}
                      onChange={(e) => setFormData((prev) => ({ ...prev, image: e.target.value }))}
                      placeholder="https://example.com/logo.png"
                      className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-fg focus:border-primary focus:outline-hidden"
                    />
                    {formErrors.image && <p className="mt-1 text-red-500 text-[11px]">{formErrors.image}</p>}
                  </div>
                </div>
              </div>

              {/* Section 2: Niche & Geography */}
              <div className="space-y-3 border-t border-border/60 pt-4">
                <h3 className="font-bold uppercase tracking-wider text-[11px] text-primary">2. Niche & Geography</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label htmlFor={categoryId} className="block font-bold text-fg">
                      Category *
                    </label>
                    <select
                      id={categoryId}
                      required
                      value={formData.category}
                      onChange={(e) => handleCategorySelect(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-border bg-white px-3 py-2 text-fg focus:border-primary focus:outline-hidden"
                    >
                      <option value="">Select Category</option>
                      {categoriesList.map((c) => {
                        const name = typeof c === "string" ? c : c.name;
                        return (
                          <option key={name} value={name}>
                            {name}
                          </option>
                        );
                      })}
                    </select>
                    {formErrors.category && (
                      <p className="mt-1 text-red-500 text-[11px]">{formErrors.category}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor={countryId} className="block font-bold text-fg">
                      Target Country *
                    </label>
                    <input
                      id={countryId}
                      type="text"
                      required
                      value={formData.country}
                      onChange={(e) => setFormData((prev) => ({ ...prev, country: e.target.value }))}
                      placeholder="United States"
                      className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-fg focus:border-primary focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label htmlFor={otherCountriesId} className="block font-bold text-fg">
                      Other Countries Count
                    </label>
                    <input
                      id={otherCountriesId}
                      type="number"
                      min="0"
                      value={formData.otherCountriesCount}
                      onChange={(e) => setFormData((prev) => ({ ...prev, otherCountriesCount: e.target.value }))}
                      className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-fg focus:border-primary focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label htmlFor={languageId} className="block font-bold text-fg">
                      Language
                    </label>
                    <input
                      id={languageId}
                      type="text"
                      value={formData.language}
                      onChange={(e) => setFormData((prev) => ({ ...prev, language: e.target.value }))}
                      className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-fg focus:border-primary focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Subcategories Selector */}
                {formData.category && (
                  <div className="rounded-xl border border-border bg-gray-50/50 p-3">
                    <p className="font-bold text-fg mb-1.5">
                      Select Subcategories * (Pick at least 1)
                    </p>
                    {loadingSubCats ? (
                      <div className="flex items-center gap-2 text-gray-500 py-2">
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        <span>Loading subcategories...</span>
                      </div>
                    ) : subCategoriesList.length === 0 ? (
                      <p className="text-gray-400">No subcategories defined for this category.</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {subCategoriesList.map((sub) => {
                          const subName = typeof sub === "string" ? sub : sub.name;
                          const selected = formData.subCategories.includes(subName);
                          return (
                            <button
                              key={subName}
                              type="button"
                              onClick={() => handleSubCategoryToggle(subName)}
                              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                                selected
                                  ? "bg-primary text-white"
                                  : "border border-border bg-white text-fg hover:border-primary"
                              }`}
                            >
                              {subName}
                            </button>
                          );
                        })}
                      </div>
                    )}
                    {formErrors.subCategories && (
                      <p className="mt-1 text-red-500 text-[11px]">{formErrors.subCategories}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Section 3: SEO & Publishing Specs */}
              <div className="space-y-3 border-t border-border/60 pt-4">
                <h3 className="font-bold uppercase tracking-wider text-[11px] text-primary">3. SEO & Publishing Specs</h3>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div>
                    <label htmlFor={mozDAId} className="block font-medium text-fg">Moz DA</label>
                    <input
                      id={mozDAId}
                      type="number"
                      min="0"
                      max="100"
                      value={formData.mozDA}
                      onChange={(e) => setFormData((prev) => ({ ...prev, mozDA: e.target.value }))}
                      placeholder="e.g. 75"
                      className="mt-1 w-full rounded-lg border border-border px-2.5 py-1.5 text-fg focus:border-primary focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label htmlFor={ahrefsDRId} className="block font-medium text-fg">Ahrefs DR</label>
                    <input
                      id={ahrefsDRId}
                      type="number"
                      min="0"
                      max="100"
                      value={formData.ahrefsDR}
                      onChange={(e) => setFormData((prev) => ({ ...prev, ahrefsDR: e.target.value }))}
                      placeholder="e.g. 80"
                      className="mt-1 w-full rounded-lg border border-border px-2.5 py-1.5 text-fg focus:border-primary focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label htmlFor={semrushASId} className="block font-medium text-fg">Semrush AS</label>
                    <input
                      id={semrushASId}
                      type="number"
                      min="0"
                      max="100"
                      value={formData.semrushAS}
                      onChange={(e) => setFormData((prev) => ({ ...prev, semrushAS: e.target.value }))}
                      placeholder="e.g. 70"
                      className="mt-1 w-full rounded-lg border border-border px-2.5 py-1.5 text-fg focus:border-primary focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label htmlFor={monthlyTrafficId} className="block font-medium text-fg">Monthly Traffic</label>
                    <input
                      id={monthlyTrafficId}
                      type="text"
                      value={formData.monthlyTraffic}
                      onChange={(e) => setFormData((prev) => ({ ...prev, monthlyTraffic: e.target.value }))}
                      placeholder="e.g. 2.5M"
                      className="mt-1 w-full rounded-lg border border-border px-2.5 py-1.5 text-fg focus:border-primary focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label htmlFor={estimatedReachId} className="block font-medium text-fg">Estimated Reach</label>
                    <input
                      id={estimatedReachId}
                      type="text"
                      value={formData.estimatedReach}
                      onChange={(e) => setFormData((prev) => ({ ...prev, estimatedReach: e.target.value }))}
                      placeholder="e.g. 10M+"
                      className="mt-1 w-full rounded-lg border border-border px-2.5 py-1.5 text-fg focus:border-primary focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div>
                    <label htmlFor={maxWordsId} className="block font-medium text-fg">Max Words</label>
                    <input
                      id={maxWordsId}
                      type="number"
                      min="100"
                      max="5000"
                      value={formData.maxWordsAllowed}
                      onChange={(e) => setFormData((prev) => ({ ...prev, maxWordsAllowed: e.target.value }))}
                      className="mt-1 w-full rounded-lg border border-border px-2.5 py-1.5 text-fg focus:border-primary focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label htmlFor={maxLinksId} className="block font-medium text-fg">Max Links</label>
                    <input
                      id={maxLinksId}
                      type="number"
                      min="1"
                      max="10"
                      value={formData.maxLinksAllowed}
                      onChange={(e) => setFormData((prev) => ({ ...prev, maxLinksAllowed: e.target.value }))}
                      className="mt-1 w-full rounded-lg border border-border px-2.5 py-1.5 text-fg focus:border-primary focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label htmlFor={linkTypeId} className="block font-medium text-fg">Link Type</label>
                    <select
                      id={linkTypeId}
                      value={formData.linkType}
                      onChange={(e) => setFormData((prev) => ({ ...prev, linkType: e.target.value }))}
                      className="mt-1 w-full rounded-lg border border-border bg-white px-2.5 py-1.5 text-fg focus:border-primary focus:outline-hidden"
                    >
                      <option value="NoFollow">NoFollow</option>
                      <option value="DoFollow">DoFollow</option>
                      <option value="Sponsored">Sponsored</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor={maxImagesId} className="block font-medium text-fg">Max Images</label>
                    <input
                      id={maxImagesId}
                      type="number"
                      min="0"
                      max="10"
                      value={formData.maxImagesAllowed}
                      onChange={(e) => setFormData((prev) => ({ ...prev, maxImagesAllowed: e.target.value }))}
                      className="mt-1 w-full rounded-lg border border-border px-2.5 py-1.5 text-fg focus:border-primary focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    id={sponsoredCheckId}
                    type="checkbox"
                    checked={formData.hasSponsoredTag}
                    onChange={(e) => setFormData((prev) => ({ ...prev, hasSponsoredTag: e.target.checked }))}
                    className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                  />
                  <label htmlFor={sponsoredCheckId} className="font-medium text-fg cursor-pointer">
                    Article has Sponsored Tag label
                  </label>
                </div>
              </div>

              {/* Section 4: Pricing & Writing */}
              <div className="space-y-3 border-t border-border/60 pt-4">
                <h3 className="font-bold uppercase tracking-wider text-[11px] text-primary">4. Pricing & Turnaround</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label htmlFor={priceId} className="block font-bold text-fg">
                      Publishing Price ($) *
                    </label>
                    <input
                      id={priceId}
                      type="number"
                      min="5"
                      max="50000"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                      placeholder="e.g. 299"
                      className={`mt-1 w-full rounded-lg border px-3 py-2 text-fg focus:border-primary focus:outline-hidden ${
                        formErrors.price ? "border-red-500" : "border-border"
                      }`}
                    />
                    {formErrors.price && <p className="mt-1 text-red-500 text-[11px]">{formErrors.price}</p>}
                  </div>

                  <div>
                    <label htmlFor={turnaroundId} className="block font-bold text-fg">
                      Turnaround Days
                    </label>
                    <input
                      id={turnaroundId}
                      type="number"
                      min="1"
                      max="30"
                      value={formData.turnaroundDays}
                      onChange={(e) => setFormData((prev) => ({ ...prev, turnaroundDays: e.target.value }))}
                      className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-fg focus:border-primary focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label htmlFor={extraWordsPriceId} className="block font-bold text-fg">
                      Extra Word Price / 100 words ($)
                    </label>
                    <input
                      id={extraWordsPriceId}
                      type="number"
                      min="0"
                      value={formData.extraWordPricePer100}
                      onChange={(e) => setFormData((prev) => ({ ...prev, extraWordPricePer100: e.target.value }))}
                      className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-fg focus:border-primary focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* PR Writing Checkbox */}
                <div className="rounded-xl border border-border bg-gray-50/50 p-3">
                  <label htmlFor={prWritingCheckId} className="flex items-center gap-2 cursor-pointer font-bold text-fg">
                    <input
                      id={prWritingCheckId}
                      type="checkbox"
                      checked={formData.isPrWritingAvailable}
                      onChange={(e) => setFormData((prev) => ({ ...prev, isPrWritingAvailable: e.target.checked }))}
                      className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                    />
                    Provide PR Content Writing Service
                  </label>

                  {formData.isPrWritingAvailable && (
                    <div className="mt-3 max-w-xs">
                      <label htmlFor={prWritingPriceId} className="block font-bold text-fg">
                        PR Writing Price ($) *
                      </label>
                      <input
                        id={prWritingPriceId}
                        type="number"
                        min="1"
                        required
                        value={formData.prWritingPrice}
                        onChange={(e) => setFormData((prev) => ({ ...prev, prWritingPrice: e.target.value }))}
                        placeholder="e.g. 50"
                        className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-fg focus:border-primary focus:outline-hidden"
                      />
                      {formErrors.prWritingPrice && (
                        <p className="mt-1 text-red-500 text-[11px]">{formErrors.prWritingPrice}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Section 5: Included / Excluded Outlets */}
              <div className="space-y-3 border-t border-border/60 pt-4">
                <h3 className="font-bold uppercase tracking-wider text-[11px] text-primary">5. Distribution Outlets (Optional)</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-fg">Guaranteed Outlets (Included)</span>
                      <button
                        type="button"
                        onClick={() => addArrayItem("included")}
                        className="text-primary text-[11px] font-semibold hover:underline"
                      >
                        + Add Outlet
                      </button>
                    </div>
                    <div className="space-y-1.5 max-h-32 overflow-y-auto">
                      {formData.included.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => handleArrayItemChange("included", idx, e.target.value)}
                            placeholder="e.g. Yahoo Finance, AP News"
                            className="flex-1 rounded-lg border border-border px-2.5 py-1.5 text-xs text-fg focus:border-primary focus:outline-hidden"
                          />
                          <button
                            type="button"
                            onClick={() => removeArrayItem("included", idx)}
                            className="text-gray-400 hover:text-red-500 p-1"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-fg">Excluded Outlets / Niches</span>
                      <button
                        type="button"
                        onClick={() => addArrayItem("excluded")}
                        className="text-primary text-[11px] font-semibold hover:underline"
                      >
                        + Add Excluded
                      </button>
                    </div>
                    <div className="space-y-1.5 max-h-32 overflow-y-auto">
                      {formData.excluded.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => handleArrayItemChange("excluded", idx, e.target.value)}
                            placeholder="e.g. Casino, Crypto"
                            className="flex-1 rounded-lg border border-border px-2.5 py-1.5 text-xs text-fg focus:border-primary focus:outline-hidden"
                          />
                          <button
                            type="button"
                            onClick={() => removeArrayItem("excluded", idx)}
                            className="text-gray-400 hover:text-red-500 p-1"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit / Cancel Buttons */}
              <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  disabled={actionLoading}
                  className="rounded-lg border border-border px-4 py-2 font-semibold text-fg hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2 font-semibold text-white shadow-xs hover:bg-primary-light disabled:opacity-50"
                >
                  {actionLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  Create Press Release
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View PR Details Modal */}
      {viewModalOpen && selectedPR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 sm:p-6 backdrop-blur-xs animate-fade-in">
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-3">
                {selectedPR.image ? (
                  <img
                    src={selectedPR.image}
                    alt={selectedPR.title}
                    className="h-10 w-10 rounded-lg object-cover border border-border shrink-0"
                  />
                ) : (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
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
                onClick={() => setViewModalOpen(false)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-fg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {viewLoading ? (
              <div className="flex min-h-[200px] flex-col items-center justify-center p-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span className="mt-2 text-xs text-gray-500">Fetching PR details...</span>
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
                    <span className="text-gray-500">Link Type & Max Links</span>
                    <span className="font-semibold text-fg">
                      {selectedPR.linkType || "NoFollow"} ({selectedPR.maxLinksAllowed ?? 3} allowed)
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
                </div>

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
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PressReleaseListing;
