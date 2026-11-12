// src/components/dashboard-sections/orders/OrderStatusBadge.jsx
import {
  Clock,
  Loader2,
  CheckCircle,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    icon: Clock,
    className: "bg-accent-yellow/20 text-fg",
  },
  in_progress: {
    label: "In Progress",
    icon: Loader2,
    className: "bg-primary/10 text-primary",
  },
  delivered: {
    label: "Delivered",
    icon: CheckCircle,
    className: "bg-cream text-fg border border-border",
  },
  revision: {
    label: "Revision",
    icon: AlertCircle,
    className: "bg-accent-red/10 text-accent-red",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle2,
    className: "bg-primary text-white",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    className: "bg-fg/10 text-muted",
  },
};

const OrderStatusBadge = ({ status }) => {
  const key = String(status || "").toLowerCase();
  const config = STATUS_CONFIG[key] || {
    label: status || "Unknown",
    icon: Clock,
    className: "bg-cream text-muted border border-border",
  };

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${config.className}`}
    >
      <Icon
        className={`h-3 w-3 shrink-0 ${key === "in_progress" ? "animate-spin" : ""}`}
        aria-hidden="true"
      />
      <span>{config.label}</span>
    </span>
  );
};

export default OrderStatusBadge;

