
import { budgetOptions } from "../data/filterOptions";

export const filterWebsites = (list, { category, budget, minDr, maxDays }) => {
  const range = budgetOptions.find((b) => b.value === budget) ?? budgetOptions[0];

  return list.filter((site) => {
    if (category !== "All" && site.category !== category) return false;
    if (site.price < range.min || site.price > range.max) return false;
    if (site.dr < minDr) return false;
    if (maxDays && parseInt(site.turnaround, 10) > maxDays) return false;
    return true;
  });
};

const sorters = {
  popular: (a, b) => parseInt(b.deals, 10) - parseInt(a.deals, 10),
  priceAsc: (a, b) => a.price - b.price,
  priceDesc: (a, b) => b.price - a.price,
  drDesc: (a, b) => b.dr - a.dr,
};

export const sortWebsites = (list, sort) =>
  [...list].sort(sorters[sort] ?? sorters.popular);