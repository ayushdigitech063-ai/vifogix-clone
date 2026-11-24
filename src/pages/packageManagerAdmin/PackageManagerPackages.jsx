// src/pages/packageManagerAdmin/PackageManagerPackages.jsx
import { useState, useEffect, useId } from "react";
import {
  Package,
  Loader2,
  X,
  ArrowLeft,
  Trash2,
  Plus,
} from "lucide-react";
import { useNavigate, useParams, Link } from "react-router-dom";
import PageHeader from "../../components/admin/layout/PageHeader";
import {
  getPackageManagerPackages,
  updatePackageManagerPackage,
} from "../../services/packageManagerService";
import { updatePackageSchema } from "../../schemas/package.schema";
import { useToast } from "../../hooks/useToast";

const initialActivityState = {
  name: "",
  monthlyQty: 10,
  unitAddOn: 1.0,
  allowAddOn: true,
};

const initialFormState = {
  name: "",
  tagline: "",
  price: "",
  isCustomPrice: false,
  customPriceLabel: "Custom",
  billingCycle: "/mo",
  features: [""],
  seoActivities: [
    { name: "Web 2.0 Blog Post", monthlyQty: 20, unitAddOn: 3.0, allowAddOn: true },
    { name: "Article Submission", monthlyQty: 20, unitAddOn: 2.0, allowAddOn: true },
    { name: "Business Listing", monthlyQty: 20, unitAddOn: 2.0, allowAddOn: true },
    { name: "Social Profile", monthlyQty: 10, unitAddOn: 1.5, allowAddOn: true },
    { name: "Social Sharing", monthlyQty: 10, unitAddOn: 1.0, allowAddOn: true },
  ],
  isPopular: false,
  badgeText: "",
  buttonText: "Get Started",
  displayOrder: 1,
  isActive: true,
};

const PackageManagerPackages = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const { id: editPackageId } = useParams();

  
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState({});

  // Load package details to edit
  useEffect(() => {
    if (!editPackageId) {
      navigate("/package-manager/packages");
      return;
    }

    const loadPackage = async () => {
      setLoading(true);
      try {
        const res = await getPackageManagerPackages();
        const list =
          res?.data?.packages ||
          res?.packages ||
          (Array.isArray(res?.data) ? res.data : []) ||
          (Array.isArray(res) ? res : []);
        const found = list.find((p) => (p._id || p.id) === editPackageId);
        if (found) {
          setFormData({
            name: found.name || "",
            tagline: found.tagline || "",
            price: found.price !== undefined ? String(found.price) : "",
            isCustomPrice: Boolean(found.isCustomPrice),
            customPriceLabel: found.customPriceLabel || "Custom",
            billingCycle: found.billingCycle || "/mo",
            features:
              found.features && found.features.length > 0 ? [...found.features] : [""],
            seoActivities:
              found.seoActivities && found.seoActivities.length > 0
                ? found.seoActivities
                : initialFormState.seoActivities,
            isPopular: Boolean(found.isPopular),
            badgeText: found.badgeText || "",
            buttonText: found.buttonText || "Get Started",
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
  }, [editPackageId, navigate, toast]);

  // Features list handlers
  const handleFeatureChange = (index, val) => {
    const updated = [...formData.features];
    updated[index] = val;
    setFormData((prev) => ({ ...prev, features: updated }));
  };

  const handleAddFeature = () => {
    setFormData((prev) => ({ ...prev, features: [...prev.features, ""] }));
  };

  const handleRemoveFeature = (index) => {
    const updated = formData.features.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      features: updated.length ? updated : [""],
    }));
  };

  // SEO Activities handlers
  const handleActivityChange = (index, field, value) => {
    const updated = [...formData.seoActivities];
    updated[index] = { ...updated[index], [field]: value };
    setFormData((prev) => ({ ...prev, seoActivities: updated }));
  };

  const handleAddActivity = () => {
    setFormData((prev) => ({
      ...prev,
      seoActivities: [...prev.seoActivities, { ...initialActivityState }],
    }));
  };

  const handleRemoveActivity = (index) => {
    setFormData((prev) => ({
      ...prev,
      seoActivities: prev.seoActivities.filter((_, i) => i !== index),
    }));
  };

  // Calculation for total monthly links
  const totalMonthlyLinks = formData.seoActivities.reduce(
    (acc, curr) => acc + (Number(curr.monthlyQty) || 0),
    0
  );

  // Submit edit form
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setFormErrors({});

    const cleanFeatures = formData.features
      .map((f) => (typeof f === "string" ? f.trim() : ""))
      .filter(Boolean);

    const payload = {
      name: formData.name.trim(),
      tagline: formData.tagline.trim(),
      isCustomPrice: formData.isCustomPrice,
      customPriceLabel: formData.isCustomPrice ? formData.customPriceLabel.trim() : undefined,
      price: formData.isCustomPrice ? 0 : Number(formData.price) || 0,
      billingCycle: formData.billingCycle.trim() || "/mo",
      features: cleanFeatures,
      seoActivities: formData.seoActivities,
      isPopular: formData.isPopular,
      badgeText: formData.badgeText.trim() || undefined,
      buttonText: formData.buttonText.trim() || "Get Started",
      displayOrder: Number(formData.displayOrder) || 1,
      isActive: formData.isActive,
    };

    const validation = updatePackageSchema.safeParse(payload);
    if (!validation.success) {
      const fieldErrors = {};
      validation.error.errors.forEach((err) => {
        const path = err.path[0] || "general";
        fieldErrors[path] = err.message;
      });
      setFormErrors(fieldErrors);
      toast.error("Please resolve validation errors before saving.");
      return;
    }

    setActionLoading(true);
    try {
      await updatePackageManagerPackage(editPackageId, validation.data);
      toast.success("Package updated successfully!");
      navigate("/package-manager/packages");
    } catch (err) {
      toast.error(err.message || "Failed to save package.");
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
        title="Edit Package"
        description="Update pricing, specifications, and SEO activities for this package."
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
    </div>
  );
};

export default PackageManagerPackages;
