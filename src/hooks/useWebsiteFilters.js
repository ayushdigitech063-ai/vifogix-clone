
import { useMemo, useState } from "react";
import { defaultFilters } from "../data/filterOptions";
import { filterWebsites, sortWebsites } from "../utils/filterWebsites";

export const useWebsiteFilters = (websites) => {
  const [filters, setFilters] = useState(defaultFilters);

  // chips come from the data, so a new category in websites.js appears automatically
  const categories = useMemo(
    () => ["All", ...new Set(websites.map((w) => w.category))],
    [websites]
  );

  const results = useMemo(
    () => sortWebsites(filterWebsites(websites, filters), filters.sort),
    [websites, filters]
  );

  // number shown on the "Filters" button (category and sort are not counted)
  const activeCount =
    Number(filters.budget !== "any") +
    Number(filters.minDr > 0) +
    Number(filters.maxDays > 0);

  const updateFilters = (patch) => setFilters((prev) => ({ ...prev, ...patch }));

  const clearFilters = () =>
    setFilters((prev) => ({ ...defaultFilters, category: prev.category, sort: prev.sort }));

  return { filters, categories, results, activeCount, updateFilters, clearFilters };
};