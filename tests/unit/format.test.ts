import { describe, it, expect } from "vitest";
import { formatPhone } from "../../src/lib/utils/format";

describe("formatPhone", () => {
	it("supprime les espaces internes", () => {
		expect(formatPhone("+33 1 56 89 23 45")).toBe("+33156892345");
	});

	it("laisse un numéro déjà propre intact", () => {
		expect(formatPhone("+33156892345")).toBe("+33156892345");
	});

	it("supprime les espaces en début et fin", () => {
		expect(formatPhone("  +33156892345  ")).toBe("+33156892345");
	});

	it("supprime les tabulations et sauts de ligne", () => {
		expect(formatPhone("+33\t1\n56\r89 23 45")).toBe("+33156892345");
	});

	it("gère une chaîne vide", () => {
		expect(formatPhone("")).toBe("");
	});
});
