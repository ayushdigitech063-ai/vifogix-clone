// src/components/dashboard-sections/orders/OrderRow.jsx
import { Link } from "react-router-dom";
import { ExternalLink, Eye, AlertCircle } from "lucide-react";
import OrderStatusBadge from "./OrderStatusBadge";
import { formatCurrency, formatDate } from "../../../utils/formatters";

const OrderRow = ({ order }) => {
  const isPastDue =
    new Date(order.dueDate).getTime() < new Date("2026-11-12T12:00:00Z").getTime();
  const isOverdue =
    isPastDue && order.status !== "completed" && order.status !== "cancelled";

  return (
    <tr className="hover:bg-cream/30 transition-colors group">
      {/* Order ID */}
      <td className="py-4 px-4 sm:px-6 font-semibold text-fg">
        <Link
          to={`/publisher-dashboard/orders/${order.id}`}
          className="hover:text-primary transition-colors focus-visible:outline-2 focus-visible:outline-primary rounded"
        >
          #{order.id}
        </Link>
      </td>

      {/* Website */}
      <td className="py-4 px-4">
        <div className="flex items-center gap-2">
          <img
            src={`https://www.google.com/s2/favicons?domain=${order.domain}&sz=64`}
            alt=""
            className="h-4 w-4 shrink-0 rounded-sm object-contain"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
          <div className="flex items-center gap-1 min-w-0">
            <span className="font-semibold text-fg truncate group-hover:text-primary transition-colors">
              {order.domain}
            </span>
            <a
              href={`https://${order.domain}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted hover:text-fg p-0.5"
              title={`Visit ${order.domain}`}
            >
              <ExternalLink className="h-3 w-3" aria-hidden="true" />
              <span className="sr-only">Visit {order.domain}</span>
            </a>
          </div>
        </div>
      </td>

      {/* Package */}
      <td className="py-4 px-4">
        <p className="font-medium text-fg text-xs sm:text-sm line-clamp-1">
          {order.packageName}
        </p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-[10px] font-medium text-primary">
            {order.linkType || "DoFollow"}
          </span>
        </div>
      </td>

      {/* Buyer */}
      <td className="py-4 px-4 text-fg font-medium text-xs sm:text-sm">
        {order.buyer}
      </td>

      {/* Status */}
      <td className="py-4 px-4">
        <OrderStatusBadge status={order.status} />
      </td>

      {/* Amount */}
      <td className="py-4 px-4 text-right font-bold text-fg">
        {formatCurrency(order.amount)}
      </td>

      {/* Ordered Date */}
      <td className="py-4 px-4 text-xs text-muted whitespace-nowrap">
        {formatDate(order.createdAt)}
      </td>

      {/* Due Date */}
      <td className="py-4 px-4 text-xs whitespace-nowrap">
        <div className="flex items-center gap-1.5">
          <span className={isOverdue ? "font-semibold text-accent-red" : "text-fg"}>
            {formatDate(order.dueDate)}
          </span>
          {isOverdue && (
            <span
              className="inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[10px] font-bold bg-accent-red/10 text-accent-red"
              title="Order is past delivery deadline"
            >
              <AlertCircle className="h-2.5 w-2.5" aria-hidden="true" />
              Overdue
            </span>
          )}
        </div>
      </td>

      {/* Actions */}
      <td className="py-4 px-4 text-right whitespace-nowrap">
        <Link
          to={`/publisher-dashboard/orders/${order.id}`}
          className="inline-flex items-center gap-1 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs font-semibold text-fg hover:border-primary hover:text-primary transition-colors"
        >
          <Eye className="h-3.5 w-3.5" aria-hidden="true" />
          <span>View</span>
        </Link>
      </td>
    </tr>
  );
};

export default OrderRow;

