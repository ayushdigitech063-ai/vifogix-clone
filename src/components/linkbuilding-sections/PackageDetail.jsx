import { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { jsPDF } from "jspdf";
import {
  Home,
  ChevronRight,
  ShieldCheck,
  Link2,
  Tag,
  CheckCircle2,
  Plus,
  Minus,
  X,
  Calculator,
  TrendingUp,
  Puzzle,
  FileText,
  Zap,
  Headphones,
  Star,
  Loader2,
  AlertCircle,
  ArrowLeft,
  MessageCircle,
  Download,
} from "lucide-react";
import {
  getPublicPackageBySlug,
  calculatePublicPackagePrice,
} from "../../services/packageService";

const BUSINESS_WHATSAPP_NUMBER = "916201533997";

const generateWhatsAppMessage = ({
  packageName,
  selectedActivities,
  selectedAddOns,
  totalMonthlyLinks,
  basePrice,
  addOnPrice,
  updatedPrice,
  billingCycle,
  isCustomPrice,
  customPriceLabel,
}) => {
  const formattedBasePrice = isCustomPrice
    ? customPriceLabel || "Custom"
    : `₹${basePrice}${billingCycle}`;
  const formattedUpdatedPrice =
    isCustomPrice && addOnPrice === 0
      ? customPriceLabel || "Custom"
      : `₹${updatedPrice}${billingCycle}`;

  const activitiesLines =
    selectedActivities.length > 0
      ? selectedActivities.map(
          (act) => `- ${act.activityName}: ${act.qty} links`
        )
      : ["- None"];

  const addOnsSection =
    selectedAddOns.length > 0
      ? [
          "Add-ons:",
          ...selectedAddOns.map(
            (item) =>
              `- ${item.activityName}: ${item.addedQty} links — ₹${item.subtotal}`
          ),
        ]
      : ["Add-ons: None"];

  return [
    `Hi, I'm interested in your SEO package${packageName ? ` (${packageName})` : ""}.`,
    "",
    `Monthly SEO Links: ${totalMonthlyLinks}`,
    `Base Price: ${formattedBasePrice}`,
    "",
    "SEO Activities:",
    ...activitiesLines,
    "",
    ...addOnsSection,
    ...(addOnPrice > 0 ? [`Add-on Price: ₹${addOnPrice}`] : []),
    "",
    `Total Monthly Links: ${totalMonthlyLinks}`,
    `Total Price: ${formattedUpdatedPrice}`,
    "",
    "Please share the next steps.",
  ].join("\n");
};

const PackageDetail = () => {
  const { slug } = useParams();

  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Map of activity key (_id or activityName) -> added extra quantity (number >= 0)
  const [addonQuantities, setAddonQuantities] = useState({});
  const [calculatedPricing, setCalculatedPricing] = useState(null);
  const [calculatingPrice, setCalculatingPrice] = useState(false);

  useEffect(() => {
    let active = true;

    const loadPackage = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getPublicPackageBySlug(slug);
        console.log("ressss", res);
        if (!active) return;
        const data = res?.data?.package || res?.package || res?.data || res;
        if (data) {
          setPkg(data);
        } else {
          setError("Package not found.");
        }
      } catch (err) {
        if (!active) return;
        setError(err.message || "Failed to load package details.");
      } finally {
        if (active) setLoading(false);
      }
    };

    if (slug) {
      loadPackage();
    }

    return () => {
      active = false;
    };
  }, [slug]);

  const activities = useMemo(() => {
    if (!pkg) return [];
    if (Array.isArray(pkg.activities) && pkg.activities.length > 0) {
      return pkg.activities;
    }
    if (Array.isArray(pkg.seoActivities) && pkg.seoActivities.length > 0) {
      return pkg.seoActivities.map((act, idx) => ({
        _id: act._id || `seo-${idx}`,
        activityName: act.name,
        monthlyCount: act.monthlyQty ?? 0,
        unitAddonPrice: act.unitAddOn ?? 0,
        isAddonAllowed: true,
      }));
    }
    return [];
  }, [pkg]);

  const basePrice = useMemo(() => {
    if (!pkg || pkg.isCustomPrice) return 0;
    if (typeof pkg.price === "number") return pkg.price;
    const numeric = Number(String(pkg.price || 0).replace(/[^0-9.]/g, ""));
    return Number.isNaN(numeric) ? 0 : numeric;
  }, [pkg]);

  const billingCycle = pkg?.isCustomPrice ? "" : pkg?.billingCycle || pkg?.period || "/mo";

  const baseTotalLinks = useMemo(() => {
    if (typeof pkg?.totalLinks === "number") return pkg.totalLinks;
    return activities.reduce((sum, act) => sum + Number(act.monthlyCount || 0), 0);
  }, [pkg, activities]);

  const selectedAddons = useMemo(() => {
    return activities
      .map((act, idx) => {
        const key = act._id || act.activityName || idx;
        const addedQty = Number(addonQuantities[key] || 0);
        const unitPrice = Number(act.unitAddonPrice || 0);
        console.log(key,addedQty)
        return {
          key,
          activityName: act.activityName,
          baseQty: Number(act.monthlyCount || 0),
          addedQty,
          unitPrice,
          subtotal: addedQty * unitPrice,
        };
      })
      .filter((item) => item.addedQty > 0);
  }, [activities, addonQuantities]);

  const totalAddedLinks = useMemo(
    () => selectedAddons.reduce((sum, item) => sum + item.addedQty, 0),
    [selectedAddons]
  );

  const localAddonsTotalPrice = useMemo(
    () => selectedAddons.reduce((sum, item) => sum + item.subtotal, 0),
    [selectedAddons]
  );

  // Auto-calculate price via backend API whenever selected add-ons change
  useEffect(() => {
    if (!pkg || !slug || pkg.isCustomPrice || pkg.price === null) return;

    if (selectedAddons.length === 0) {
      setCalculatedPricing(null);
      return;
    }

    let active = true;
    const timer = setTimeout(async () => {
      setCalculatingPrice(true);
      try {
        const payload = {
          customizations: selectedAddons.map((item) => ({
            activityId: String(item.key),
            selectedCount: item.baseQty + item.addedQty,
          })),
        };
        const res = await calculatePublicPackagePrice(pkg.slug || slug, payload);
        if (!active) return;
        const calcData = res?.data || res;
        setCalculatedPricing(calcData);
      } catch {
        if (active) setCalculatedPricing(null);
      } finally {
        if (active) setCalculatingPrice(false);
      }
    }, 200);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [pkg, slug, selectedAddons]);

  const addonsTotalPrice =
    typeof calculatedPricing?.extraAddonCost === "number"
      ? calculatedPricing.extraAddonCost
      : typeof calculatedPricing?.addonsTotal === "number"
      ? calculatedPricing.addonsTotal
      : typeof calculatedPricing?.addonPrice === "number"
      ? calculatedPricing.addonPrice
      : typeof calculatedPricing?.totalAddonPrice === "number"
      ? calculatedPricing.totalAddonPrice
      : localAddonsTotalPrice;

  const updatedTotalPrice =
    typeof calculatedPricing?.finalPrice === "number"
      ? calculatedPricing.finalPrice
      : typeof calculatedPricing?.totalPrice === "number"
      ? calculatedPricing.totalPrice
      : typeof calculatedPricing?.calculatedPrice === "number"
      ? calculatedPricing.calculatedPrice
      : typeof calculatedPricing?.updatedPrice === "number"
      ? calculatedPricing.updatedPrice
      : basePrice + addonsTotalPrice;

  const totalMonthlyLinks =
    typeof calculatedPricing?.finalTotalLinks === "number"
      ? calculatedPricing.finalTotalLinks
      : typeof calculatedPricing?.totalLinks === "number"
      ? calculatedPricing.totalLinks
      : typeof calculatedPricing?.totalMonthlyLinks === "number"
      ? calculatedPricing.totalMonthlyLinks
      : baseTotalLinks + totalAddedLinks;

  const handleAddonChange = (key, nextVal) => {
    const parsed = Math.max(0, Math.floor(Number(nextVal) || 0));
    setAddonQuantities((prev) => ({
      ...prev,
      [key]: parsed,
    }));
  };

  const handleIncrement = (key) => {
    setAddonQuantities((prev) => ({
      ...prev,
      [key]: Number(prev[key] || 0) + 1,
    }));
  };

  const handleDecrement = (key) => {
    setAddonQuantities((prev) => ({
      ...prev,
      [key]: Math.max(0, Number(prev[key] || 0) - 1),
    }));
  };

  const handleRemoveAddon = (key) => {
    setAddonQuantities((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };

  const handleDownloadSummary = () => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 40;
    let y = 50;

    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("SEO PACKAGE INVOICE", margin, y);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Date: ${new Date().toLocaleDateString("en-IN")}`, pageWidth - margin, y, {
      align: "right",
    });

    y += 24;
    doc.setDrawColor(220);
    doc.line(margin, y, pageWidth - margin, y);
    y += 22;

    // Package Info
    doc.setTextColor(20);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    const titleLines = doc.splitTextToSize(pkg.name || "SEO Package", pageWidth - margin * 2);
    doc.text(titleLines, margin, y);
    y += titleLines.length * 16 + 4;

    if (pkg.tagline) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(90);
      const taglineLines = doc.splitTextToSize(pkg.tagline, pageWidth - margin * 2);
      doc.text(taglineLines, margin, y);
      y += taglineLines.length * 14 + 6;
    }

    y += 6;
    doc.setTextColor(20);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(
      `Base Price: ${
        pkg.isCustomPrice ? pkg.customPriceLabel || "Custom" : `INR ${basePrice}${billingCycle}`
      }`,
      margin,
      y
    );
    doc.text(`Base Monthly Links: ${baseTotalLinks}`, pageWidth - margin, y, { align: "right" });
    y += 22;

    // SEO Activities Section
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("SEO Activities", margin, y);
    y += 14;
    doc.setDrawColor(230);
    doc.line(margin, y, pageWidth - margin, y);
    y += 16;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    if (activities.length === 0) {
      doc.text("No SEO activities listed.", margin, y);
      y += 16;
    } else {
      activities.forEach((act, idx) => {
        const key = act._id || act.activityName || idx;
        const baseQty = Number(act.monthlyCount || 0);
        const addedQty = Number(addonQuantities[key] || 0);
        const totalQty = baseQty + addedQty;
        doc.text(`${idx + 1}. ${act.activityName}`, margin, y);
        doc.text(
          `${totalQty} links${addedQty > 0 ? ` (${baseQty} base + ${addedQty} add-on)` : ""}`,
          pageWidth - margin,
          y,
          { align: "right" }
        );
        y += 16;
      });
    }

    y += 10;

    // Selected Add-ons Section
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Selected Add-ons", margin, y);
    y += 14;
    doc.line(margin, y, pageWidth - margin, y);
    y += 16;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    if (selectedAddons.length === 0) {
      doc.text("None", margin, y);
      y += 18;
    } else {
      selectedAddons.forEach((item, idx) => {
        doc.text(
          `${idx + 1}. ${item.activityName} (${item.addedQty} links x INR ${item.unitPrice})`,
          margin,
          y
        );
        doc.text(`INR ${item.subtotal}`, pageWidth - margin, y, { align: "right" });
        y += 16;
      });
    }

    y += 12;
    doc.setDrawColor(180);
    doc.line(margin, y, pageWidth - margin, y);
    y += 20;

    // Totals
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Total Monthly Links:", margin, y);
    doc.text(String(totalMonthlyLinks), pageWidth - margin, y, { align: "right" });
    y += 16;

    if (addonsTotalPrice > 0) {
      doc.text("Add-ons Subtotal:", margin, y);
      doc.text(`INR ${addonsTotalPrice}`, pageWidth - margin, y, { align: "right" });
      y += 18;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("Total Price:", margin, y);
    doc.text(
      pkg.isCustomPrice && addonsTotalPrice === 0
        ? pkg.customPriceLabel || "Custom"
        : `INR ${updatedTotalPrice}${billingCycle}`,
      pageWidth - margin,
      y,
      { align: "right" }
    );

    doc.save(`${pkg.slug || "package"}-invoice.pdf`);
  };

  const handleChatOnWhatsApp = () => {
    const selectedActivities = activities.map((act, idx) => {
      const key = act._id || act.activityName || idx;
      const baseQty = Number(act.monthlyCount || 0);
      const addedQty = Number(addonQuantities[key] || 0);
      return {
        activityName: act.activityName,
        qty: baseQty + addedQty,
      };
    });

    const message = generateWhatsAppMessage({
      packageName: pkg?.name,
      selectedActivities,
      selectedAddOns: selectedAddons,
      totalMonthlyLinks,
      basePrice,
      addOnPrice: addonsTotalPrice,
      updatedPrice: updatedTotalPrice,
      billingCycle,
      isCustomPrice: pkg?.isCustomPrice,
      customPriceLabel: pkg?.customPriceLabel,
    });

    const whatsappUrl = `https://wa.me/${BUSINESS_WHATSAPP_NUMBER}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-cream p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="mt-3 text-xs font-medium text-muted">Loading package details...</span>
      </div>
    );
  }

  if (error || !pkg) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-cream p-8 text-center">
        <AlertCircle className="h-10 w-10 text-accent-red mb-3" />
        <h2 className="text-lg font-bold text-fg">Package Not Found</h2>
        <p className="text-sm text-muted mt-1">{error || "Unable to load this package."}</p>
        <Link
          to="/link-building-services"
          className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary-light"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Link Building Packages
        </Link>
      </div>
    );
  }

  return (
    <main className="bg-cream py-8 md:py-12 font-sans">
      <div className="mx-auto max-w-6xl px-4 space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-muted">
          <Link to="/" className="inline-flex items-center gap-1 hover:text-fg">
            <Home className="h-3.5 w-3.5" />
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link to="/link-building-services" className="hover:text-fg">
            Packages
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-semibold text-fg truncate">{pkg.name}</span>
        </nav>

        {/* Top Hero Card */}
        <section className="rounded-2xl border border-border bg-white p-6 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Visual Banner */}
            <div className="lg:col-span-5">
              <div className="relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-navy-900 via-navy-900 to-primary p-6 text-white min-h-[190px] flex flex-col justify-between">
                <div className="flex items-center justify-between gap-2">
                  {pkg.isVerified !== false && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 px-3 py-1 text-[11px] font-semibold text-emerald-200">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Verified Package
                    </span>
                  )}
                  {pkg.badgeText && (
                    <span className="rounded-full bg-accent-yellow px-2.5 py-0.5 text-[11px] font-bold text-fg">
                      {pkg.badgeText}
                    </span>
                  )}
                </div>

                <div className="mt-6">
                  <p className="text-[11px] uppercase tracking-widest text-white/70 font-semibold">
                    {pkg.creatorRole?.replace("_", " ") || "Link Building Package"}
                  </p>
                  <h2 className="mt-1 text-xl font-extrabold leading-snug">{pkg.name}</h2>
                </div>
              </div>
            </div>

            {/* Package Info & Key Stats */}
            <div className="lg:col-span-7 space-y-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-fg tracking-tight">
                  {pkg.name}
                </h1>
                {pkg.tagline && (
                  <p className="mt-1.5 text-sm text-muted">{pkg.tagline}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-border">
                <div className="flex items-center gap-3 rounded-xl bg-cream/60 p-3 border border-border/60">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
                    <Link2 className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[11px] text-muted font-medium">Total Links</p>
                    <p className="text-base font-extrabold text-fg">{baseTotalLinks}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl bg-cream/60 p-3 border border-border/60">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
                    <Tag className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[11px] text-muted font-medium">Base Price</p>
                    <p className="text-base font-extrabold text-fg">
                      {pkg.isCustomPrice
                        ? pkg.customPriceLabel || "Custom"
                        : `₹${basePrice}${billingCycle}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl bg-cream/60 p-3 border border-border/60">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[11px] text-muted font-medium">Status</p>
                    <p className="text-sm font-extrabold text-fg">
                      {pkg.status || "ACTIVE"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Overview & Base Price Row */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 rounded-2xl border border-border bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <FileText className="h-4 w-4 text-amber-600" />
              <h2 className="text-base font-bold text-fg">Package Overview</h2>
            </div>
            <p className="text-sm text-muted leading-relaxed">
              {pkg.tagline
                ? `${pkg.name} — tailored for ${pkg.tagline}. Includes ${baseTotalLinks} monthly links across curated SEO activities with flexible add-on link options.`
                : `Includes ${baseTotalLinks} monthly links across curated SEO activities with flexible add-on link options.`}
            </p>
            <ul className="space-y-2 text-xs sm:text-sm text-fg">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-amber-600 shrink-0" />
                <span>{baseTotalLinks} guaranteed monthly links in base plan</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-amber-600 shrink-0" />
                <span>Customize individual SEO activity quantities with transparent add-on pricing</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-amber-600 shrink-0" />
                <span>
                  {pkg.isVerified !== false ? "Verified & quality-checked publisher inventory" : "Curated publisher inventory"}
                </span>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-4 rounded-2xl border border-amber-200 bg-amber-50/60 p-6 shadow-xs flex flex-col justify-center">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-fg">
              <Tag className="h-4 w-4 text-amber-600" />
              <span>Base Price</span>
            </div>
            <p className="mt-3 text-4xl font-extrabold text-fg">
              {pkg.isCustomPrice ? (
                pkg.customPriceLabel || "Custom"
              ) : (
                <>
                  ₹{basePrice}
                  <span className="text-base font-semibold text-muted">{billingCycle}</span>
                </>
              )}
            </p>
            <p className="mt-2 text-xs text-muted leading-relaxed">
              Start with our base package and customize with additional links as per your needs.
            </p>
          </div>
        </section>

        {/* Monthly SEO Activities & Selected Add-ons */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Activities Table */}
          <div className="lg:col-span-7 rounded-2xl border border-border bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <TrendingUp className="h-4 w-4 text-amber-600" />
              <h2 className="text-base font-bold text-fg">
                Monthly SEO Activities &amp; Add-On Pricing
              </h2>
            </div>

            {activities.length === 0 ? (
              <p className="text-xs text-muted py-4">
                No configurable SEO activities available for this package.
              </p>
            ) : (
              <div className="overflow-hidden rounded-xl border border-border">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-cream/70 text-[11px] font-bold uppercase tracking-wider text-muted border-b border-border">
                    <tr>
                      <th className="py-3 px-3">Sr.</th>
                      <th className="py-3 px-3">SEO Activity Name</th>
                      <th className="py-3 px-3 text-center">Monthly Qty</th>
                      <th className="py-3 px-3 text-center">Add more links</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {activities.map((act, idx) => {
                      const key = act._id || act.activityName || idx;
                      const baseQty = Number(act.monthlyCount || 0);
                      const addedQty = Number(addonQuantities[key] || 0);
                      const unitPrice = Number(act.unitAddonPrice || 0);
                      const canAdd = act.isAddonAllowed !== false;

                      return (
                        <tr key={key} className="hover:bg-cream/20">
                          <td className="py-3.5 px-3 font-medium text-muted">{idx + 1}</td>
                          <td className="py-3.5 px-3">
                            <p className="font-semibold text-fg">{act.activityName}</p>
                            {canAdd && (
                              <p className="text-[11px] text-muted">
                                Add-on: ₹{unitPrice} / link
                              </p>
                            )}
                          </td>
                          <td className="py-3.5 px-3 text-center">
                            <span className="inline-flex min-w-[48px] items-center justify-center rounded-lg border border-border bg-cream/40 px-2.5 py-1 text-xs font-bold text-fg">
                              {baseQty + addedQty}
                            </span>
                            {addedQty > 0 && (
                              <p className="text-[10px] text-primary font-semibold mt-0.5">
                                ({baseQty} + {addedQty})
                              </p>
                            )}
                          </td>
                          <td className="py-3.5 px-3">
                            {canAdd ? (
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleDecrement(key)}
                                  disabled={addedQty === 0}
                                  className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-white text-fg hover:bg-cream disabled:opacity-40 cursor-pointer"
                                  title="Decrease add-on links"
                                >
                                  <Minus className="h-3.5 w-3.5" />
                                </button>
                                <input
                                  type="number"
                                  min="0"
                                  value={addedQty}
                                  onChange={(e) => handleAddonChange(key, e.target.value)}
                                  aria-label={`Add-on links for ${act.activityName}`}
                                  className="h-7 w-12 rounded-lg border border-border bg-white text-center text-xs font-semibold text-fg outline-none focus:border-primary"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleIncrement(key)}
                                  className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-primary/30 bg-primary/5 text-primary hover:bg-primary/10 cursor-pointer"
                                  title="Add more links"
                                >
                                  <Plus className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            ) : (
                              <p className="text-center text-[11px] text-muted">Fixed</p>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                <div className="flex flex-wrap items-center justify-between gap-2 bg-amber-50/70 border-t border-border px-4 py-2.5 text-xs font-bold text-fg">
                  <span>Total Monthly Links: {totalMonthlyLinks}</span>
                  <span>
                    Base Price:{" "}
                    {pkg.isCustomPrice
                      ? pkg.customPriceLabel || "Custom"
                      : `₹${basePrice}${billingCycle}`}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Selected Add-ons Panel (only shows activities the user added) */}
          <div className="lg:col-span-5 rounded-2xl border border-border bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Puzzle className="h-4 w-4 text-amber-600" />
                <h2 className="text-base font-bold text-fg">Selected Add-ons</h2>
              </div>
              {selectedAddons.length > 0 && (
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold text-primary">
                  +{totalAddedLinks} links
                </span>
              )}
            </div>

            {selectedAddons.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border bg-cream/40 p-6 text-center text-xs text-muted">
                No add-ons selected yet. Click <span className="font-bold text-fg">+</span> on any
                SEO activity to add extra links.
              </div>
            ) : (
              <div className="space-y-2.5">
                {selectedAddons.map((item, idx) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between gap-3 rounded-xl border border-border bg-cream/30 p-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-[11px] font-bold text-amber-700">
                        {idx + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-fg truncate">{item.activityName}</p>
                        <p className="text-[11px] text-muted">
                          {item.addedQty} links × ₹{item.unitPrice} each ={" "}
                          <span className="font-semibold text-fg">₹{item.subtotal}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="rounded-lg border border-border bg-white px-2.5 py-1 text-xs font-bold text-fg">
                        Qty: {item.addedQty}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveAddon(item.key)}
                        className="rounded-lg p-1 text-muted hover:bg-white hover:text-accent-red cursor-pointer"
                        title="Remove add-on"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Bottom Updated Price & Selected Add-ons Summary Bar */}
        <section className="rounded-2xl border border-border bg-white p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy-900 text-white">
                <Calculator className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-fg">Updated Price</p>
                <p className="text-xs text-muted">
                  (Base + Add-ons) • {totalMonthlyLinks} total monthly links
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="text-left sm:text-right">
                <p className="text-2xl sm:text-3xl font-extrabold text-fg">
                  {pkg.isCustomPrice && addonsTotalPrice === 0 ? (
                    pkg.customPriceLabel || "Custom"
                  ) : (
                    <>
                      ₹{updatedTotalPrice.toLocaleString()}
                      <span className="text-sm font-semibold text-muted">{billingCycle}</span>
                    </>
                  )}
                </p>
                {addonsTotalPrice > 0 && (
                  <p className="text-[11px] text-muted">
                    <span className="line-through">
                      ₹{basePrice.toLocaleString()}
                      {billingCycle}
                    </span>{" "}
                    (Base Price) + ₹{addonsTotalPrice.toLocaleString()} Add-ons
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleDownloadSummary}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-white px-4 py-2.5 text-xs font-semibold text-fg hover:bg-cream transition-colors cursor-pointer"
                >
                  <Download className="h-4 w-4" />
                  Download Summary
                </button>
                <button
                  type="button"
                  onClick={handleChatOnWhatsApp}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-navy-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-primary transition-colors cursor-pointer"
                >
                  <MessageCircle className="h-4 w-4" />
                  Chat on WhatsApp
                </button>
              </div>
            </div>
          </div>

          {/* Only show added add-on details at the bottom when user has added links */}
          {selectedAddons.length > 0 && (
            <div className="border-t border-border pt-3 flex flex-wrap items-center gap-2 text-xs">
              <span className="font-semibold text-muted">Added Add-ons:</span>
              {selectedAddons.map((item) => (
                <span
                  key={item.key}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-cream border border-border px-2.5 py-1 text-xs font-medium text-fg"
                >
                  <span className="font-bold">{item.activityName}</span>
                  <span className="text-muted">
                    (+{item.addedQty} × ₹{item.unitPrice} = ₹{item.subtotal})
                  </span>
                </span>
              ))}
            </div>
          )}
        </section>

        {/* Bottom Trust Badges */}
        <section className="rounded-2xl border border-border bg-white px-6 py-4 shadow-xs">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-semibold text-fg">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="h-4 w-4 text-amber-600 shrink-0" />
              <span>Secure &amp; Trusted Transactions</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Zap className="h-4 w-4 text-amber-600 shrink-0" />
              <span>Instant Activation</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Headphones className="h-4 w-4 text-amber-600 shrink-0" />
              <span>24/7 Support</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Star className="h-4 w-4 text-amber-600 shrink-0" />
              <span>Premium Quality Links</span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default PackageDetail;
