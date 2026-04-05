// Expected: Session configuration helper (placeholder) used by API routes and server pages.

export type SessionData = {
  trackingResult?: {
    status: "ready" | "pending" | "not_found" | "blocked";
    availableAt?: string;
  };
};

export async function getSessionData(): Promise<SessionData> {
  // TODO: wire iron-session or equivalent.
  return {};
}

export async function setSessionData(_data: SessionData): Promise<void> {
  // TODO: wire iron-session or equivalent.
}
