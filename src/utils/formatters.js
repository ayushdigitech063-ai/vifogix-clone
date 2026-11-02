export const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(date);
};

export const formatCurrency = (amount) => {
  if (typeof amount !== "number") {
    amount = Number(amount) || 0;
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(amount);
};

