// Expected: Centralized env parsing and default-safe accessors.
export const env = {
	backendApiUrl:
		process.env.NEXT_PUBLIC_BACKEND_API_URL ??
		(typeof window !== "undefined" ? "/api" : "http://localhost:3001/api"),
	sessionSecret: process.env.SESSION_SECRET ?? "change-me-in-env",
};
