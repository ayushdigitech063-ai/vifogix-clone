import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Globe,
  DollarSign,
  Clock,
  Link2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Sparkles,
  BarChart2,
  Upload,
  FileSpreadsheet,
  Download,
  X,
} from "lucide-react";
import { useToast } from "../../hooks/useToast";
import { useAuth } from "../../hooks/useAuth";
import { createSingleListing, uploadBulkCsv } from "../../services/websiteService";
import { addWebsiteSchema, csvWebsiteRowSchema } from "../../schemas";

const categories = [
  "All",
  "Technology",
  "Business & Finance",
  "Health & Wellness",
  "SEO & Marketing",
  "Travel & Tourism",
  "Education",
  "Lifestyle",
  "Real Estate",
  "Food & Beverage",
  "News & Media",
  "Crypto & Web3",
];

const languages = [
  "English",
  "Spanish",
  "French",
  "German",
  "Italian",
  "Portuguese",
  "Hindi",
  "Arabic",
];

const AddWebsite = () => {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Bulk CSV Upload State
  const [csvFile, setCsvFile] = useState(null);
  const [csvUploading, setCsvUploading] = useState(false);
  const [csvResult, setCsvResult] = useState(null);
  const [csvError, setCsvError] = useState("");
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    domain: "",
    category: "All",
    country: "",
    language: "English",
    // Metrics (can be null/empty)
    mozDA: "",
    ahrefsDR: "",
    semrushAS: "",
    monthlyTraffic: "",
    domainAge: "",
    // Commercial Details
    price: "",
    contentWritingPrice: "0",
    turnaroundDays: 3,
    maxLinksAllowed: 2,
    linkType: "DoFollow",
    samplePostUrl: "",
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "number" ? (value === "" ? "" : Number(value)) : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const result = addWebsiteSchema.safeParse(form);
    if (result.success) return {};

    const next = {};
    const fieldErrors = result.error.flatten().fieldErrors;
    for (const [key, msgs] of Object.entries(fieldErrors)) {
      if (msgs && msgs[0]) next[key] = msgs[0];
    }
    return next;
  };

  // CSV file change & client-side validation
  const handleCsvChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset previous feedback
    setCsvError("");
    setCsvResult(null);

    // Validate extension
    const isCsv = file.name.toLowerCase().endsWith(".csv") || file.type === "text/csv" || file.type === "application/vnd.ms-excel";
    if (!isCsv) {
      const msg = "Please upload a valid .csv file format.";
      setCsvError(msg);
      toast.error(msg);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      const msg = "CSV file size must not exceed 10MB.";
      setCsvError(msg);
      toast.error(msg);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // Pre-validate first rows in browser using csvWebsiteRowSchema
    try {
      const text = await file.text();
      const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
      if (lines.length <= 1) {
        const msg = "CSV file is empty or missing data rows.";
        setCsvError(msg);
        toast.error(msg);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      const headers = lines[0].split(",").map((h) => h.trim().replace(/^["']|["']$/g, ""));
      const requiredHeaders = ["domain", "country", "price"];
      const missing = requiredHeaders.filter(
        (req) => !headers.some((h) => h.toLowerCase() === req.toLowerCase())
      );

      if (missing.length > 0) {
        const msg = `CSV missing required columns: ${missing.join(", ")}`;
        setCsvError(msg);
        toast.error(msg);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      // Check first data row with csvWebsiteRowSchema
      if (lines.length > 1) {
        const firstValues = lines[1].split(",").map((v) => v.trim().replace(/^["']|["']$/g, ""));
        const rowObj = {};
        headers.forEach((h, idx) => {
          rowObj[h] = firstValues[idx] ?? "";
        });

        const sampleResult = csvWebsiteRowSchema.safeParse(rowObj);
        if (!sampleResult.success) {
          const firstIssue = sampleResult.error.issues[0]?.message;
          toast.warning(`Sample row warning: ${firstIssue}`);
        }
      }

      setCsvFile(file);
    } catch {
      // Fallback: accept file if text parsing is unsupported
      setCsvFile(file);
    }
  };

  const handleUploadCsv = async () => {
    if (!csvFile) {
      toast.error("Please select a CSV file first.");
      return;
    }

    setCsvUploading(true);
    setCsvError("");
    setCsvResult(null);

    try {
      const res = await uploadBulkCsv(csvFile);
      const data = res?.data || res;
      setCsvResult(data);

      const inserted = data?.successfullyInserted ?? 0;
      const failed = data?.failedOrSkipped ?? 0;

      if (inserted > 0) {
        toast.success(`Successfully uploaded ${inserted} website(s)!`);
      }
      if (failed > 0) {
        toast.warning(`${failed} row(s) had errors or duplicates.`);
      }

      // Clear input
      setCsvFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      const msg = err.message || "Failed to upload CSV file.";
      setCsvError(msg);
      toast.error(msg);
    } finally {
      setCsvUploading(false);
    }
  };

  const downloadSampleCsv = () => {
    const csvContent =
      "domain,country,category,price,turnaroundDays,language,mozDA,ahrefsDR,semrushAS,monthlyTraffic,domainAge,samplePostUrl\n" +
      "techcrunch.com,United States,Technology,250,3,English,92,90,88,10M+,15 years,https://techcrunch.com/sample\n" +
      "searchengineland.com,United States,SEO & Marketing,180,2,English,85,82,80,500K,12 years,https://searchengineland.com/sample\n";

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "websites_sample_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      toast.error("Please fill in all required fields accurately.");
      return;
    }

    setLoading(true);

    try {
      // Build clean payload matching Mongoose schema
      const payload = {
        sellerId: user?._id || user?.id,
        domain: form.domain,
        category: form.category || "All",
        country: form.country.trim(),
        language: form.language || "English",
        mozDA: form.mozDA !== "" ? Number(form.mozDA) : null,
        ahrefsDR: form.ahrefsDR !== "" ? Number(form.ahrefsDR) : null,
        semrushAS: form.semrushAS !== "" ? Number(form.semrushAS) : null,
        monthlyTraffic: form.monthlyTraffic.trim() || null,
        domainAge: form.domainAge.trim() || null,
        price: Number(form.price),
        contentWritingPrice: Number(form.contentWritingPrice || 0),
        turnaroundDays: Number(form.turnaroundDays) || 3,
        maxLinksAllowed: Number(form.maxLinksAllowed) || 2,
        linkType: form.linkType || "DoFollow",
        samplePostUrl: form.samplePostUrl?.trim() || null,
      };

      // Call backend API: router.post('/websites', validate(addWebsiteSchema), createSingleListing)
      await createSingleListing(payload);

      toast.success("Website submitted for verification successfully!");
      navigate("/publisher-dashboard");
    } catch (err) {
      toast.error(err.message || "Failed to submit website. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 animate-fade-in pb-12">
      {/* Top Navigation & Header */}
      <div>
        <Link
          to="/publisher-dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-fg transition-colors mb-3"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Publisher Dashboard</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              Publisher Inventory
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-fg tracking-tight">
              Add New Website
            </h1>
            <p className="text-sm text-muted mt-1">
              List your verified domain. Our team verifies metrics before your listing goes live to buyers.
            </p>
          </div>
        </div>
      </div>

      {/* Bulk CSV Upload Card */}
      <div className="rounded-2xl border border-dashed border-primary/30 bg-primary/[0.02] p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-fg flex items-center gap-2">
                Upload CSV
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                  Bulk Websites
                </span>
              </h2>
              <p className="text-xs text-muted mt-0.5">
                Upload multiple website listings at once using a CSV sheet.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={downloadSampleCsv}
            className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-muted hover:text-fg hover:border-primary/40 transition"
          >
            <Download className="h-3.5 w-3.5 text-primary" />
            <span>Sample CSV Template</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
          <div className="sm:col-span-2">
            <label
              htmlFor="csv-upload-input"
              className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface/70 px-4 py-5 text-center cursor-pointer hover:border-primary/50 hover:bg-cream/40 transition group"
            >
              <Upload className="h-6 w-6 text-muted group-hover:text-primary transition mb-1.5" />
              <span className="text-xs font-semibold text-fg">
                {csvFile ? csvFile.name : "Click to choose CSV file or drag & drop"}
              </span>
              <span className="text-[11px] text-muted mt-0.5">
                {csvFile
                  ? `${(csvFile.size / 1024).toFixed(1)} KB — ready to upload`
                  : "Supports .csv up to 10MB (Required headers: domain, country, price)"}
              </span>
              <input
                id="csv-upload-input"
                ref={fileInputRef}
                type="file"
                accept=".csv,text/csv,application/vnd.ms-excel"
                onChange={handleCsvChange}
                className="hidden"
              />
            </label>
          </div>

          <div className="flex flex-col gap-2">
            <button
              type="button"
              disabled={!csvFile || csvUploading}
              onClick={handleUploadCsv}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-xs font-semibold text-white shadow-xs transition hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {csvUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                  <span>Processing CSV...</span>
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  <span>Upload & Import CSV</span>
                </>
              )}
            </button>

            {csvFile && (
              <button
                type="button"
                onClick={() => {
                  setCsvFile(null);
                  setCsvError("");
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="inline-flex items-center justify-center gap-1 text-[11px] font-semibold text-muted hover:text-accent-red transition"
              >
                <X className="h-3 w-3" />
                <span>Remove selected file</span>
              </button>
            )}
          </div>
        </div>

        {/* Error Feedback */}
        {csvError && (
          <div className="flex items-start gap-2 rounded-xl border border-accent-red/20 bg-accent-red/5 p-3 text-xs text-accent-red">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{csvError}</span>
          </div>
        )}

        {/* Success / Result Feedback */}
        {csvResult && (
          <div className="rounded-xl border border-border bg-surface p-4 text-xs space-y-2">
            <div className="flex items-center gap-2 font-semibold text-fg">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
              <span>Bulk Processing Summary:</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center pt-1">
              <div className="rounded-lg bg-cream/60 p-2">
                <div className="text-[10px] text-muted font-medium">Total Rows</div>
                <div className="text-sm font-bold text-fg">{csvResult.totalRowsInCsv ?? 0}</div>
              </div>
              <div className="rounded-lg bg-primary/10 p-2">
                <div className="text-[10px] text-primary font-medium">Successfully Added</div>
                <div className="text-sm font-bold text-primary">{csvResult.successfullyInserted ?? 0}</div>
              </div>
              <div className="rounded-lg bg-accent-yellow/10 p-2">
                <div className="text-[10px] text-accent-yellow font-medium">Failed / Skipped</div>
                <div className="text-sm font-bold text-accent-yellow">{csvResult.failedOrSkipped ?? 0}</div>
              </div>
            </div>

            {csvResult.errors && csvResult.errors.length > 0 && (
              <div className="mt-3 max-h-36 overflow-y-auto space-y-1 rounded-lg border border-border bg-cream/40 p-2">
                <p className="font-semibold text-muted text-[11px]">Row Error Details:</p>
                {csvResult.errors.map((errItem, idx) => (
                  <div key={idx} className="text-[11px] text-accent-red flex items-start gap-1.5">
                    <span>•</span>
                    <span>
                      {errItem.row ? `Row ${errItem.row}` : errItem.domain ? errItem.domain : "Row"}:{" "}
                      {typeof errItem.errors === "object"
                        ? Object.values(errItem.errors).join("; ")
                        : String(errItem.errors || "Failed")}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative bg-background px-3 text-xs font-semibold uppercase tracking-wider text-muted">
          Or Add Single Website Manually
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {/* 1. Basic Domain Information */}
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-xs space-y-5">
          <div className="border-b border-border pb-3">
            <h2 className="text-base font-bold text-fg flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" />
              Domain & Identity
            </h2>
            <p className="text-xs text-muted mt-0.5">
              Specify your website domain and general audience targeting.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Domain */}
            <div className="sm:col-span-2">
              <label
                htmlFor="domain"
                className="block text-xs font-semibold text-fg mb-1.5"
              >
                Website Domain <span className="text-accent-red">*</span>
              </label>
              <div className="relative">
                <input
                  id="domain"
                  name="domain"
                  type="text"
                  placeholder="e.g. techradar.com"
                  value={form.domain}
                  onChange={handleChange}
                  className={`w-full rounded-xl border bg-surface px-4 py-2.5 text-sm text-fg outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 ${
                    errors.domain ? "border-accent-red" : "border-border"
                  }`}
                />
              </div>
              {errors.domain ? (
                <p className="mt-1.5 flex items-center gap-1 text-xs text-accent-red font-medium">
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span>{errors.domain}</span>
                </p>
              ) : (
                <p className="mt-1 text-[11px] text-muted">
                  Enter your root domain without protocol (e.g., example.com).
                </p>
              )}
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="category"
                className="block text-xs font-semibold text-fg mb-1.5"
              >
                Primary Category
              </label>
              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm font-medium text-fg outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Target Country */}
            <div>
              <label
                htmlFor="country"
                className="block text-xs font-semibold text-fg mb-1.5"
              >
                Primary Country <span className="text-accent-red">*</span>
              </label>
              <input
                id="country"
                name="country"
                type="text"
                placeholder="e.g. United States, Global, India"
                value={form.country}
                onChange={handleChange}
                className={`w-full rounded-xl border bg-surface px-4 py-2.5 text-sm text-fg outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 ${
                  errors.country ? "border-accent-red" : "border-border"
                }`}
              />
              {errors.country && (
                <p className="mt-1.5 flex items-center gap-1 text-xs text-accent-red font-medium">
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span>{errors.country}</span>
                </p>
              )}
            </div>

            {/* Language */}
            <div>
              <label
                htmlFor="language"
                className="block text-xs font-semibold text-fg mb-1.5"
              >
                Content Language
              </label>
              <select
                id="language"
                name="language"
                value={form.language}
                onChange={handleChange}
                className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm font-medium text-fg outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>

            {/* Sample Post URL */}
            <div>
              <label
                htmlFor="samplePostUrl"
                className="block text-xs font-semibold text-fg mb-1.5"
              >
                Sample Published Post URL <span className="text-muted font-normal">(optional)</span>
              </label>
              <input
                id="samplePostUrl"
                name="samplePostUrl"
                type="url"
                placeholder="https://example.com/blog/sample-post"
                value={form.samplePostUrl}
                onChange={handleChange}
                className={`w-full rounded-xl border bg-surface px-4 py-2.5 text-sm text-fg outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 ${
                  errors.samplePostUrl ? "border-accent-red" : "border-border"
                }`}
              />
              {errors.samplePostUrl && (
                <p className="mt-1.5 flex items-center gap-1 text-xs text-accent-red font-medium">
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span>{errors.samplePostUrl}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 2. SEO & Authority Metrics (Optional) */}
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-xs space-y-5">
          <div className="border-b border-border pb-3">
            <h2 className="text-base font-bold text-fg flex items-center gap-2">
              <BarChart2 className="h-4 w-4 text-primary" />
              SEO & Authority Metrics
            </h2>
            <p className="text-xs text-muted mt-0.5">
              Fill these if known. Our verification crawler will also cross-check these automatically.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {/* Moz DA */}
            <div>
              <label
                htmlFor="mozDA"
                className="block text-xs font-semibold text-fg mb-1.5"
              >
                Moz DA (0–100)
              </label>
              <input
                id="mozDA"
                name="mozDA"
                type="number"
                min="0"
                max="100"
                placeholder="e.g. 52"
                value={form.mozDA}
                onChange={handleChange}
                className={`w-full rounded-xl border bg-surface px-3 py-2 text-sm text-fg outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 ${
                  errors.mozDA ? "border-accent-red" : "border-border"
                }`}
              />
              {errors.mozDA && (
                <p className="mt-1 flex items-center gap-1 text-[11px] text-accent-red font-medium">
                  <AlertCircle className="h-3 w-3" />
                  <span>{errors.mozDA}</span>
                </p>
              )}
            </div>

            {/* Ahrefs DR */}
            <div>
              <label
                htmlFor="ahrefsDR"
                className="block text-xs font-semibold text-fg mb-1.5"
              >
                Ahrefs DR (0–100)
              </label>
              <input
                id="ahrefsDR"
                name="ahrefsDR"
                type="number"
                min="0"
                max="100"
                placeholder="e.g. 64"
                value={form.ahrefsDR}
                onChange={handleChange}
                className={`w-full rounded-xl border bg-surface px-3 py-2 text-sm text-fg outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 ${
                  errors.ahrefsDR ? "border-accent-red" : "border-border"
                }`}
              />
              {errors.ahrefsDR && (
                <p className="mt-1 flex items-center gap-1 text-[11px] text-accent-red font-medium">
                  <AlertCircle className="h-3 w-3" />
                  <span>{errors.ahrefsDR}</span>
                </p>
              )}
            </div>

            {/* Semrush AS */}
            <div>
              <label
                htmlFor="semrushAS"
                className="block text-xs font-semibold text-fg mb-1.5"
              >
                Semrush AS (0–100)
              </label>
              <input
                id="semrushAS"
                name="semrushAS"
                type="number"
                min="0"
                max="100"
                placeholder="e.g. 48"
                value={form.semrushAS}
                onChange={handleChange}
                className={`w-full rounded-xl border bg-surface px-3 py-2 text-sm text-fg outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 ${
                  errors.semrushAS ? "border-accent-red" : "border-border"
                }`}
              />
              {errors.semrushAS && (
                <p className="mt-1 flex items-center gap-1 text-[11px] text-accent-red font-medium">
                  <AlertCircle className="h-3 w-3" />
                  <span>{errors.semrushAS}</span>
                </p>
              )}
            </div>

            {/* Monthly Traffic */}
            <div>
              <label
                htmlFor="monthlyTraffic"
                className="block text-xs font-semibold text-fg mb-1.5"
              >
                Monthly Traffic
              </label>
              <input
                id="monthlyTraffic"
                name="monthlyTraffic"
                type="text"
                placeholder="e.g. 150K or 1.2M"
                value={form.monthlyTraffic}
                onChange={handleChange}
                className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-fg outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Domain Age */}
            <div>
              <label
                htmlFor="domainAge"
                className="block text-xs font-semibold text-fg mb-1.5"
              >
                Domain Age
              </label>
              <input
                id="domainAge"
                name="domainAge"
                type="text"
                placeholder="e.g. 8 Years"
                value={form.domainAge}
                onChange={handleChange}
                className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-fg outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        </div>

        {/* 3. Commercial & Publishing Details */}
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-xs space-y-5">
          <div className="border-b border-border pb-3">
            <h2 className="text-base font-bold text-fg flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-primary" />
              Commercial & Link Guidelines
            </h2>
            <p className="text-xs text-muted mt-0.5">
              Set your publishing rates, link insertion parameters, and delivery turnaround.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Guest Post Price */}
            <div>
              <label
                htmlFor="price"
                className="block text-xs font-semibold text-fg mb-1.5"
              >
                Guest Post Publishing Price ($ USD) <span className="text-accent-red">*</span>
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted text-sm font-semibold">
                  $
                </span>
                <input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="49.00"
                  value={form.price}
                  onChange={handleChange}
                  className={`w-full rounded-xl border bg-surface pl-8 pr-4 py-2.5 text-sm text-fg outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 ${
                    errors.price ? "border-accent-red" : "border-border"
                  }`}
                />
              </div>
              {errors.price && (
                <p className="mt-1.5 flex items-center gap-1 text-xs text-accent-red font-medium">
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span>{errors.price}</span>
                </p>
              )}
            </div>

            {/* Content Writing Price */}
            <div>
              <label
                htmlFor="contentWritingPrice"
                className="block text-xs font-semibold text-fg mb-1.5"
              >
                Article Writing Addon Price ($ USD)
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted text-sm font-semibold">
                  $
                </span>
                <input
                  id="contentWritingPrice"
                  name="contentWritingPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={form.contentWritingPrice}
                  onChange={handleChange}
                  className={`w-full rounded-xl border bg-surface pl-8 pr-4 py-2.5 text-sm text-fg outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 ${
                    errors.contentWritingPrice ? "border-accent-red" : "border-border"
                  }`}
                />
              </div>
              {errors.contentWritingPrice && (
                <p className="mt-1 flex items-center gap-1 text-xs text-accent-red font-medium">
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span>{errors.contentWritingPrice}</span>
                </p>
              )}
              <p className="mt-1 text-[11px] text-muted">
                Set to 0 if writing is free or not offered.
              </p>
            </div>

            {/* Turnaround Days */}
            <div>
              <label
                htmlFor="turnaroundDays"
                className="block text-xs font-semibold text-fg mb-1.5 flex items-center gap-1"
              >
                <Clock className="h-3.5 w-3.5 text-muted" />
                Turnaround Time (Days)
              </label>
              <input
                id="turnaroundDays"
                name="turnaroundDays"
                type="number"
                min="1"
                placeholder="3"
                value={form.turnaroundDays}
                onChange={handleChange}
                className={`w-full rounded-xl border bg-surface px-4 py-2.5 text-sm text-fg outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 ${
                  errors.turnaroundDays ? "border-accent-red" : "border-border"
                }`}
              />
              {errors.turnaroundDays && (
                <p className="mt-1 flex items-center gap-1 text-xs text-accent-red font-medium">
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span>{errors.turnaroundDays}</span>
                </p>
              )}
            </div>

            {/* Max Links Allowed */}
            <div>
              <label
                htmlFor="maxLinksAllowed"
                className="block text-xs font-semibold text-fg mb-1.5"
              >
                Max Links Allowed (1–5)
              </label>
              <select
                id="maxLinksAllowed"
                name="maxLinksAllowed"
                value={form.maxLinksAllowed}
                onChange={handleChange}
                className={`w-full rounded-xl border bg-surface px-3 py-2.5 text-sm font-medium text-fg outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 ${
                  errors.maxLinksAllowed ? "border-accent-red" : "border-border"
                }`}
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? "Link" : "Links"}
                  </option>
                ))}
              </select>
            </div>

            {/* Link Type (DoFollow / NoFollow) */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-fg mb-2 flex items-center gap-1">
                <Link2 className="h-3.5 w-3.5 text-muted" />
                Link Rel Attribute
              </label>
              <div className="grid grid-cols-2 gap-3 max-w-sm">
                <button
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, linkType: "DoFollow" }))}
                  className={`flex items-center justify-center gap-2 rounded-xl border py-2.5 px-4 text-xs font-semibold transition ${
                    form.linkType === "DoFollow"
                      ? "border-primary bg-primary/10 text-primary shadow-xs"
                      : "border-border bg-surface text-muted hover:border-primary/40 hover:text-fg"
                  }`}
                >
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      form.linkType === "DoFollow" ? "bg-primary" : "border border-muted"
                    }`}
                  />
                  <span>DoFollow</span>
                </button>

                <button
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, linkType: "NoFollow" }))}
                  className={`flex items-center justify-center gap-2 rounded-xl border py-2.5 px-4 text-xs font-semibold transition ${
                    form.linkType === "NoFollow"
                      ? "border-primary bg-primary/10 text-primary shadow-xs"
                      : "border-border bg-surface text-muted hover:border-primary/40 hover:text-fg"
                  }`}
                >
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      form.linkType === "NoFollow" ? "bg-primary" : "border border-muted"
                    }`}
                  />
                  <span>NoFollow</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Verification Note Box */}
        <div className="rounded-xl border border-border bg-cream/60 p-4 text-xs text-muted flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            By submitting, your website will be assigned the status{" "}
            <span className="font-semibold text-fg">PENDING_VERIFICATION</span>. Once verified by our
            compliance team, your domain will appear in the public marketplace for buyers.
          </p>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            to="/publisher-dashboard"
            className="rounded-xl border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-fg hover:bg-cream transition-colors"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-light active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin text-white" />}
            <span>{loading ? "Submitting..." : "Submit Website for Review"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddWebsite;
