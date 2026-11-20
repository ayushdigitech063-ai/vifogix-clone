// src/pages/admin/AdminUserListing.jsx
import { useState, useEffect, useCallback, useId } from "react";
import {
  Users,
  Search,
  RefreshCw,
  Eye,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Shield,
  UserCheck,
  UserX,
  Mail,
  Calendar,
  X,
  Phone,
  Globe,
  Wallet,
  Clock,
} from "lucide-react";
import PageHeader from "../../components/admin/layout/PageHeader";
import {
  listAllUsers,
  getUserDetails,
  updateUserStatus,
  removeUser,
} from "../../services/userService";
import { useToast } from "../../hooks/useToast";

const roles = [
  { value: "ALL", label: "All Roles" },
  { value: "BUYER", label: "Buyer" },
  { value: "SELLER", label: "Seller (Publisher)" },
];

const statuses = [
  { value: "ALL", label: "All Statuses" },
  { value: "ACTIVE", label: "Active" },
  { value: "PENDING", label: "Pending" },
  { value: "REJECTED", label: "Rejected" },
];

const AdminUserListing = () => {
  const toast = useToast();
  const statusSelectId = useId();
  const reasonInputId = useId();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Filters & Pagination
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("ALL");
  const [status, setStatus] = useState("ALL");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });

  // Detail Modal State
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Status Change Modal State
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [targetUser, setTargetUser] = useState(null);
  const [newStatus, setNewStatus] = useState("ACTIVE");
  const [statusReason, setStatusReason] = useState("");

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: pageSize,
      };
      if (search.trim()) params.search = search.trim();
      if (role !== "ALL") params.role = role;
      if (status !== "ALL") params.status = status;

      const res = await listAllUsers(params);
      const list = res?.data?.users || res?.data || (Array.isArray(res) ? res : []);
      setUsers(Array.isArray(list) ? list : []);

      const totalCount = res?.data?.pagination?.total ?? res?.data?.total ?? (Array.isArray(list) ? list.length : 0);
      const pagesCount = res?.data?.pagination?.totalPages ?? Math.max(1, Math.ceil(totalCount / pageSize));
      setPagination({
        total: totalCount,
        totalPages: pagesCount,
      });
    } catch (err) {
      toast.error(err.message || "Failed to load users.");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, role, status, toast]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        const params = {
          page,
          limit: pageSize,
        };
        if (search.trim()) params.search = search.trim();
        if (role !== "ALL") params.role = role;
        if (status !== "ALL") params.status = status;

        const res = await listAllUsers(params);
        if (!active) return;
        const list = res?.data?.users || res?.data || (Array.isArray(res) ? res : []);
        setUsers(Array.isArray(list) ? list : []);

        const totalCount = res?.data?.pagination?.total ?? res?.data?.total ?? (Array.isArray(list) ? list.length : 0);
        const pagesCount = res?.data?.pagination?.totalPages ?? Math.max(1, Math.ceil(totalCount / pageSize));
        setPagination({
          total: totalCount,
          totalPages: pagesCount,
        });
      } catch (err) {
        if (!active) return;
        toast.error(err.message || "Failed to load users.");
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [page, pageSize, search, role, status, toast]);

  // Open User Detail View
  const handleViewUser = async (u) => {
    const userId = u._id || u.id;
    setSelectedUser(u);
    setDetailModalOpen(true);

    if (userId) {
      try {
        setDetailLoading(true);
        const res = await getUserDetails(userId);
        const fullData = res?.data?.user || res?.data || u;
        setSelectedUser(fullData);
      } catch {
        // Fallback to table row user data
      } finally {
        setDetailLoading(false);
      }
    }
  };

  // Open Status Change Modal
  const handleOpenStatusModal = (u) => {
    setTargetUser(u);
    setNewStatus(u.status || "ACTIVE");
    setStatusReason("");
    setStatusModalOpen(true);
  };

  // Submit Status Change
  const handleUpdateStatusSubmit = async (e) => {
    e.preventDefault();
    const userId = targetUser?._id || targetUser?.id;
    if (!userId) return;

    try {
      setActionLoading(true);
      await updateUserStatus(userId, {
        status: newStatus,
        reason: statusReason.trim() || undefined,
      });

      setUsers((prev) =>
        prev.map((item) =>
          (item._id || item.id) === userId ? { ...item, status: newStatus } : item
        )
      );

      if (selectedUser && (selectedUser._id || selectedUser.id) === userId) {
        setSelectedUser((prev) => ({ ...prev, status: newStatus }));
      }

      toast.success(`User status updated to ${newStatus}.`, "Status Updated");
      setStatusModalOpen(false);
    } catch (err) {
      toast.error(err.message || "Failed to update user status.");
    } finally {
      setActionLoading(false);
    }
  };

  // Remove / Delete User
  const handleDeleteUser = async (userId, userEmail) => {
    if (!window.confirm(`Are you sure you want to permanently remove user: ${userEmail || userId}?`)) {
      return;
    }

    try {
      setDeletingId(userId);
      await removeUser(userId);
      setUsers((prev) => prev.filter((u) => (u._id || u.id) !== userId));
      toast.success("User removed successfully.", "User Deleted");

      if (detailModalOpen && (selectedUser?._id || selectedUser?.id) === userId) {
        setDetailModalOpen(false);
      }
    } catch (err) {
      toast.error(err.message || "Failed to remove user.");
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusBadge = (userStatus) => {
    const s = String(userStatus || "ACTIVE").toUpperCase();
    switch (s) {
      case "ACTIVE":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
            <CheckCircle2 className="h-3 w-3" />
            Active
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
            <Clock className="h-3 w-3" />
            Pending
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700">
            <XCircle className="h-3 w-3" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
            {s}
          </span>
        );
    }
  };

  const getRoleBadge = (userRole) => {
    const r = String(userRole || "BUYER").toUpperCase();
    switch (r) {
      case "SELLER":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700">
            Publisher
          </span>
        );
      case "BUYER":
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
            Buyer
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title="Users Management"
          description="View registered buyers, publishers and admins, manage account statuses and activity."
        />
        <button
          type="button"
          onClick={fetchUsers}
          disabled={loading}
          className="flex items-center gap-1.5 self-start sm:self-auto rounded-lg border border-border bg-white px-3 py-2 text-xs font-semibold text-fg hover:border-primary hover:text-primary disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
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
            placeholder="Search by name, email or phone..."
            className="w-full rounded-lg border border-border py-2 pl-9 pr-3 text-xs text-fg focus:border-primary focus:outline-hidden"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Role Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-gray-500">Role:</span>
            <select
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                setPage(1);
              }}
              className="rounded-lg border border-border bg-white px-2.5 py-1.5 text-xs font-medium text-fg focus:border-primary focus:outline-hidden"
            >
              {roles.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-gray-500">Status:</span>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="rounded-lg border border-border bg-white px-2.5 py-1.5 text-xs font-medium text-fg focus:border-primary focus:outline-hidden"
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

      {/* Users Table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-xs">
        {loading ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="mt-3 text-xs font-medium text-gray-500">Loading registered users...</span>
          </div>
        ) : users.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center p-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cream text-primary">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="mt-3 text-base font-bold text-fg">No Users Found</h3>
            <p className="mt-1 max-w-sm text-xs text-gray-500">
              {search || role !== "ALL" || status !== "ALL"
                ? "No users match your filter criteria."
                : "No registered accounts currently exist."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-gray-50/75 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-5 py-3">User</th>
                  <th className="px-5 py-3">Role</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Email Verified</th>
                  <th className="px-5 py-3">Joined Date</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {users.map((u) => {
                  const userId = u._id || u.id;
                  const isDeleting = deletingId === userId;
                  const joinedDate = u.createdAt
                    ? new Date(u.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "—";

                  return (
                    <tr key={userId} className="transition-colors hover:bg-gray-50/60">
                      {/* Name & Email */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary uppercase">
                            {u.name
                              ? u.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .slice(0, 2)
                              : u.email
                              ? u.email[0].toUpperCase()
                              : "U"}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-fg truncate">{u.name || "Unnamed User"}</p>
                            <p className="text-gray-500 truncate text-[11px] flex items-center gap-1">
                              <Mail className="h-3 w-3 shrink-0" />
                              {u.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-5 py-3.5">{getRoleBadge(u.role)}</td>

                      {/* Status */}
                      <td className="px-5 py-3.5">{getStatusBadge(u.status)}</td>

                      {/* Email Verified */}
                      <td className="px-5 py-3.5">
                        {u.isEmailVerified ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-400">
                            <XCircle className="h-3.5 w-3.5" />
                            Unverified
                          </span>
                        )}
                      </td>

                      {/* Created At */}
                      <td className="px-5 py-3.5 text-gray-500">{joinedDate}</td>

                      {/* Actions */}
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleViewUser(u)}
                            className="rounded-lg p-1.5 text-gray-500 hover:bg-cream hover:text-primary"
                            title="View user details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenStatusModal(u)}
                            className="rounded-lg p-1.5 text-gray-500 hover:bg-amber-50 hover:text-amber-600"
                            title="Change account status"
                          >
                            <UserCheck className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteUser(userId, u.email)}
                            disabled={isDeleting}
                            className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
                            title="Remove user"
                          >
                            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
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
        {pagination.totalPages > 1 && (
          <div className="flex flex-col items-center justify-between gap-3 border-t border-border px-5 py-3 sm:flex-row">
            <span className="text-xs text-gray-500">
              Showing page <span className="font-semibold text-fg">{page}</span> of{" "}
              <span className="font-semibold text-fg">{pagination.totalPages}</span> ({pagination.total} total)
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
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={page >= pagination.totalPages || loading}
                className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-fg hover:bg-gray-50 disabled:opacity-50"
              >
                Next
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {detailModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 sm:p-6 backdrop-blur-xs animate-fade-in">
          <div className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-border bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm uppercase">
                  {selectedUser.name
                    ? selectedUser.name.slice(0, 2)
                    : selectedUser.email
                    ? selectedUser.email[0].toUpperCase()
                    : "U"}
                </div>
                <div>
                  <h3 className="text-base font-bold text-fg">{selectedUser.name || "User Details"}</h3>
                  <p className="text-xs text-gray-500">{selectedUser.email}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDetailModalOpen(false)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-fg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {detailLoading ? (
              <div className="flex min-h-[200px] flex-col items-center justify-center p-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span className="mt-2 text-xs text-gray-500">Fetching user data...</span>
              </div>
            ) : (
              <div className="mt-5 space-y-4 text-xs">
                {/* Status & Role Row */}
                <div className="grid grid-cols-2 gap-4 rounded-xl border border-border bg-gray-50/50 p-3">
                  <div>
                    <span className="text-gray-400 font-medium">Role</span>
                    <div className="mt-1">{getRoleBadge(selectedUser.role)}</div>
                  </div>
                  <div>
                    <span className="text-gray-400 font-medium">Status</span>
                    <div className="mt-1">{getStatusBadge(selectedUser.status)}</div>
                  </div>
                </div>

                {/* Information Grid */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between border-b border-border/50 py-2">
                    <span className="text-gray-500 flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5" />
                      Email
                    </span>
                    <span className="font-semibold text-fg">{selectedUser.email || "—"}</span>
                  </div>

                  <div className="flex items-center justify-between border-b border-border/50 py-2">
                    <span className="text-gray-500 flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5" />
                      Phone
                    </span>
                    <span className="font-semibold text-fg">{selectedUser.phone || "—"}</span>
                  </div>

                  <div className="flex items-center justify-between border-b border-border/50 py-2">
                    <span className="text-gray-500 flex items-center gap-1.5">
                      <Globe className="h-3.5 w-3.5" />
                      Country
                    </span>
                    <span className="font-semibold text-fg">{selectedUser.country || "—"}</span>
                  </div>

                  <div className="flex items-center justify-between border-b border-border/50 py-2">
                    <span className="text-gray-500 flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      Registered
                    </span>
                    <span className="font-semibold text-fg">
                      {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleString() : "—"}
                    </span>
                  </div>
                </div>

                {/* Actions inside modal */}
                <div className="mt-6 flex items-center justify-end gap-2 border-t border-border pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setDetailModalOpen(false);
                      handleOpenStatusModal(selectedUser);
                    }}
                    className="rounded-lg border border-border px-3 py-1.5 font-semibold text-fg hover:bg-gray-50"
                  >
                    Change Status
                  </button>
                  <button
                    type="button"
                    onClick={() => setDetailModalOpen(false)}
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

      {/* Update User Status Modal */}
      {statusModalOpen && targetUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 sm:p-6 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-md rounded-2xl border border-border bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-fg">Update Account Status</h3>
              <button
                type="button"
                onClick={() => setStatusModalOpen(false)}
                disabled={actionLoading}
                className="rounded-lg p-1 text-gray-400 hover:text-fg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateStatusSubmit} className="mt-4 space-y-4 text-xs">
              <div>
                <p className="text-gray-500">
                  User: <span className="font-bold text-fg">{targetUser.name || targetUser.email}</span>
                </p>
              </div>

              <div>
                <label htmlFor={statusSelectId} className="block font-bold text-fg">
                  Status *
                </label>
                <select
                  id={statusSelectId}
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border bg-white px-3 py-2 text-xs font-medium text-fg focus:border-primary focus:outline-hidden"
                >
                  <option value="ACTIVE">ACTIVE - Allow full platform access</option>
                  <option value="PENDING">PENDING - Normal paused status</option>
                  <option value="REJECTED">REJECTED - Temporarily restricted</option>
                </select>
              </div>

              <div>
                <label htmlFor={reasonInputId} className="block font-bold text-fg">
                  Reason / Notes (Optional)
                </label>
                <textarea
                  id={reasonInputId}
                  rows={3}
                  value={statusReason}
                  onChange={(e) => setStatusReason(e.target.value)}
                  placeholder="Optional internal note or explanation for the status change..."
                  className="mt-1 w-full rounded-lg border border-border p-2.5 text-xs text-fg focus:border-primary focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-border pt-4">
                <button
                  type="button"
                  onClick={() => setStatusModalOpen(false)}
                  disabled={actionLoading}
                  className="rounded-lg border border-border px-3 py-1.5 font-semibold text-fg hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-1.5 font-semibold text-white shadow-xs hover:bg-primary-light disabled:opacity-50"
                >
                  {actionLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  Save Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserListing;
