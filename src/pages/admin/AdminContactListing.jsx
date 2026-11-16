import { useState, useEffect, useCallback } from "react";
import {
  Mail,
  RefreshCw,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Phone,
  Building2,
  MessageSquare,
  X,
  Trash2,
  Shield,
  Eye,
} from "lucide-react";
import PageHeader from "../../components/admin/layout/PageHeader";
import {
  getAdminInquiries,
  updateAdminInquiry,
  deleteAdminInquiry,
} from "../../services/contactService";
import { useToast } from "../../hooks/useToast";

const inquiryTypes = [
  { value: "ALL", label: "All Types" },
  { value: "BUYER", label: "Buyer" },
  { value: "SELLER", label: "Seller" },
];

const statuses = [
  { value: "ALL", label: "All Statuses" },
  { value: "UNREAD", label: "Unread" },
  { value: "READ", label: "Read" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "RESOLVED", label: "Resolved" },
];

const AdminContactListing = () => {
  const toast = useToast();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // id being modified
  const [error, setError] = useState("");

  // Filters & Pagination
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [inquiryType, setInquiryType] = useState("ALL");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });

  // Detail / Update Modal State
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [editStatus, setEditStatus] = useState("UNREAD");
  const [adminNotes, setAdminNotes] = useState("");

  const fetchInquiries = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = {
        page,
        limit: pageSize,
        status: status !== "ALL" ? status : undefined,
        inquiryType: inquiryType !== "ALL" ? inquiryType : undefined,
      };

      const res = await getAdminInquiries(params);
      const data = res?.data || {};

      setInquiries(data.inquiries || []);
      const totalCount = data.pagination?.total ?? 0;
      const totalPages =
        data.pagination?.pages ?? Math.max(1, Math.ceil(totalCount / pageSize));

      setPagination({
        total: totalCount,
        totalPages,
      });
    } catch (err) {
      setError(err.message || "Failed to load contact inquiries.");
      toast.error(err.message || "Failed to load contact inquiries.");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, status, inquiryType, toast]);

  useEffect(() => {
    let ignore = false;
    const params = {
      page,
      limit: pageSize,
      status: status !== "ALL" ? status : undefined,
      inquiryType: inquiryType !== "ALL" ? inquiryType : undefined,
    };

    getAdminInquiries(params)
      .then((res) => {
        if (!ignore) {
          const data = res?.data || {};
          setInquiries(data.inquiries || []);
          const totalCount = data.pagination?.total ?? 0;
          const totalPages =
            data.pagination?.pages ?? Math.max(1, Math.ceil(totalCount / pageSize));
          setPagination({
            total: totalCount,
            totalPages,
          });
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(err.message || "Failed to load contact inquiries.");
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [page, pageSize, status, inquiryType]);

  const openDetailModal = (item) => {
    setSelectedInquiry(item);
    setEditStatus(item.status || "UNREAD");
    setAdminNotes(item.adminNotes || "");
  };

  const closeDetailModal = () => {
    setSelectedInquiry(null);
  };

  const handleUpdateStatus = async () => {
    if (!selectedInquiry) return;
    setActionLoading(selectedInquiry._id);

    try {
      await updateAdminInquiry(selectedInquiry._id, {
        status: editStatus,
        adminNotes: adminNotes.trim(),
      });
      toast.success("Inquiry updated successfully!");
      closeDetailModal();
      fetchInquiries();
    } catch (err) {
      toast.error(err.message || "Failed to update inquiry.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (contactId) => {
    if (!window.confirm("Are you sure you want to delete this inquiry permanently?")) {
      return;
    }
    setActionLoading(contactId);
    try {
      await deleteAdminInquiry(contactId);
      toast.success("Inquiry deleted successfully!");
      if (selectedInquiry?._id === contactId) closeDetailModal();
      fetchInquiries();
    } catch (err) {
      toast.error(err.message || "Failed to delete inquiry.");
    } finally {
      setActionLoading(null);
    }
  };

  const renderStatusBadge = (s) => {
    switch (s) {
      case "UNREAD":
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
            <Clock className="h-3 w-3" />
            Unread
          </span>
        );
      case "READ":
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
            <Eye className="h-3 w-3" />
            Read
          </span>
        );
      case "IN_PROGRESS":
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-purple-200 bg-purple-50 px-2.5 py-0.5 text-xs font-semibold text-purple-700">
            <RefreshCw className="h-3 w-3 animate-spin" />
            In Progress
          </span>
        );
      case "RESOLVED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
            <CheckCircle2 className="h-3 w-3" />
            Resolved
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-xs font-medium text-gray-600">
            {s || "Unknown"}
          </span>
        );
    }
  };

  const filteredInquiries = inquiries.filter((inq) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      inq.name?.toLowerCase().includes(q) ||
      inq.email?.toLowerCase().includes(q) ||
      inq.goal?.toLowerCase().includes(q) ||
      inq.message?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Contact Enquiries"
        description="Review inbound messages from prospective buyers, publishers and agency partners."
        actions={
          <button
            type="button"
            onClick={fetchInquiries}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-3.5 py-2 text-xs font-semibold text-gray-600 shadow-sm transition hover:bg-cream hover:text-fg disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        }
      />

      {/* Filter Toolbar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by sender name, email, or message keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-border bg-surface py-2 pl-9 pr-3 text-xs text-fg placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Status & Inquiry Type Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-1.5 text-xs text-gray-500">
            <Filter className="h-3.5 w-3.5" />
            <select
              value={inquiryType}
              onChange={(e) => {
                setInquiryType(e.target.value);
                setPage(1);
              }}
              className="bg-transparent text-xs font-medium text-fg focus:outline-none"
            >
              {inquiryTypes.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-1.5 text-xs text-gray-500">
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="bg-transparent text-xs font-medium text-fg focus:outline-none"
            >
              {statuses.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Table Content */}
      <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
        {loading ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-3 text-xs text-gray-500">Loading contact enquiries...</p>
          </div>
        ) : error ? (
          <div className="flex min-h-[250px] flex-col items-center justify-center p-8 text-center text-accent-red">
            <AlertCircle className="h-8 w-8 mb-2" />
            <p className="text-sm font-semibold">{error}</p>
            <button
              type="button"
              onClick={fetchInquiries}
              className="mt-3 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white"
            >
              Try Again
            </button>
          </div>
        ) : filteredInquiries.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center p-8 text-center">
            <Mail className="h-10 w-10 text-gray-300 mb-2" />
            <h3 className="text-sm font-bold text-fg">No enquiries found</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm">
              No contact submissions matched your filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-cream/40 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-5 py-3.5">Contact Name & Email</th>
                  <th className="px-4 py-3.5">Inquiry Type</th>
                  <th className="px-4 py-3.5">Goal</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Date Submitted</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredInquiries.map((inq) => {
                  const isOperating = actionLoading === inq._id;
                  const formattedDate = inq.createdAt
                    ? new Date(inq.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "—";

                  return (
                    <tr key={inq._id} className="transition-colors hover:bg-cream/20">
                      {/* Contact Info */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-xs">
                            {inq.name?.charAt(0)?.toUpperCase() || "U"}
                          </div>
                          <div>
                            <p className="font-bold text-fg text-xs">{inq.name}</p>
                            <p className="text-[11px] text-gray-400">{inq.email}</p>
                            {inq.phone && (
                              <p className="text-[10px] text-gray-400 mt-0.5">{inq.phone}</p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Inquiry Type */}
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                            inq.inquiryType === "SELLER"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          <Shield className="h-3 w-3" />
                          {inq.inquiryType}
                        </span>
                        {inq.companySize && (
                          <p className="text-[10px] text-gray-400 mt-0.5">
                            {inq.companySize} employees
                          </p>
                        )}
                      </td>

                      {/* Goal */}
                      <td className="px-4 py-4">
                        <p className="font-medium text-fg text-xs max-w-xs truncate">
                          {inq.goal}
                        </p>
                        <p className="text-[11px] text-gray-400 truncate max-w-xs mt-0.5">
                          "{inq.message}"
                        </p>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4">{renderStatusBadge(inq.status)}</td>

                      {/* Date */}
                      <td className="px-4 py-4 text-gray-500 text-xs">{formattedDate}</td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => openDetailModal(inq)}
                            className="inline-flex items-center gap-1 rounded-lg border border-border bg-white px-2.5 py-1 text-xs font-semibold text-gray-700 hover:bg-cream transition"
                            title="View full enquiry message"
                          >
                            <Eye className="h-3.5 w-3.5 text-gray-500" />
                            <span>View</span>
                          </button>

                          <button
                            type="button"
                            disabled={isOperating}
                            onClick={() => handleDelete(inq._id)}
                            className="rounded-lg p-1.5 text-gray-400 hover:text-accent-red hover:bg-red-50 transition disabled:opacity-40"
                            title="Delete enquiry"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
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

        {/* Pagination Controls */}
        {pagination.total > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between border-t border-border bg-cream/20 px-5 py-3 gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs text-gray-500">
                Showing{" "}
                <span className="font-semibold text-fg">
                  {(page - 1) * pageSize + 1}
                </span>
                –
                <span className="font-semibold text-fg">
                  {Math.min(page * pageSize, pagination.total)}
                </span>{" "}
                of <span className="font-semibold text-fg">{pagination.total}</span> enquiries
              </span>

              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <span>Per page:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPage(1);
                  }}
                  className="rounded-lg border border-border bg-white px-2 py-1 text-xs font-semibold text-fg outline-none focus:border-primary"
                >
                  {[10, 20, 50].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1 || loading}
                className="inline-flex items-center gap-1 rounded-lg border border-border bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-600 transition hover:bg-cream disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Prev</span>
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPage(p)}
                    className={`h-7 w-7 rounded-lg text-xs font-semibold transition ${
                      p === page
                        ? "bg-primary text-white shadow-xs"
                        : "border border-border bg-white text-gray-700 hover:bg-cream"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={page >= pagination.totalPages || loading}
                className="inline-flex items-center gap-1 rounded-lg border border-border bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-600 transition hover:bg-cream disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail / Update Status Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-fg flex items-center gap-2">
                  <span>Enquiry from {selectedInquiry.name}</span>
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Submitted as a <span className="font-semibold text-primary">{selectedInquiry.inquiryType}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={closeDetailModal}
                className="rounded-lg p-1 text-gray-400 hover:bg-cream hover:text-fg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Contact meta info */}
              <div className="grid grid-cols-2 gap-3 rounded-xl border border-border bg-cream/40 p-3.5">
                <div>
                  <span className="text-[10px] font-semibold text-gray-400 uppercase">Email</span>
                  <p className="font-medium text-fg">{selectedInquiry.email}</p>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-gray-400 uppercase">Phone</span>
                  <p className="font-medium text-fg">{selectedInquiry.phone || "—"}</p>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-gray-400 uppercase">Company Size</span>
                  <p className="font-medium text-fg">{selectedInquiry.companySize || "—"}</p>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-gray-400 uppercase">Goal</span>
                  <p className="font-medium text-fg">{selectedInquiry.goal}</p>
                </div>
              </div>

              {/* Message Box */}
              <div>
                <label className="block text-xs font-semibold text-fg mb-1">Message Content</label>
                <div className="rounded-xl border border-border bg-cream/20 p-3.5 text-xs text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {selectedInquiry.message}
                </div>
              </div>

              {/* Update Status and Notes */}
              <div className="space-y-3 pt-2 border-t border-border">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-fg mb-1">Update Status</label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className="w-full rounded-xl border border-border bg-white px-3 py-2 text-xs font-semibold text-fg outline-none focus:border-primary"
                    >
                      <option value="UNREAD">Unread</option>
                      <option value="READ">Read</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="RESOLVED">Resolved</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-fg mb-1 flex items-center gap-1.5">
                    <MessageSquare className="h-3.5 w-3.5 text-gray-400" />
                    <span>Internal Admin Notes</span>
                  </label>
                  <textarea
                    rows="3"
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Internal follow-up notes or action items..."
                    className="w-full rounded-xl border border-border bg-white p-3 text-xs text-fg placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => handleDelete(selectedInquiry._id)}
                  disabled={actionLoading === selectedInquiry._id}
                  className="inline-flex items-center gap-1 rounded-xl px-3 py-2 text-xs font-semibold text-accent-red hover:bg-red-50 transition"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Delete Enquiry</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={closeDetailModal}
                    className="rounded-xl border border-border bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-cream"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleUpdateStatus}
                    disabled={actionLoading === selectedInquiry._id}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-primary-light disabled:opacity-50"
                  >
                    {actionLoading === selectedInquiry._id && (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    )}
                    <span>Save Changes</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContactListing;
