import { describe, expect, it } from "vitest";
import {
	trackingRequestSchema,
	trackingResponseSchema,
} from "../../src/features/tracking/schemas/tracking.schema";

// ─── NIN format: [1|2][A-Z]\d{11} = 13 chars ─────────────────────────────────

describe("trackingRequestSchema — validation NIN", () => {
	// ── NIns valides (issus des fixtures mock) ───────────────────────────────────
	const validNins = [
		"1G01198500654",
		"2A05199012345",
		"1B03197611111",
		"2Z09200099999",
		"1X99200000001",
	];

	it.each(validNins)("accepte le NIN valide : %s", (nin) => {
		const result = trackingRequestSchema.safeParse({ nin });
		expect(result.success).toBe(true);
	});

	// ── NIns invalides ────────────────────────────────────────────────────────────
	it.each([
		["vide", ""],
		["trop court (12 chars)", "1G0119850065"],
		["trop long (14 chars)", "1G014198500654"],
		["commence par 3", "3A01198500654"],
		["deuxième char = chiffre", "1101198500654"],
		["que des chiffres", "1301198500654"],
		["format entièrement faux", "ABCDEFGHIJKLM"],
	])("rejette %s : '%s'", (_label, nin) => {
		const result = trackingRequestSchema.safeParse({ nin });
		expect(result.success).toBe(false);
	});

	// ── Normalisation ─────────────────────────────────────────────────────────────
	it("normalise les minuscules en majuscules avant validation", () => {
		// Le schéma applique .toUpperCase() → '1g01198500654' → '1G01198500654'
		const result = trackingRequestSchema.safeParse({ nin: "1g01198500654" });
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.nin).toBe("1G01198500654");
		}
	});

	it("supprime les espaces autour avec trim()", () => {
		const result = trackingRequestSchema.safeParse({
			nin: "  1G01198500654  ",
		});
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.nin).toBe("1G01198500654");
		}
	});

	it("renvoie un message d'erreur clair si NIN invalide", () => {
		const result = trackingRequestSchema.safeParse({ nin: "INVALIDE" });
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0].message).toContain("NIN invalide");
		}
	});
});

// ─── trackingResponseSchema ───────────────────────────────────────────────────

describe("trackingResponseSchema — réponse backend", () => {
	it("accepte status=ready avec availableAt", () => {
		const result = trackingResponseSchema.safeParse({
			status: "ready",
			availableAt: "2026-04-05",
		});
		expect(result.success).toBe(true);
	});

	it("accepte status=pending sans availableAt", () => {
		expect(
			trackingResponseSchema.safeParse({ status: "pending" }).success,
		).toBe(true);
	});

	it("accepte status=not_found", () => {
		expect(
			trackingResponseSchema.safeParse({ status: "not_found" }).success,
		).toBe(true);
	});

	it("accepte status=blocked", () => {
		expect(
			trackingResponseSchema.safeParse({ status: "blocked" }).success,
		).toBe(true);
	});

	it("accepte status=rate_limited", () => {
		expect(
			trackingResponseSchema.safeParse({ status: "rate_limited" }).success,
		).toBe(true);
	});

	it("rejette un status inconnu", () => {
		expect(
			trackingResponseSchema.safeParse({ status: "unknown_status" }).success,
		).toBe(false);
	});

	it("rejette un objet sans status", () => {
		expect(trackingResponseSchema.safeParse({}).success).toBe(false);
	});

	it("availableAt est optionnel", () => {
		const result = trackingResponseSchema.safeParse({ status: "ready" });
		expect(result.success).toBe(true);
		if (result.success) expect(result.data.availableAt).toBeUndefined();
	});
});
