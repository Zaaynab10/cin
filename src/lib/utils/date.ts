// Expected: Date helper utilities for UTC parsing/formatting and Paris display conversions.
export function toParisDisplay(isoUtc: string): string {
  const date = new Date(isoUtc);
  return new Intl.DateTimeFormat("fr-FR", {
    timeZone: "UTC",
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
}
