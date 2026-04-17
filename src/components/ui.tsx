export function formatINR(amount: number) {
  try {
    return amount.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    });
  } catch {
    return `₹${Math.round(amount)}`;
  }
}

export function formatDate(value: string | null | undefined) {
  if (!value) return "Unknown";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "Unknown";
  return d.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "2-digit" });
}

