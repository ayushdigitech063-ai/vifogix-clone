// src/components/marketplace-sections/ResultsToolbar.jsx
import { sortOptions } from "../../data/filterOptions";

const ResultsToolbar = ({ count, sort, onSortChange }) => (
  <div className="mb-5 mt-6 flex items-center justify-between gap-4">
    <p className="text-sm text-muted">
      <span className="font-semibold text-fg">{count.toLocaleString()}</span> websites found
    </p>

    <label className="flex items-center gap-2 text-sm text-muted">
      Sort by
      <select
        value={sort}
        onChange={(e) => onSortChange(e.target.value)}
        className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-fg outline-none focus:border-primary-light"
      >
        {sortOptions.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  </div>
);

export default ResultsToolbar;