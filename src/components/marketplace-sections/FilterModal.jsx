// src/components/marketplace-sections/FilterModal.jsx
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { budgetOptions, drOptions, deliveryOptions } from "../../data/filterOptions";
import { filterWebsites } from "../../utils/filterWebsites";

const OptionGroup = ({ label, options, value, onChange }) => (
  <fieldset className="mt-6">
    <legend className="mb-3 text-sm font-semibold text-fg">{label}</legend>
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const isOn = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={isOn}
            onClick={() => onChange(o.value)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              isOn
                ? "border-primary bg-primary text-white"
                : "border-border bg-surface text-muted hover:border-primary-light hover:text-primary"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  </fieldset>
);

const FilterModal = ({ websites, filters, onApply, onClose }) => {
  const [draft, setDraft] = useState(filters);
  const count = filterWebsites(websites, draft).length;

  // close on Escape, and stop the page behind from scrolling
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [onClose]);

  const set = (patch) => setDraft((d) => ({ ...d, ...patch }));

  const handleApply = () => {
    onApply({ budget: draft.budget, minDr: draft.minDr, maxDays: draft.maxDays });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-fg/50 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="filters-title"
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[90vh] w-full max-w-lg flex-col rounded-t-2xl bg-surface sm:rounded-2xl"
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h3 id="filters-title">Filters</h3>
          <button onClick={onClose} aria-label="Close filters" className="rounded-full p-1 text-muted hover:text-fg">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto px-6 pb-6">
          <OptionGroup label="Budget" options={budgetOptions} value={draft.budget} onChange={(v) => set({ budget: v })} />
          <OptionGroup label="Domain Rating" options={drOptions} value={draft.minDr} onChange={(v) => set({ minDr: v })} />
          <OptionGroup label="Delivery time" options={deliveryOptions} value={draft.maxDays} onChange={(v) => set({ maxDays: v })} />
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-border px-6 py-4">
          <button
            onClick={() => set({ budget: "any", minDr: 0, maxDays: 0 })}
            className="text-sm font-medium text-muted underline-offset-2 hover:text-fg hover:underline"
          >
            Clear all
          </button>
          <button
            onClick={handleApply}
            disabled={count === 0}
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-50"
          >
            {count === 0 ? "No websites match" : `Show ${count} websites`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;