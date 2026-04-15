import { describe, it, expect } from "vitest";
import { appointmentSchema } from "../../src/features/appointment/schemas/appointment.schema";

// ─── Données valides de base ───────────────────────────────────────────────

const basePickup = {
	nin: "1G01198500654",
	fullName: "Fatou Diallo",
	email: "fatou@example.com",
	phone: "0612345678",
	type: "pickup" as const,
	slotId: "slot-uuid-123",
	consent: true as const,
};

const baseRenewal = { ...basePickup, type: "renewal" as const };

const baseNewRequest = {
	fullName: "Moussa Ndiaye",
	email: "moussa@example.com",
	phone: "0698765432",
	type: "new_request" as const,
	slotId: "slot-uuid-456",
	consent: true as const,
};

// ─── Cas valides ───────────────────────────────────────────────────────────

describe("appointmentSchema — cas valides", () => {
	it("accepte un pickup avec NIN valide", () => {
		expect(appointmentSchema.safeParse(basePickup).success).toBe(true);
	});

	it("accepte un renewal avec NIN valide", () => {
		expect(appointmentSchema.safeParse(baseRenewal).success).toBe(true);
	});

	it("accepte un new_request sans NIN", () => {
		expect(appointmentSchema.safeParse(baseNewRequest).success).toBe(true);
	});

	it("accepte un new_request avec NIN optionnel fourni", () => {
		const result = appointmentSchema.safeParse({
			...baseNewRequest,
			nin: "2A05199012345",
		});
		expect(result.success).toBe(true);
	});

	it("normalise le NIN en majuscules", () => {
		const result = appointmentSchema.safeParse({
			...basePickup,
			nin: "1g01198500654",
		});
		expect(result.success).toBe(true);
		if (result.success) expect(result.data.nin).toBe("1G01198500654");
	});

	it("trim les espaces du NIN", () => {
		const result = appointmentSchema.safeParse({
			...basePickup,
			nin: "  1G01198500654  ",
		});
		expect(result.success).toBe(true);
		if (result.success) expect(result.data.nin).toBe("1G01198500654");
	});
});

// ─── NIN obligatoire selon le type ────────────────────────────────────────

describe("appointmentSchema — NIN conditionnel", () => {
	it("rejette pickup sans NIN", () => {
		const { nin: _nin, ...withoutNin } = basePickup;
		const result = appointmentSchema.safeParse(withoutNin);
		expect(result.success).toBe(false);
		if (!result.success) {
			const paths = result.error.issues.map((i) => i.path[0]);
			expect(paths).toContain("nin");
		}
	});

	it("rejette renewal sans NIN", () => {
		const { nin: _nin, ...withoutNin } = baseRenewal;
		const result = appointmentSchema.safeParse(withoutNin);
		expect(result.success).toBe(false);
	});

	it("rejette pickup avec NIN format invalide", () => {
		const result = appointmentSchema.safeParse({
			...basePickup,
			nin: "INVALIDE",
		});
		expect(result.success).toBe(false);
	});

	it("rejette un NIN trop court (12 chars)", () => {
		const result = appointmentSchema.safeParse({
			...basePickup,
			nin: "1G0119850065",
		});
		expect(result.success).toBe(false);
	});

	it("rejette un NIN trop long (14 chars)", () => {
		const result = appointmentSchema.safeParse({
			...basePickup,
			nin: "1G014198500654",
		});
		expect(result.success).toBe(false);
	});

	it("rejette un NIN commençant par 3", () => {
		const result = appointmentSchema.safeParse({
			...basePickup,
			nin: "3A01198500654",
		});
		expect(result.success).toBe(false);
	});

	it("rejette un NIN avec deuxième caractère chiffre", () => {
		const result = appointmentSchema.safeParse({
			...basePickup,
			nin: "1101198500654",
		});
		expect(result.success).toBe(false);
	});
});

// ─── Validation fullName ───────────────────────────────────────────────────

describe("appointmentSchema — fullName", () => {
	it("rejette un nom trop court (< 3 chars)", () => {
		expect(
			appointmentSchema.safeParse({ ...basePickup, fullName: "Ab" }).success,
		).toBe(false);
	});

	it("rejette un nom trop long (> 100 chars)", () => {
		expect(
			appointmentSchema.safeParse({ ...basePickup, fullName: "A".repeat(101) })
				.success,
		).toBe(false);
	});

	it("accepte un nom à la limite (3 chars)", () => {
		expect(
			appointmentSchema.safeParse({ ...basePickup, fullName: "Ali" }).success,
		).toBe(true);
	});
});

// ─── Validation email ──────────────────────────────────────────────────────

describe("appointmentSchema — email", () => {
	it("rejette un email sans @", () => {
		expect(
			appointmentSchema.safeParse({ ...basePickup, email: "pasvalide.com" })
				.success,
		).toBe(false);
	});

	it("rejette un email vide", () => {
		expect(
			appointmentSchema.safeParse({ ...basePickup, email: "" }).success,
		).toBe(false);
	});

	it("accepte un email valide", () => {
		expect(
			appointmentSchema.safeParse({ ...basePickup, email: "test@domain.org" })
				.success,
		).toBe(true);
	});
});

// ─── Validation phone ─────────────────────────────────────────────────────

describe("appointmentSchema — phone", () => {
	it("rejette un téléphone trop court (< 8 chars)", () => {
		expect(
			appointmentSchema.safeParse({ ...basePickup, phone: "061" }).success,
		).toBe(false);
	});

	it("rejette un téléphone trop long (> 20 chars)", () => {
		expect(
			appointmentSchema.safeParse({ ...basePickup, phone: "0".repeat(21) })
				.success,
		).toBe(false);
	});

	it("accepte un téléphone de 8 chars", () => {
		expect(
			appointmentSchema.safeParse({ ...basePickup, phone: "06123456" }).success,
		).toBe(true);
	});
});

// ─── Validation slotId ────────────────────────────────────────────────────

describe("appointmentSchema — slotId", () => {
	it("rejette un slotId vide", () => {
		expect(
			appointmentSchema.safeParse({ ...basePickup, slotId: "" }).success,
		).toBe(false);
	});
});

// ─── Validation consent ───────────────────────────────────────────────────

describe("appointmentSchema — consent", () => {
	it("rejette si consent est false", () => {
		expect(
			appointmentSchema.safeParse({ ...basePickup, consent: false }).success,
		).toBe(false);
	});

	it("rejette si consent est absent", () => {
		const { consent: _c, ...withoutConsent } = basePickup;
		expect(appointmentSchema.safeParse(withoutConsent).success).toBe(false);
	});
});

// ─── Validation type ──────────────────────────────────────────────────────

describe("appointmentSchema — type", () => {
	it("rejette un type inconnu", () => {
		expect(
			appointmentSchema.safeParse({ ...basePickup, type: "unknown" }).success,
		).toBe(false);
	});

	it("accepte les 3 types valides", () => {
		const types = ["pickup", "new_request", "renewal"] as const;
		for (const type of types) {
			const data =
				type === "new_request"
					? { ...baseNewRequest, type }
					: { ...basePickup, type };
			expect(appointmentSchema.safeParse(data).success).toBe(true);
		}
	});
});
