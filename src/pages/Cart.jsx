import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingCart,
  Trash2,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  FileText,
} from "lucide-react";

const INITIAL_CART = [
  {
    id: "c1",
    websiteName: "TechRadar Insights",
    url: "techradar.com",
    serviceType: "Guest Post Placement",
    contentOption: "Client will provide article",
    turnaround: "2-3 business days",
    price: 320,
    quantity: 1,
  },
  {
    id: "c2",
    websiteName: "Business Insider Pulse",
    url: "businessinsider.com",
    serviceType: "Link Insertion / Niche Edit",
    contentOption: "Vifogix Copywriting Included",
    turnaround: "3-5 business days",
    price: 650,
    quantity: 1,
  },
];

const Cart = () => {
  const [items, setItems] = useState(INITIAL_CART);

  const removeItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = items.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);
  const platformFee = items.length > 0 ? 15 : 0;
  const total = subtotal + platformFee;

  return (
    <div className="min-h-[70vh] bg-bg py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ShoppingCart className="h-5 w-5 text-primary" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-fg sm:text-3xl">
              Shopping Cart
            </h1>
          </div>
          <p className="mt-1 text-sm text-muted">
            Review your selected publications and order details before checkout.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="flex min-h-[380px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-white p-8 text-center shadow-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cream text-muted">
              <ShoppingCart className="h-8 w-8 text-muted" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-fg">Your cart is empty</h3>
            <p className="mt-1 max-w-md text-xs text-muted">
              Looks like you haven&apos;t added any publication services to your cart yet.
            </p>
            <Link
              to="/marketplace"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-light"
            >
              Explore Publications
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Cart Items List */}
            <div className="space-y-4 lg:col-span-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col justify-between gap-4 rounded-2xl border border-border bg-white p-5 shadow-sm sm:flex-row sm:items-center"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-fg">{item.websiteName}</h3>
                      <span className="rounded-md bg-cream px-2 py-0.5 text-[11px] font-medium text-fg">
                        {item.url}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
                      <span className="inline-flex items-center gap-1">
                        <FileText className="h-3.5 w-3.5 text-primary" />
                        {item.serviceType}
                      </span>
                      <span>•</span>
                      <span>{item.contentOption}</span>
                      <span>•</span>
                      <span>TAT: {item.turnaround}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-6 border-t border-border pt-3 sm:border-t-0 sm:pt-0">
                    <div className="text-right">
                      <span className="text-base font-extrabold text-fg">
                        ${item.price}
                      </span>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="rounded-lg p-2 text-muted transition hover:bg-red-50 hover:text-red-600"
                      title="Remove from cart"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-2xl border border-border bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-fg">Order Summary</h2>

                <div className="mt-4 space-y-3 border-b border-border pb-4 text-xs text-muted">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-fg">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Processing & Quality Fee</span>
                    <span className="font-semibold text-fg">${platformFee.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-sm font-bold text-fg">
                  <span>Total Amount</span>
                  <span className="text-lg font-extrabold text-primary">
                    ${total.toFixed(2)}
                  </span>
                </div>

                <button
                  type="button"
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-light"
                >
                  <CreditCard className="h-4 w-4" />
                  Proceed to Checkout
                </button>

                <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-muted">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>100% Money-back placement guarantee</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
