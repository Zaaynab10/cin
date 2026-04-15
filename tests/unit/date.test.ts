import { describe, it, expect } from "vitest";
import { toParisDisplay } from "../../src/lib/utils/date";

describe("toParisDisplay", () => {
	it("formate une date ISO UTC en format français lisible", () => {
		// 2026-04-08T10:00:00Z → "8 avr. 2026 à 10:00" (fr-FR, timeZone UTC)
		const result = toParisDisplay("2026-04-08T10:00:00Z");
		expect(result).toContain("2026");
		expect(result).toContain("avr");
	});

	it("formate le jour correctement", () => {
		const result = toParisDisplay("2026-04-08T09:30:00Z");
		expect(result).toContain("8");
	});

	it("formate l'heure correctement", () => {
		const result = toParisDisplay("2026-04-08T14:30:00Z");
		expect(result).toContain("14");
		expect(result).toContain("30");
	});

	it("formate une date en janvier", () => {
		const result = toParisDisplay("2026-01-15T08:00:00Z");
		expect(result).toContain("janv");
		expect(result).toContain("15");
		expect(result).toContain("2026");
	});

	it("formate une date en décembre", () => {
		const result = toParisDisplay("2026-12-25T00:00:00Z");
		expect(result).toContain("déc");
		expect(result).toContain("25");
	});

	it("gère minuit (00:00)", () => {
		const result = toParisDisplay("2026-06-01T00:00:00Z");
		expect(result).toContain("00");
	});

	it("retourne une chaîne non vide", () => {
		const result = toParisDisplay("2026-04-08T10:00:00Z");
		expect(typeof result).toBe("string");
		expect(result.length).toBeGreaterThan(0);
	});
});
