
export const sortOptions = [
  { value: "popular", label: "Best selling" },
  { value: "priceAsc", label: "Price: Low to High" },
  { value: "priceDesc", label: "Price: High to Low" },
  { value: "drDesc", label: "Highest DR" },
];

export const budgetOptions = [
  { value: "any", label: "Any budget", min: 0, max: Infinity },
  { value: "upto20", label: "Up to $20", min: 0, max: 20 },
  { value: "20to50", label: "$20 - $50", min: 20, max: 50 },
  { value: "over50", label: "$50+", min: 50, max: Infinity },
];

export const drOptions = [
  { value: 0, label: "Any DR" },
  { value: 50, label: "DR 50+" },
  { value: 70, label: "DR 70+" },
  { value: 90, label: "DR 90+" },
];

export const deliveryOptions = [
  { value: 0, label: "Any time" },
  { value: 3, label: "Up to 3 days" },
  { value: 7, label: "Up to 7 days" },
];

export const defaultFilters = {
  category: "All",
  sort: "popular",
  budget: "any",
  minDr: 0,
  maxDays: 0,
};