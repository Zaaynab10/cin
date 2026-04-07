// Expected: Tracking domain types used by UI and API mapping.
export type TrackingStatus = "ready" | "pending" | "not_found" | "blocked" | "rate_limited";

export type TrackingResult = {
  status: TrackingStatus;
  availableAt?: string;
};
