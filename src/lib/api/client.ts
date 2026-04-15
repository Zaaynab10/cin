// Expected: Single HTTP client wrapper for backend calls and shared error handling.
import { env } from "../config/env";

type ApiOptions = RequestInit;

export async function apiClient(path: string, options?: ApiOptions) {
	const response = await fetch(`${env.backendApiUrl}${path}`, {
		...options,
		headers: {
			"Content-Type": "application/json",
			...(options?.headers ?? {}),
		},
	});

	const data = await response.json().catch(() => ({}));

	if (!response.ok) {
		throw data;
	}

	return data;
}
