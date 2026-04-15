// Expected: Zod schemas for tracking request/response validation.
import { z } from "zod";

// Input payload expected by POST /api/track.
export const trackingRequestSchema = z.object({
	// CEDEAO Senegal NIN format: [1|2][A-Z][0-9]{2}[0-9]{4}[0-9]{5} = 13 chars.
	nin: z
		.string()
		.trim()
		.toUpperCase()
		.regex(
			/^[12][A-Z]\d{2}\d{4}\d{5}$/,
			"NIN invalide: format attendu 1G01198500654",
		),
});

// Status payload expected from backend tracking endpoint.
export const trackingResponseSchema = z.object({
	status: z.enum(["ready", "pending", "not_found", "blocked", "rate_limited"]),
	availableAt: z.string().optional(),
});

// TS helper types inferred from schemas.
export type TrackingRequest = z.infer<typeof trackingRequestSchema>;
export type TrackingResponse = z.infer<typeof trackingResponseSchema>;
