import { describe, expect, it } from "vitest";
import { classNames } from "../../src/lib/utils/classnames";

describe("classNames", () => {
	it("joint plusieurs classes avec un espace", () => {
		expect(classNames("foo", "bar", "baz")).toBe("foo bar baz");
	});

	it("filtre les valeurs false", () => {
		expect(classNames("foo", false, "bar")).toBe("foo bar");
	});

	it("filtre les valeurs null", () => {
		expect(classNames("foo", null, "bar")).toBe("foo bar");
	});

	it("filtre les valeurs undefined", () => {
		expect(classNames("foo", undefined, "bar")).toBe("foo bar");
	});

	it("retourne une chaîne vide si tout est falsy", () => {
		expect(classNames(false, null, undefined)).toBe("");
	});

	it("retourne la seule classe si un seul argument valide", () => {
		expect(classNames("only")).toBe("only");
	});

	it("retourne une chaîne vide sans arguments", () => {
		expect(classNames()).toBe("");
	});

	it("gère un mélange de valides et falsy", () => {
		expect(classNames(null, "a", false, "b", undefined, "c")).toBe("a b c");
	});
});
