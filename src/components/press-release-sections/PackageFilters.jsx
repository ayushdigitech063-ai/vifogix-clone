const PackageFilters = ({ price, maxPrice, onPrice, outlets, selected, onToggle, onReset }) => (
  <aside className="space-y-6 rounded-2xl border border-border bg-white p-5">
    <div className="flex items-center justify-between">
      <h3 className="text-base font-bold text-fg">Filters</h3>
      <button onClick={onReset} className="text-xs font-medium text-primary hover:underline">
        Reset
      </button>
    </div>

    <div>
      <h4 className="text-sm font-semibold text-fg">Price ($)</h4>
      <input
        type="range"
        min="0"
        max={maxPrice}
        value={price}
        onChange={(e) => onPrice(Number(e.target.value))}
        className="mt-3 w-full accent-primary"
      />
      <p className="mt-1 text-xs text-gray-500">Up to ${price}</p>
    </div>

    <div>
      <h4 className="text-sm font-semibold text-fg">Featured Outlets</h4>
      <ul className="mt-3 space-y-2">
        {outlets.map((o) => (
          <li key={o.name}>
            <label className="flex cursor-pointer items-center justify-between text-sm text-gray-600">
              <span className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selected.includes(o.name)}
                  onChange={() => onToggle(o.name)}
                  className="h-4 w-4 accent-primary"
                />
                {o.name}
              </span>
              <span className="text-xs text-gray-400">{o.count}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  </aside>
);

export default PackageFilters;