// src/pages/admin/AdminSettings.jsx
import { useState, useEffect, useId, useCallback } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Share2,
  Newspaper,
  FileText,
  Save,
  RefreshCw,
  Loader2,
  AlertCircle,
} from "lucide-react";
import PageHeader from "../../components/admin/layout/PageHeader";
import { getFooterSettings, modifyFooter } from "../../services/settingService";
import { updateFooterSchema } from "../../schemas/footer.schema";
import { useToast } from "../../hooks/useToast";

const initialFooterState = {
  description:
    "Top #1 SEO & Guest Post Agency. We help you build a stronger online presence with trusted guest posts and link building.",
  contactInfo: {
    email: "",
    phone: "+91 6201533997",
    address: "B-1, 60-189, Heera Path, Mansarovar Jaipur",
  },
  socialLinks: {
    linkedin: "https://in.linkedin.com/company/sumitdigitech",
    x: "",
    youtube: "",
    instagram: "https://www.instagram.com/sumitdigitech",
    facebook: "https://www.facebook.com/summitdigitech",
  },
  newsletter: {
    title: "Newsletter",
    subtitle: "Get the latest updates, SEO tips, and exclusive offers.",
  },
  copyrightText: "© 2026 All Rights Reserved by Vefogix Clone.",
};

const AdminSettings = () => {
  const toast = useToast();

  const descId = useId();
  const emailId = useId();
  const phoneId = useId();
  const addressId = useId();
  const linkedinId = useId();
  const xId = useId();
  const youtubeId = useId();
  const instagramId = useId();
  const facebookId = useId();
  const newsTitleId = useId();
  const newsSubtitleId = useId();
  const copyrightId = useId();

  const [formData, setFormData] = useState(initialFooterState);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getFooterSettings();
      const footerData = res?.data?.footer || res?.data || res?.footer;
      if (footerData) {
        setFormData({
          description: footerData.description ?? initialFooterState.description,
          contactInfo: {
            email: footerData.contactInfo?.email ?? "",
            phone: footerData.contactInfo?.phone ?? "",
            address: footerData.contactInfo?.address ?? "",
          },
          socialLinks: {
            linkedin: footerData.socialLinks?.linkedin ?? "",
            x: footerData.socialLinks?.x ?? "",
            youtube: footerData.socialLinks?.youtube ?? "",
            instagram: footerData.socialLinks?.instagram ?? "",
            facebook: footerData.socialLinks?.facebook ?? "",
          },
          newsletter: {
            title: footerData.newsletter?.title ?? initialFooterState.newsletter.title,
            subtitle: footerData.newsletter?.subtitle ?? initialFooterState.newsletter.subtitle,
          },
          copyrightText: footerData.copyrightText ?? initialFooterState.copyrightText,
        });
      }
    } catch {
      // Keep initial defaults if not yet populated
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await getFooterSettings();
        if (!active) return;
        const footerData = res?.data?.footer || res?.data || res?.footer;
        if (footerData) {
          setFormData({
            description: footerData.description ?? initialFooterState.description,
            contactInfo: {
              email: footerData.contactInfo?.email ?? "",
              phone: footerData.contactInfo?.phone ?? "",
              address: footerData.contactInfo?.address ?? "",
            },
            socialLinks: {
              linkedin: footerData.socialLinks?.linkedin ?? "",
              x: footerData.socialLinks?.x ?? "",
              youtube: footerData.socialLinks?.youtube ?? "",
              instagram: footerData.socialLinks?.instagram ?? "",
              facebook: footerData.socialLinks?.facebook ?? "",
            },
            newsletter: {
              title: footerData.newsletter?.title ?? initialFooterState.newsletter.title,
              subtitle: footerData.newsletter?.subtitle ?? initialFooterState.newsletter.subtitle,
            },
            copyrightText: footerData.copyrightText ?? initialFooterState.copyrightText,
          });
        }
      } catch {
        // Keep initial defaults
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const handleChange = (section, field, value) => {
    if (section) {
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});

    const payload = {
      description: formData.description.trim(),
      contactInfo: {
        email: formData.contactInfo.email.trim(),
        phone: formData.contactInfo.phone.trim(),
        address: formData.contactInfo.address.trim(),
      },
      socialLinks: {
        linkedin: formData.socialLinks.linkedin.trim(),
        x: formData.socialLinks.x.trim(),
        youtube: formData.socialLinks.youtube.trim(),
        instagram: formData.socialLinks.instagram.trim(),
        facebook: formData.socialLinks.facebook.trim(),
      },
      newsletter: {
        title: formData.newsletter.title.trim(),
        subtitle: formData.newsletter.subtitle.trim(),
      },
      copyrightText: formData.copyrightText.trim(),
    };

    // Client-side Zod validation
    const validation = updateFooterSchema.safeParse({ body: payload });
    if (!validation.success) {
      const errors = {};
      validation.error.issues.forEach((issue) => {
        // e.g. ["body", "contactInfo", "email"]
        const path = issue.path.slice(1).join(".");
        if (!errors[path]) {
          errors[path] = issue.message;
        }
      });
      setFormErrors(errors);
      toast.error("Please correct the highlighted validation errors.", "Validation Error");
      return;
    }

    try {
      setSaving(true);
      const res = await modifyFooter(payload);
      toast.success(res?.message || "Footer settings updated successfully!", "Saved");
    } catch (err) {
      toast.error(err.message || "Failed to update footer settings.", "Save Failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="mt-3 text-xs font-medium text-gray-500">Loading settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Settings"
        subtitle="Configure platform information, footer content, contact details and social media channels."
      >
        <button
          type="button"
          onClick={fetchSettings}
          disabled={loading || saving}
          className="flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-2 text-xs font-semibold text-fg hover:border-primary hover:text-primary transition disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Reload
        </button>
      </PageHeader>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Brand & General Description */}
        <div className="rounded-2xl border border-border bg-white p-6 shadow-xs">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <FileText className="h-5 w-5 text-primary" />
            <div>
              <h2 className="text-sm font-bold text-fg">General & Footer Description</h2>
              <p className="text-xs text-gray-500">Overview text displayed in the website footer.</p>
            </div>
          </div>

          <div className="mt-4 space-y-4">
            <div>
              <label htmlFor={descId} className="block text-xs font-bold text-fg">
                Footer Description *
              </label>
              <textarea
                id={descId}
                rows={3}
                required
                value={formData.description}
                onChange={(e) => handleChange(null, "description", e.target.value)}
                placeholder="Top #1 SEO & Guest Post Agency..."
                className={`mt-1.5 w-full rounded-xl border p-3 text-xs text-fg focus:border-primary focus:outline-hidden ${
                  formErrors["description"] ? "border-red-500" : "border-border"
                }`}
              />
              {formErrors["description"] && (
                <p className="mt-1 text-[11px] text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {formErrors["description"]}
                </p>
              )}
            </div>

            <div>
              <label htmlFor={copyrightId} className="block text-xs font-bold text-fg">
                Copyright Text *
              </label>
              <input
                id={copyrightId}
                type="text"
                required
                value={formData.copyrightText}
                onChange={(e) => handleChange(null, "copyrightText", e.target.value)}
                placeholder="© 2026 All Rights Reserved by Vefogix Clone."
                className={`mt-1.5 w-full rounded-xl border px-3 py-2 text-xs text-fg focus:border-primary focus:outline-hidden ${
                  formErrors["copyrightText"] ? "border-red-500" : "border-border"
                }`}
              />
              {formErrors["copyrightText"] && (
                <p className="mt-1 text-[11px] text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {formErrors["copyrightText"]}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Contact Information */}
        <div className="rounded-2xl border border-border bg-white p-6 shadow-xs">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <Mail className="h-5 w-5 text-primary" />
            <div>
              <h2 className="text-sm font-bold text-fg">Contact Information</h2>
              <p className="text-xs text-gray-500">Official contact email, phone number, and physical office address.</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor={emailId} className="flex items-center gap-1 text-xs font-bold text-fg">
                <Mail className="h-3.5 w-3.5 text-gray-400" />
                Contact Email
              </label>
              <input
                id={emailId}
                type="email"
                value={formData.contactInfo.email}
                onChange={(e) => handleChange("contactInfo", "email", e.target.value)}
                placeholder="contact@example.com"
                className={`mt-1.5 w-full rounded-xl border px-3 py-2 text-xs text-fg focus:border-primary focus:outline-hidden ${
                  formErrors["contactInfo.email"] ? "border-red-500" : "border-border"
                }`}
              />
              {formErrors["contactInfo.email"] && (
                <p className="mt-1 text-[11px] text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {formErrors["contactInfo.email"]}
                </p>
              )}
            </div>

            <div>
              <label htmlFor={phoneId} className="flex items-center gap-1 text-xs font-bold text-fg">
                <Phone className="h-3.5 w-3.5 text-gray-400" />
                Contact Phone
              </label>
              <input
                id={phoneId}
                type="text"
                value={formData.contactInfo.phone}
                onChange={(e) => handleChange("contactInfo", "phone", e.target.value)}
                placeholder="+91 6201533997"
                className={`mt-1.5 w-full rounded-xl border px-3 py-2 text-xs text-fg focus:border-primary focus:outline-hidden ${
                  formErrors["contactInfo.phone"] ? "border-red-500" : "border-border"
                }`}
              />
              {formErrors["contactInfo.phone"] && (
                <p className="mt-1 text-[11px] text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {formErrors["contactInfo.phone"]}
                </p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor={addressId} className="flex items-center gap-1 text-xs font-bold text-fg">
                <MapPin className="h-3.5 w-3.5 text-gray-400" />
                Office Address
              </label>
              <input
                id={addressId}
                type="text"
                value={formData.contactInfo.address}
                onChange={(e) => handleChange("contactInfo", "address", e.target.value)}
                placeholder="B-1, 60-189, Heera Path, Mansarovar Jaipur"
                className={`mt-1.5 w-full rounded-xl border px-3 py-2 text-xs text-fg focus:border-primary focus:outline-hidden ${
                  formErrors["contactInfo.address"] ? "border-red-500" : "border-border"
                }`}
              />
              {formErrors["contactInfo.address"] && (
                <p className="mt-1 text-[11px] text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {formErrors["contactInfo.address"]}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Section 3: Social Media Links */}
        <div className="rounded-2xl border border-border bg-white p-6 shadow-xs">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <Share2 className="h-5 w-5 text-primary" />
            <div>
              <h2 className="text-sm font-bold text-fg">Social Media Links</h2>
              <p className="text-xs text-gray-500">Official profile URLs linked in the platform footer.</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor={linkedinId} className="block text-xs font-bold text-fg">
                LinkedIn URL
              </label>
              <input
                id={linkedinId}
                type="url"
                value={formData.socialLinks.linkedin}
                onChange={(e) => handleChange("socialLinks", "linkedin", e.target.value)}
                placeholder="https://in.linkedin.com/company/sumitdigitech"
                className={`mt-1.5 w-full rounded-xl border px-3 py-2 text-xs text-fg focus:border-primary focus:outline-hidden ${
                  formErrors["socialLinks.linkedin"] ? "border-red-500" : "border-border"
                }`}
              />
              {formErrors["socialLinks.linkedin"] && (
                <p className="mt-1 text-[11px] text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {formErrors["socialLinks.linkedin"]}
                </p>
              )}
            </div>

            <div>
              <label htmlFor={facebookId} className="block text-xs font-bold text-fg">
                Facebook URL
              </label>
              <input
                id={facebookId}
                type="url"
                value={formData.socialLinks.facebook}
                onChange={(e) => handleChange("socialLinks", "facebook", e.target.value)}
                placeholder="https://www.facebook.com/summitdigitech"
                className={`mt-1.5 w-full rounded-xl border px-3 py-2 text-xs text-fg focus:border-primary focus:outline-hidden ${
                  formErrors["socialLinks.facebook"] ? "border-red-500" : "border-border"
                }`}
              />
              {formErrors["socialLinks.facebook"] && (
                <p className="mt-1 text-[11px] text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {formErrors["socialLinks.facebook"]}
                </p>
              )}
            </div>

            <div>
              <label htmlFor={instagramId} className="block text-xs font-bold text-fg">
                Instagram URL
              </label>
              <input
                id={instagramId}
                type="url"
                value={formData.socialLinks.instagram}
                onChange={(e) => handleChange("socialLinks", "instagram", e.target.value)}
                placeholder="https://www.instagram.com/sumitdigitech"
                className={`mt-1.5 w-full rounded-xl border px-3 py-2 text-xs text-fg focus:border-primary focus:outline-hidden ${
                  formErrors["socialLinks.instagram"] ? "border-red-500" : "border-border"
                }`}
              />
              {formErrors["socialLinks.instagram"] && (
                <p className="mt-1 text-[11px] text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {formErrors["socialLinks.instagram"]}
                </p>
              )}
            </div>

            <div>
              <label htmlFor={xId} className="block text-xs font-bold text-fg">
                X / Twitter URL
              </label>
              <input
                id={xId}
                type="url"
                value={formData.socialLinks.x}
                onChange={(e) => handleChange("socialLinks", "x", e.target.value)}
                placeholder="https://x.com/username"
                className={`mt-1.5 w-full rounded-xl border px-3 py-2 text-xs text-fg focus:border-primary focus:outline-hidden ${
                  formErrors["socialLinks.x"] ? "border-red-500" : "border-border"
                }`}
              />
              {formErrors["socialLinks.x"] && (
                <p className="mt-1 text-[11px] text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {formErrors["socialLinks.x"]}
                </p>
              )}
            </div>

            <div>
              <label htmlFor={youtubeId} className="block text-xs font-bold text-fg">
                YouTube URL
              </label>
              <input
                id={youtubeId}
                type="url"
                value={formData.socialLinks.youtube}
                onChange={(e) => handleChange("socialLinks", "youtube", e.target.value)}
                placeholder="https://youtube.com/@channel"
                className={`mt-1.5 w-full rounded-xl border px-3 py-2 text-xs text-fg focus:border-primary focus:outline-hidden ${
                  formErrors["socialLinks.youtube"] ? "border-red-500" : "border-border"
                }`}
              />
              {formErrors["socialLinks.youtube"] && (
                <p className="mt-1 text-[11px] text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {formErrors["socialLinks.youtube"]}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Section 4: Newsletter */}
        <div className="rounded-2xl border border-border bg-white p-6 shadow-xs">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <Newspaper className="h-5 w-5 text-primary" />
            <div>
              <h2 className="text-sm font-bold text-fg">Newsletter Section</h2>
              <p className="text-xs text-gray-500">Header title and prompt for the newsletter subscription box.</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor={newsTitleId} className="block text-xs font-bold text-fg">
                Newsletter Title
              </label>
              <input
                id={newsTitleId}
                type="text"
                value={formData.newsletter.title}
                onChange={(e) => handleChange("newsletter", "title", e.target.value)}
                placeholder="Newsletter"
                className={`mt-1.5 w-full rounded-xl border px-3 py-2 text-xs text-fg focus:border-primary focus:outline-hidden ${
                  formErrors["newsletter.title"] ? "border-red-500" : "border-border"
                }`}
              />
              {formErrors["newsletter.title"] && (
                <p className="mt-1 text-[11px] text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {formErrors["newsletter.title"]}
                </p>
              )}
            </div>

            <div>
              <label htmlFor={newsSubtitleId} className="block text-xs font-bold text-fg">
                Newsletter Subtitle
              </label>
              <input
                id={newsSubtitleId}
                type="text"
                value={formData.newsletter.subtitle}
                onChange={(e) => handleChange("newsletter", "subtitle", e.target.value)}
                placeholder="Get the latest updates, SEO tips, and exclusive offers."
                className={`mt-1.5 w-full rounded-xl border px-3 py-2 text-xs text-fg focus:border-primary focus:outline-hidden ${
                  formErrors["newsletter.subtitle"] ? "border-red-500" : "border-border"
                }`}
              />
              {formErrors["newsletter.subtitle"] && (
                <p className="mt-1 text-[11px] text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {formErrors["newsletter.subtitle"]}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-end gap-3 rounded-2xl border border-border bg-white p-4 shadow-xs">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-primary-light transition disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
