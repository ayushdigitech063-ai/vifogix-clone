// src/components/dashboard-sections/orders/OrdersTable.jsx
import OrderRow from "./OrderRow";

const OrdersTable = ({ orders = [] }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[860px]">
        <caption className="sr-only">
          Customer orders table listing order IDs, domains, packages, buyers, delivery statuses, amounts, and deadlines
        </caption>
        <thead>
          <tr className="border-b border-border bg-cream/40 text-[11px] font-bold uppercase tracking-wider text-muted">
            <th scope="col" className="py-3.5 px-4 sm:px-6">Order ID</th>
            <th scope="col" className="py-3.5 px-4">Website</th>
            <th scope="col" className="py-3.5 px-4">Package</th>
            <th scope="col" className="py-3.5 px-4">Buyer</th>
            <th scope="col" className="py-3.5 px-4">Status</th>
            <th scope="col" className="py-3.5 px-4 text-right">Amount</th>
            <th scope="col" className="py-3.5 px-4">Ordered</th>
            <th scope="col" className="py-3.5 px-4">Due</th>
            <th scope="col" className="py-3.5 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border text-xs sm:text-sm">
          {orders.map((order) => (
            <OrderRow key={order.id} order={order} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersTable;

