// Expected: Zod schemas for tracking request/response validation.
import { z } from "zod";
import etatCivilData from "../../../../etat_civil_senegal.json";

const NIN_RE = /^[12](\d{3}|[A-Z]\d{2})\d{4}\d{5}$/;

const validDeptCodes = Array.isArray(etatCivilData)
	? etatCivilData.map((item: { code: string }) =>
			String(item.code).padStart(3, "0").toUpperCase(),
		)
	: [];

function validateNin(nin: string): boolean {
	if (!NIN_RE.test(nin)) return false;
	const deptCode = nin.slice(1, 4);
	return validDeptCodes.includes(deptCode);
}

function validateNinYear(nin: string): boolean {
	const year = parseInt(nin.slice(4, 8), 10);
	const currentYear = new Date().getFullYear();
	return year >= 1900 && year <= currentYear;
}

// Input payload expected by POST /api/track.
export const trackingRequestSchema = z.object({
	// CEDEAO Senegal NIN format: [1|2] + dept + année(4) + numéro(5) = 13 chars.
	// Ex : 1G01198500654 ou 1075202301234
	nin: z
		.string()
		.trim()
		.toUpperCase()
		.refine((v) => NIN_RE.test(v), {
			message: "NIN invalide: format attendu 1075202301234 ou 1A75202301234",
		})
		.refine((v) => validateNin(v), {
			message: "Code département invalide.",
		})
		.refine((v) => validateNinYear(v), {
			message: "Année invalide.",
		}),
});

// Status payload expected from backend tracking endpoint.
export const trackingResponseSchema = z.object({
	status: z.enum(["ready", "pending", "not_found", "blocked", "rate_limited"]),
	availableAt: z.string().optional(),
});

// TS helper types inferred from schemas.
export type TrackingRequest = z.infer<typeof trackingRequestSchema>;
export type TrackingResponse = z.infer<typeof trackingResponseSchema>;
