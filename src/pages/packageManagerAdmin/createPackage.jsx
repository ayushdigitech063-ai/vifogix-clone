// src/pages/packageManagerAdmin/createPackage.jsx
import { useState, useEffect, useId } from "react";
import {
  Package,
  Plus,
  Loader2,
  ArrowLeft,
  Trash2,
} from "lucide-react";
import { useNavigate, useParams, Link } from "react-router-dom";
import PageHeader from "../../components/admin/layout/PageHeader";
import {
  createPackageManagerPackage,
  getPackageManagerPackages,
  updatePackageManagerPackage,
} from "../../services/packageManagerService";
import {
  createPackageManagerPackageSchema,
  updatePackageManagerPackageSchema,
} from "../../schemas/packageManager.schema";
import { useToast } from "../../hooks/useToast";

const initialActivityState = {
  activityName: "",
  monthlyCount: 10,
  unitAddonPrice: 1.0,
  isAddonAllowed: true,
};

const initialFormState = {
  name: "",
  tagline: "",
  price: "",
  isCustomPrice: false,
  customPriceLabel: "Custom",
  billingCycle: "/mo",
  activities: [
    {
      activityName: "Guest Post Outreach",
      monthlyCount: 10,
      unitAddonPrice: 25,
      isAddonAllowed: true,
    },
    {
      activityName: "High DA Editorial Links",
      monthlyCount: 15,
      unitAddonPrice: 15,
      isAddonAllowed: true,
    },
  ],
  isPopular: false,
  badgeText: "",
  displayOrder: 1,
  isActive: true,
};

const CreatePackage = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const { slug: editSlug } = useParams();
  const isEditMode = Boolean(editSlug);

  const nameInputId = useId();
  const taglineInputId = useId();
  const priceInputId = useId();
  const customPriceCheckId = useId();
  const customPriceLabelId = useId();
  const billingCycleId = useId();
  const popularCheckId = useId();
  const badgeTextId = useId();
  const displayOrderId = useId();
  const activeCheckId = useId();

  const [loading, setLoading] = useState(isEditMode);
  const [actionLoading, setActionLoading] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState({});

  // If edit mode, load package details by slug
  useEffect(() => {
    if (!isEditMode) return;

    const loadPackage = async () => {
      setLoading(true);
      try {
        const res = await getPackageManagerPackages();
        const list =
          res?.data?.packages ||
          res?.packages ||
          (Array.isArray(res?.data) ? res.data : []) ||
          (Array.isArray(res) ? res : []);

        const found = list.find((p) => p.slug === editSlug || (p._id || p.id) === editSlug);
        if (found) {
          const rawActivities =
            found.activities && found.activities.length > 0
              ? found.activities
              : found.seoActivities && found.seoActivities.length > 0
              ? found.seoActivities.map((act) => ({
                  activityName: act.name || act.activityName || "",
                  monthlyCount: act.monthlyQty || act.monthlyCount || 1,
                  unitAddonPrice:
                    act.unitAddOn !== undefined ? act.unitAddOn : act.unitAddonPrice || 0,
                  isAddonAllowed:
                    act.allowAddOn !== undefined ? act.allowAddOn : act.isAddonAllowed ?? true,
                }))
              : initialFormState.activities;

          setFormData({
            name: found.name || "",
            tagline: found.tagline || "",
            price:
              found.price !== undefined && found.price !== null
                ? String(found.price)
                : "",
            isCustomPrice: Boolean(found.isCustomPrice),
            customPriceLabel: found.customPriceLabel || "Custom",
            billingCycle: found.billingCycle || "/mo",
            activities: rawActivities.map((act) => ({
              activityName: act.activityName || "",
              monthlyCount: Number(act.monthlyCount) || 1,
              unitAddonPrice: Number(act.unitAddonPrice) || 0,
              isAddonAllowed: Boolean(act.isAddonAllowed),
            })),
            isPopular: Boolean(found.isPopular),
            badgeText: found.badgeText || "",
            displayOrder: found.displayOrder !== undefined ? found.displayOrder : 1,
            isActive: found.isActive !== undefined ? Boolean(found.isActive) : true,
          });
        } else {
          toast.error("Package not found.");
          navigate("/package-manager/packages");
        }
      } catch (err) {
        toast.error(err.message || "Failed to load package details.");
      } finally {
        setLoading(false);
      }
    };

    loadPackage();
  }, [editSlug, isEditMode, navigate, toast]);

  // SEO Activities handlers
  const handleActivityChange = (index, field, value) => {
    const updated = [...formData.activities];
    updated[index] = { ...updated[index], [field]: value };
    setFormData((prev) => ({ ...prev, activities: updated }));
  };

  const handleAddActivity = () => {
    setFormData((prev) => ({
      ...prev,
      activities: [...prev.activities, { ...initialActivityState }],
    }));
  };

  const handleRemoveActivity = (index) => {
    setFormData((prev) => ({
      ...prev,
      activities: prev.activities.filter((_, i) => i !== index),
    }));
  };

  // Calculation for total monthly links
  const totalMonthlyLinks = formData.activities.reduce(
    (acc, curr) => acc + (Number(curr.monthlyCount) || 0),
    0
  );

  // Submit form handler
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setFormErrors({});

    const bodyPayload = {
      name: formData.name.trim(),
      tagline: formData.tagline.trim(),
      isCustomPrice: formData.isCustomPrice,
      customPriceLabel: formData.isCustomPrice ? formData.customPriceLabel.trim() : undefined,
      price: formData.isCustomPrice
        ? null
        : formData.price !== ""
        ? Number(formData.price)
        : undefined,
      billingCycle: formData.billingCycle.trim() || "/mo",
      activities: formData.activities.map((act) => ({
        activityName: act.activityName.trim(),
        monthlyCount: Number(act.monthlyCount) || 0,
        unitAddonPrice: Number(act.unitAddonPrice) || 0,
        isAddonAllowed: Boolean(act.isAddonAllowed),
      })),
      isPopular: formData.isPopular,
      badgeText: formData.badgeText.trim() || null,
      displayOrder: Number(formData.displayOrder) || 1,
      isActive: formData.isActive,
    };

    const targetSchema = isEditMode
      ? updatePackageManagerPackageSchema
      : createPackageManagerPackageSchema;

    const validation = targetSchema.safeParse({ body: bodyPayload });
    if (!validation.success) {
      const fieldErrors = {};
      const issues = validation.error?.issues || validation.error?.errors || [];
      issues.forEach((err) => {
        const path = err.path[1] || err.path[0] || "general";
        if (!fieldErrors[path]) {
          fieldErrors[path] = err.message;
        }
      });
      setFormErrors(fieldErrors);
      toast.error(issues[0]?.message || "Please resolve validation errors before saving.");
      return;
    }

    setActionLoading(true);
    try {
      if (isEditMode) {
        await updatePackageManagerPackage(editSlug, validation.data.body);
        toast.success("Package updated successfully!");
      } else {
        await createPackageManagerPackage(validation.data.body);
        toast.success("Package created successfully!");
      }
      navigate("/package-manager/packages");
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        (isEditMode ? "Failed to update package." : "Failed to create package.");
      toast.error(msg);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          <span className="text-xs font-medium text-gray-500">Loading package details...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEditMode ? "Edit Package" : "Create New Package"}
        description={
          isEditMode
            ? "Update pricing, specifications, and monthly SEO deliverables for this package."
            : "Define a new package tier, pricing, and monthly SEO deliverables."
        }
        icon={Package}
        actions={
          <Link
            to="/package-manager/packages"
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-white px-3.5 py-2 text-xs font-semibold text-fg shadow-sm hover:bg-cream transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Packages
          </Link>
        }
      />

      <form onSubmit={handleSubmitForm} noValidate className="space-y-6">
        {/* Basic Information Card */}
        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-fg border-b border-border pb-3">
            General Information
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor={nameInputId} className="block text-xs font-semibold text-fg">
                Package Name *
              </label>
              <input
                id={nameInputId}
                type="text"
                placeholder="e.g. Enterprise SEO Dominance"
                value={formData.name}
                onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                className={`mt-1.5 w-full rounded-xl border px-3 py-2 text-xs font-medium focus:outline-none ${
                  formErrors.name
                    ? "border-red-500 focus:ring-1 focus:ring-red-500"
                    : "border-border bg-cream/30 focus:border-indigo-500 focus:bg-white"
                }`}
              />
              {formErrors.name && (
                <p className="mt-1 text-[11px] text-red-500">{formErrors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor={displayOrderId} className="block text-xs font-semibold text-fg">
                Display Order
              </label>
              <input
                id={displayOrderId}
                type="number"
                min="1"
                value={formData.displayOrder}
                onChange={(e) => setFormData((p) => ({ ...p, displayOrder: e.target.value }))}
                className={`mt-1.5 w-full rounded-xl border px-3 py-2 text-xs font-medium focus:outline-none ${
                  formErrors.displayOrder
                    ? "border-red-500 focus:ring-1 focus:ring-red-500"
                    : "border-border bg-cream/30 focus:border-indigo-500 focus:bg-white"
                }`}
              />
              {formErrors.displayOrder && (
                <p className="mt-1 text-[11px] text-red-500">{formErrors.displayOrder}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor={taglineInputId} className="block text-xs font-semibold text-fg">
              Tagline / Description *
            </label>
            <input
              id={taglineInputId}
              type="text"
              placeholder="e.g. High-Authority Link Building for Enterprise Brands"
              value={formData.tagline}
              onChange={(e) => setFormData((p) => ({ ...p, tagline: e.target.value }))}
              className={`mt-1.5 w-full rounded-xl border px-3 py-2 text-xs font-medium focus:outline-none ${
                formErrors.tagline
                  ? "border-red-500 focus:ring-1 focus:ring-red-500"
                  : "border-border bg-cream/30 focus:border-indigo-500 focus:bg-white"
              }`}
            />
            {formErrors.tagline && (
              <p className="mt-1 text-[11px] text-red-500">{formErrors.tagline}</p>
            )}
          </div>
        </div>

        {/* Pricing Card */}
        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-fg border-b border-border pb-3">
            Pricing Configuration
          </h3>

          <div className="rounded-xl border border-border bg-cream/20 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <input
                id={customPriceCheckId}
                type="checkbox"
                checked={formData.isCustomPrice}
                onChange={(e) => setFormData((p) => ({ ...p, isCustomPrice: e.target.checked }))}
                className="h-4 w-4 rounded border-border text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor={customPriceCheckId} className="text-xs font-bold text-fg cursor-pointer">
                Custom / Variable Pricing
              </label>
            </div>

            {formData.isCustomPrice ? (
              <div>
                <label htmlFor={customPriceLabelId} className="block text-xs font-semibold text-fg">
                  Custom Price Label
                </label>
                <input
                  id={customPriceLabelId}
                  type="text"
                  placeholder="e.g. Contact Us or Enterprise"
                  value={formData.customPriceLabel}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, customPriceLabel: e.target.value }))
                  }
                  className="mt-1.5 w-full rounded-xl border border-border bg-white px-3 py-2 text-xs font-medium focus:border-indigo-500 focus:outline-none"
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor={priceInputId} className="block text-xs font-semibold text-fg">
                    Base Price (₹) *
                  </label>
                  <input
                    id={priceInputId}
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="e.g. 599"
                    value={formData.price}
                    onChange={(e) => setFormData((p) => ({ ...p, price: e.target.value }))}
                    className={`mt-1.5 w-full rounded-xl border px-3 py-2 text-xs font-medium focus:outline-none ${
                      formErrors.price
                        ? "border-red-500 focus:ring-1 focus:ring-red-500"
                        : "border-border bg-white focus:border-indigo-500"
                    }`}
                  />
                  {formErrors.price && (
                    <p className="mt-1 text-[11px] text-red-500">{formErrors.price}</p>
                  )}
                </div>
                <div>
                  <label htmlFor={billingCycleId} className="block text-xs font-semibold text-fg">
                    Billing Cycle
                  </label>
                  <input
                    id={billingCycleId}
                    type="text"
                    placeholder="e.g. /mo or /one-time"
                    value={formData.billingCycle}
                    onChange={(e) => setFormData((p) => ({ ...p, billingCycle: e.target.value }))}
                    className="mt-1.5 w-full rounded-xl border border-border bg-white px-3 py-2 text-xs font-medium focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Monthly SEO Activities & Add-On Pricing Card */}
        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h3 className="text-base font-bold text-fg">
                Monthly SEO Activities & Add-On Pricing
              </h3>
            </div>
            <button
              type="button"
              onClick={handleAddActivity}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5 text-gray-600" />
              Add Activity
            </button>
          </div>

          {formErrors.activities && (
            <p className="text-xs text-red-500 font-medium">{formErrors.activities}</p>
          )}

          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#f8f9fa] text-xs font-bold text-gray-900 border-b border-gray-200">
                <tr>
                  <th className="py-2.5 px-4 w-12 border-r border-gray-200 font-bold">Sr.</th>
                  <th className="py-2.5 px-4 border-r border-gray-200 font-bold">SEO Activity Name</th>
                  <th className="py-2.5 px-4 w-32 border-r border-gray-200 font-bold">Monthly Qty</th>
                  <th className="py-2.5 px-4 w-36 border-r border-gray-200 font-bold">Unit Add-On (₹)</th>
                  <th className="py-2.5 px-4 w-28 text-center border-r border-gray-200 font-bold">Allow (+)</th>
                  <th className="py-2.5 px-4 w-20 text-center font-bold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {formData.activities.map((act, index) => (
                  <tr key={index} className="hover:bg-gray-50/50">
                    <td className="py-2.5 px-4 font-normal text-gray-800 border-r border-gray-200">{index + 1}</td>
                    <td className="py-2.5 px-4 border-r border-gray-200">
                      <input
                        type="text"
                        placeholder="e.g. Web 2.0 Blog Post"
                        value={act.activityName}
                        onChange={(e) =>
                          handleActivityChange(index, "activityName", e.target.value)
                        }
                        className="w-full rounded-md border border-gray-200 bg-white px-2.5 py-1 text-xs text-gray-800 focus:border-indigo-500 focus:outline-none"
                      />
                    </td>
                    <td className="py-2.5 px-4 border-r border-gray-200">
                      <input
                        type="number"
                        min="1"
                        value={act.monthlyCount}
                        onChange={(e) =>
                          handleActivityChange(index, "monthlyCount", Number(e.target.value))
                        }
                        className="w-full rounded-md border border-gray-200 bg-white px-2.5 py-1 text-xs text-gray-800 focus:border-indigo-500 focus:outline-none"
                      />
                    </td>
                    <td className="py-2.5 px-4 border-r border-gray-200">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={act.unitAddonPrice}
                        onChange={(e) =>
                          handleActivityChange(index, "unitAddonPrice", Number(e.target.value))
                        }
                        className="w-full rounded-md border border-gray-200 bg-white px-2.5 py-1 text-xs text-gray-800 focus:border-indigo-500 focus:outline-none"
                      />
                    </td>
                    <td className="py-2.5 px-4 text-center border-r border-gray-200">
                      <input
                        type="checkbox"
                        checked={act.isAddonAllowed}
                        onChange={(e) =>
                          handleActivityChange(index, "isAddonAllowed", e.target.checked)
                        }
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveActivity(index)}
                        className="inline-flex items-center justify-center text-red-500 hover:text-red-700 cursor-pointer transition-colors"
                        title="Remove activity"
                      >
                        <Trash2 className="h-4 w-4 stroke-[1.75]" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-[#fcefc7] border-t border-amber-200/80 text-xs font-bold text-gray-900">
                <tr>
                  <td colSpan={2} className="py-3 px-4">
                    Total Monthly Links: {totalMonthlyLinks}
                  </td>
                  <td colSpan={4} className="py-3 px-4 text-right">
                    Base Price: ₹{formData.isCustomPrice ? formData.customPriceLabel : formData.price || "0"}{" "}
                    {formData.billingCycle}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Options Card */}
        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-fg border-b border-border pb-3">
            Options & Highlights
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor={badgeTextId} className="block text-xs font-semibold text-fg">
                Badge Text (Optional)
              </label>
              <input
                id={badgeTextId}
                type="text"
                placeholder="e.g. Best Value"
                value={formData.badgeText}
                onChange={(e) => setFormData((p) => ({ ...p, badgeText: e.target.value }))}
                className="mt-1.5 w-full rounded-xl border border-border bg-cream/30 px-3 py-2 text-xs font-medium focus:border-indigo-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-6 pt-6">
              <label htmlFor={popularCheckId} className="flex items-center gap-2 cursor-pointer">
                <input
                  id={popularCheckId}
                  type="checkbox"
                  checked={formData.isPopular}
                  onChange={(e) => setFormData((p) => ({ ...p, isPopular: e.target.checked }))}
                  className="h-4 w-4 rounded border-border text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-xs font-semibold text-fg">Highlight as Popular</span>
              </label>

              <label htmlFor={activeCheckId} className="flex items-center gap-2 cursor-pointer">
                <input
                  id={activeCheckId}
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData((p) => ({ ...p, isActive: e.target.checked }))}
                  className="h-4 w-4 rounded border-border text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-xs font-semibold text-fg">Active / Visible</span>
              </label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Link
            to="/package-manager/packages"
            className="rounded-xl border border-border bg-white px-5 py-2.5 text-xs font-semibold text-fg hover:bg-cream transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={actionLoading}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-700 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {actionLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {isEditMode ? "Update Package" : "Create Package"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePackage;
