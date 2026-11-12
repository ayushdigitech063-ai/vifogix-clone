// src/components/dashboard-sections/orders/OrdersTableSkeleton.jsx

const OrdersTableSkeleton = ({ rows = 10 }) => {
  const dummyRows = Array.from({ length: rows }, (_, i) => i);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[860px]">
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
        <tbody className="divide-y divide-border">
          {dummyRows.map((idx) => (
            <tr key={idx} className="animate-pulse">
              <td className="py-4 px-4 sm:px-6">
                <div className="h-4 w-16 rounded bg-border/60" />
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center gap-2.5">
                  <div className="h-5 w-5 rounded-full bg-border/60" />
                  <div className="h-4 w-28 rounded bg-border/60" />
                </div>
              </td>
              <td className="py-4 px-4">
                <div className="h-4 w-36 rounded bg-border/60" />
                <div className="mt-1 h-3 w-16 rounded bg-border/40" />
              </td>
              <td className="py-4 px-4">
                <div className="h-4 w-24 rounded bg-border/60" />
              </td>
              <td className="py-4 px-4">
                <div className="h-5 w-20 rounded-full bg-border/60" />
              </td>
              <td className="py-4 px-4 text-right">
                <div className="ml-auto h-4 w-14 rounded bg-border/60" />
              </td>
              <td className="py-4 px-4">
                <div className="h-4 w-20 rounded bg-border/60" />
              </td>
              <td className="py-4 px-4">
                <div className="h-4 w-20 rounded bg-border/60" />
              </td>
              <td className="py-4 px-4 text-right">
                <div className="ml-auto h-7 w-14 rounded-lg bg-border/60" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersTableSkeleton;

