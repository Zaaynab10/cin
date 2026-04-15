import { describe, it, expect } from "vitest";
import { AppError } from "../../src/lib/errors/app-error";
import { mapApiError } from "../../src/lib/errors/map-api-error";

// ─── AppError ─────────────────────────────────────────────────────────────────

describe("AppError", () => {
	it("stocke le code, message et statusCode", () => {
		const err = new AppError("NOT_FOUND", "Ressource introuvable", 404);
		expect(err.code).toBe("NOT_FOUND");
		expect(err.message).toBe("Ressource introuvable");
		expect(err.statusCode).toBe(404);
	});

	it("utilise 400 comme statusCode par défaut", () => {
		const err = new AppError("BAD_REQUEST", "Erreur");
		expect(err.statusCode).toBe(400);
	});

	it("stocke les fieldErrors si fournis", () => {
		const fields = { email: ["Email invalide"], nin: ["NIN obligatoire"] };
		const err = new AppError(
			"VALIDATION",
			"Erreurs de validation",
			422,
			fields,
		);
		expect(err.fieldErrors).toEqual(fields);
	});

	it("fieldErrors est undefined si non fourni", () => {
		const err = new AppError("OOPS", "msg");
		expect(err.fieldErrors).toBeUndefined();
	});

	it("est une instance de Error", () => {
		const err = new AppError("ERR", "msg");
		expect(err).toBeInstanceOf(Error);
	});
});

// ─── mapApiError ──────────────────────────────────────────────────────────────

describe("mapApiError", () => {
	it("mappe une erreur complète du backend", () => {
		const raw = { code: "CONFLICT", message: "Doublon détecté", status: 409 };
		const err = mapApiError(raw);
		expect(err.code).toBe("CONFLICT");
		expect(err.message).toBe("Doublon détecté");
		expect(err.statusCode).toBe(409);
	});

	it("utilise UNKNOWN_ERROR si code absent", () => {
		const err = mapApiError({ message: "oops", status: 500 });
		expect(err.code).toBe("UNKNOWN_ERROR");
	});

	it("utilise 'Unexpected error' si message absent", () => {
		const err = mapApiError({ code: "ERR" });
		expect(err.message).toBe("Unexpected error");
	});

	it("utilise 500 si status absent", () => {
		const err = mapApiError({ code: "ERR", message: "msg" });
		expect(err.statusCode).toBe(500);
	});

	it("gère null sans planter", () => {
		const err = mapApiError(null);
		expect(err.code).toBe("UNKNOWN_ERROR");
		expect(err.statusCode).toBe(500);
	});

	it("gère undefined sans planter", () => {
		const err = mapApiError(undefined);
		expect(err.code).toBe("UNKNOWN_ERROR");
	});

	it("gère une string sans planter", () => {
		const err = mapApiError("erreur inattendue");
		expect(err.code).toBe("UNKNOWN_ERROR");
	});

	it("transfère les fieldErrors du backend", () => {
		const raw = {
			code: "VALIDATION",
			message: "Champs invalides",
			status: 422,
			fieldErrors: { email: ["format invalide"] },
		};
		const err = mapApiError(raw);
		expect(err.fieldErrors).toEqual({ email: ["format invalide"] });
	});

	it("retourne une instance de AppError", () => {
		const err = mapApiError({});
		expect(err).toBeInstanceOf(AppError);
	});
});
