import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  User,
  Mail,
  Shield,
  Calendar,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  KeyRound,
} from "lucide-react";
import PageHeader from "../../components/admin/layout/PageHeader";
import { useAuth } from "../../hooks/useAuth";
import { getAdminProfile } from "../../services/authServices";

const AdminProfile = () => {
  const { admin } = useAuth();
  const [profile, setProfile] = useState(admin || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchProfile = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getAdminProfile();
      const userData = res?.data?.user || res?.user || res?.data;
      if (userData) {
        setProfile(userData);
      }
    } catch (err) {
      if (!admin) {
        setError(err.message || "Failed to load admin profile.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    getAdminProfile()
      .then((res) => {
        if (!ignore) {
          const userData = res?.data?.user || res?.user || res?.data;
          if (userData) setProfile(userData);
        }
      })
      .catch((err) => {
        if (!ignore && !admin) {
          setError(err.message || "Failed to load admin profile.");
        }
      });

    return () => {
      ignore = true;
    };
  }, [admin]);

  const effectiveUser = profile || admin;
  const initial =
    effectiveUser?.name?.trim()?.charAt(0)?.toUpperCase() || "A";

  const formattedDate = effectiveUser?.createdAt
    ? new Date(effectiveUser.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Administrator";

  return (
    <div className="space-y-6">
      {/* Top Header & Breadcrumb */}
      <div>
        <Link
          to="/admin"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-fg transition mb-3"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Dashboard</span>
        </Link>

        <PageHeader
          title="Admin Profile"
          description="View your administrator credentials, access permissions and system role details."
          actions={
            <button
              type="button"
              onClick={fetchProfile}
              disabled={loading}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-white px-3.5 py-2 text-xs font-semibold text-gray-600 shadow-sm transition hover:bg-cream hover:text-fg disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>
          }
        />
      </div>

      {loading && !effectiveUser ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-border bg-white p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-3" />
          <p className="text-xs text-gray-500">Loading admin profile details...</p>
        </div>
      ) : error && !effectiveUser ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Unable to fetch admin profile</p>
            <p className="text-xs mt-1">{error}</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Main Identity Banner Card */}
          <div className="rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-white shadow-md">
                {initial}
              </div>

              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="text-xl sm:text-2xl font-bold text-fg">
                    {effectiveUser?.name || "Administrator"}
                  </h2>
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-xs font-semibold text-primary">
                    <Shield className="h-3 w-3" />
                    {effectiveUser?.role || "ADMIN"}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                    <CheckCircle2 className="h-3 w-3" />
                    {effectiveUser?.status || "ACTIVE"}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 pt-1">
                  <span className="flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-gray-400" />
                    {effectiveUser?.email || "—"}
                  </span>
                  {effectiveUser?.createdAt && (
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-gray-400" />
                      Created {formattedDate}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Account Overview Grid */}
          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm space-y-4">
            <div className="border-b border-border pb-3">
              <h3 className="text-sm font-bold text-fg flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                <span>Account Credentials & Overview</span>
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Core identity information linked to your system administrator profile.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-border bg-cream/30 p-4">
                <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  Admin Full Name
                </p>
                <p className="text-sm font-semibold text-fg mt-1">
                  {effectiveUser?.name || "Administrator"}
                </p>
              </div>

              <div className="rounded-xl border border-border bg-cream/30 p-4">
                <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  Official Email Address
                </p>
                <p className="text-sm font-semibold text-fg mt-1">
                  {effectiveUser?.email || "—"}
                </p>
              </div>

              <div className="rounded-xl border border-border bg-cream/30 p-4">
                <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  System Role
                </p>
                <p className="text-sm font-semibold text-fg mt-1">
                  {effectiveUser?.role || "ADMIN"}
                </p>
              </div>

              <div className="rounded-xl border border-border bg-cream/30 p-4">
                <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  Account Status
                </p>
                <p className="text-sm font-semibold text-emerald-700 mt-1">
                  {effectiveUser?.status || "ACTIVE"}
                </p>
              </div>
            </div>
          </div>

          {/* Security & Access Rights */}
          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm space-y-4">
            <div className="border-b border-border pb-3">
              <h3 className="text-sm font-bold text-fg flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-primary" />
                <span>Permissions & Administrative Access</span>
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Full root permissions granted across all marketplace management endpoints.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="flex items-center gap-2 rounded-xl border border-border bg-cream/20 p-3">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span className="font-medium text-fg">Website Review & Verification</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-border bg-cream/20 p-3">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span className="font-medium text-fg">Portfolio Projects Management</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-border bg-cream/20 p-3">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span className="font-medium text-fg">User & Order Oversight</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProfile;
