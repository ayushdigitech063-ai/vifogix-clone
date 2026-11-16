import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  User,
  Mail,
  Shield,
  Calendar,
  ExternalLink,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { getUserProfile } from "../../services/authServices";

// Clean SVG components for Social Platforms
const LinkedInIcon = () => (
  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.79v8.37H6.46v-8.37M7.86 6.3a1.63 1.63 0 1 0 0 3.25 1.63 1.63 0 0 0 0-3.25Z" />
  </svg>
);

const FacebookIcon = () => (
  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
  </svg>
);

const InstagramIcon = () => (
  <svg className="h-4 w-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const Profile = () => {
  const { user: authUser } = useAuth();
  const location = useLocation();

  const isBuyerRoute = location.pathname.startsWith("/buyer-dashboard");
  const dashboardHome = isBuyerRoute ? "/buyer-dashboard" : "/publisher-dashboard";

  const [profile, setProfile] = useState(authUser || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchProfile = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getUserProfile();
      const userData = res?.data?.user || res?.user || res?.data;
      if (userData) {
        setProfile(userData);
      }
    } catch (err) {
      if (!authUser) {
        setError(err.message || "Failed to load profile details.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    getUserProfile()
      .then((res) => {
        if (!ignore) {
          const userData = res?.data?.user || res?.user || res?.data;
          if (userData) setProfile(userData);
        }
      })
      .catch((err) => {
        if (!ignore && !authUser) {
          setError(err.message || "Failed to load profile details.");
        }
      });
    return () => {
      ignore = true;
    };
  }, [authUser]);

  const effectiveUser = profile || authUser;
  const role = effectiveUser?.role?.toUpperCase() || (isBuyerRoute ? "BUYER" : "SELLER");
  const isSeller = role === "SELLER";

  const initial =
    effectiveUser?.name?.trim()?.charAt(0)?.toUpperCase() ||
    (isSeller ? "S" : "B");

  const formattedDate = effectiveUser?.createdAt
    ? new Date(effectiveUser.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Member";

  return (
    <div className="mx-auto max-w-4xl space-y-8 animate-fade-in pb-12">
      {/* Top Header & Breadcrumb */}
      <div>
        <Link
          to={dashboardHome}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-fg transition-colors mb-3"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Dashboard</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              {isSeller ? "Publisher Account" : "Buyer Account"}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-fg tracking-tight">
              My Profile
            </h1>
            <p className="text-sm text-muted mt-1">
              View and manage your personal details, role identity, and social links.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchProfile}
            disabled={loading}
            className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-xl border border-border bg-surface px-3.5 py-2 text-xs font-semibold text-muted hover:text-fg hover:border-primary/40 transition disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {loading && !effectiveUser ? (
        <div className="rounded-2xl border border-border bg-surface p-12 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-3" />
          <p className="text-sm text-muted">Loading profile details...</p>
        </div>
      ) : error && !effectiveUser ? (
        <div className="rounded-2xl border border-accent-red/20 bg-accent-red/5 p-6 text-sm text-accent-red flex items-start gap-3">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Unable to fetch profile</p>
            <p className="text-xs mt-1">{error}</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Main Profile Identity Card */}
          <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-white shadow-md">
                {initial}
              </div>

              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="text-xl sm:text-2xl font-bold text-fg">
                    {effectiveUser?.name || "User"}
                  </h2>
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-xs font-semibold text-primary">
                    <Shield className="h-3 w-3" />
                    {role}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-xs font-semibold text-emerald-600">
                    <CheckCircle2 className="h-3 w-3" />
                    {effectiveUser?.status || "ACTIVE"}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-muted pt-1">
                  <span className="flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-muted" />
                    {effectiveUser?.email || "—"}
                  </span>
                  {effectiveUser?.createdAt && (
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-muted" />
                      Joined {formattedDate}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Account Information Grid */}
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-xs space-y-5">
            <div className="border-b border-border pb-3">
              <h3 className="text-base font-bold text-fg flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Account Overview
              </h3>
              <p className="text-xs text-muted mt-0.5">
                Core identity information linked to your {role.toLowerCase()} account.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-border bg-cream/40 p-4">
                <p className="text-[11px] font-semibold text-muted uppercase tracking-wider">
                  Full Name
                </p>
                <p className="text-sm font-semibold text-fg mt-1">
                  {effectiveUser?.name || "—"}
                </p>
              </div>

              <div className="rounded-xl border border-border bg-cream/40 p-4">
                <p className="text-[11px] font-semibold text-muted uppercase tracking-wider">
                  Email Address
                </p>
                <p className="text-sm font-semibold text-fg mt-1">
                  {effectiveUser?.email || "—"}
                </p>
              </div>

              <div className="rounded-xl border border-border bg-cream/40 p-4">
                <p className="text-[11px] font-semibold text-muted uppercase tracking-wider">
                  Assigned Role
                </p>
                <p className="text-sm font-semibold text-fg mt-1">
                  {role}
                </p>
              </div>

              <div className="rounded-xl border border-border bg-cream/40 p-4">
                <p className="text-[11px] font-semibold text-muted uppercase tracking-wider">
                  Account Status
                </p>
                <p className="text-sm font-semibold text-emerald-600 mt-1">
                  {effectiveUser?.status || "ACTIVE"}
                </p>
              </div>
            </div>
          </div>

          {/* Seller-Specific: Social Media Profiles */}
          {isSeller && (
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-xs space-y-5">
              <div className="border-b border-border pb-3">
                <h3 className="text-base font-bold text-fg flex items-center gap-2">
                  <ExternalLink className="h-4 w-4 text-primary" />
                  Social Profiles (Verification)
                </h3>
                <p className="text-xs text-muted mt-0.5">
                  Social profiles submitted during seller registration for identity verification.
                </p>
              </div>

              <div className="space-y-3">
                {/* LinkedIn */}
                <div className="flex items-center justify-between rounded-xl border border-border bg-cream/30 p-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0077b5]/10 text-[#0077b5]">
                      <LinkedInIcon />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-fg">LinkedIn</p>
                      <p className="text-[11px] text-muted truncate max-w-[200px] sm:max-w-xs">
                        {effectiveUser?.socialProfiles?.linkedin || "Not provided"}
                      </p>
                    </div>
                  </div>
                  {effectiveUser?.socialProfiles?.linkedin && (
                    <a
                      href={effectiveUser.socialProfiles.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-primary hover:border-primary/40 transition"
                    >
                      <span>Visit</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>

                {/* Facebook */}
                <div className="flex items-center justify-between rounded-xl border border-border bg-cream/30 p-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1877f2]/10 text-[#1877f2]">
                      <FacebookIcon />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-fg">Facebook</p>
                      <p className="text-[11px] text-muted truncate max-w-[200px] sm:max-w-xs">
                        {effectiveUser?.socialProfiles?.facebook || "Not provided"}
                      </p>
                    </div>
                  </div>
                  {effectiveUser?.socialProfiles?.facebook && (
                    <a
                      href={effectiveUser.socialProfiles.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-primary hover:border-primary/40 transition"
                    >
                      <span>Visit</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>

                {/* Instagram */}
                <div className="flex items-center justify-between rounded-xl border border-border bg-cream/30 p-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#e1306c]/10 text-[#e1306c]">
                      <InstagramIcon />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-fg">Instagram</p>
                      <p className="text-[11px] text-muted truncate max-w-[200px] sm:max-w-xs">
                        {effectiveUser?.socialProfiles?.instagram || "Not provided"}
                      </p>
                    </div>
                  </div>
                  {effectiveUser?.socialProfiles?.instagram && (
                    <a
                      href={effectiveUser.socialProfiles.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-primary hover:border-primary/40 transition"
                    >
                      <span>Visit</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
