// Expected: Centralized env parsing and default-safe accessors.
export const env = {
  backendApiUrl: process.env.NEXT_PUBLIC_BACKEND_API_URL ?? "http://localhost:3001/api"
};
