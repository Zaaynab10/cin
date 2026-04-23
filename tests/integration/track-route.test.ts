import { describe, it, expect, vi } from "vitest";

// ─── Mock next/server avant tout import du handler ───────────────────────────
// NextResponse.json() retourne un objet simple inspectable dans les tests.
vi.mock("next/server", () => ({
	NextResponse: {
		json: (
			data: unknown,
			init?: { status?: number; headers?: Record<string, string> },
		) => ({
			status: init?.status ?? 200,
			headers: new Headers(Object.entries(init?.headers ?? {})),
			json: async () => data,
		}),
	},
}));

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeRequest(nin: string, ip = "127.0.0.1") {
	return new Request("http://localhost/api/track", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"x-forwarded-for": ip,
		},
		body: JSON.stringify({ nin }),
	});
}

// ─── Import du handler (après le mock) ───────────────────────────────────────

import { POST } from "../../src/app/api/track/route";

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("POST /api/track", () => {
	// ── Fixtures mock ──────────────────────────────────────────────────────────
	it("retourne status=ready pour un NIN CIN disponible", async () => {
		const res = await POST(makeRequest("1G01198500654", "10.0.1.1"));
		const body = (await res.json()) as Record<string, unknown>;

		expect(res.status).toBe(200);
		expect(body.status).toBe("ready");
		expect(body.availableAt).toBe("2026-04-05");
	});

	it("retourne status=pending pour un dossier en cours", async () => {
		const res = await POST(makeRequest("2A05199012345", "10.0.1.2"));
		const body = (await res.json()) as Record<string, unknown>;

		expect(res.status).toBe(200);
		expect(body.status).toBe("pending");
	});

	it("retourne status=not_found pour un NIN inconnu des fixtures", async () => {
		const res = await POST(makeRequest("1Z99198500001", "10.0.1.3"));
		const body = (await res.json()) as Record<string, unknown>;

		expect(res.status).toBe(200);
		expect(body.status).toBe("not_found");
	});

	it("retourne status=blocked pour un dossier suspendu", async () => {
		const res = await POST(makeRequest("2Z09200099999", "10.0.1.4"));
		const body = (await res.json()) as Record<string, unknown>;

		expect(res.status).toBe(200);
		expect(body.status).toBe("blocked");
	});

	// ── Validation NIN ─────────────────────────────────────────────────────────
	it("retourne 400 pour un NIN mal formé", async () => {
		const res = await POST(makeRequest("INVALIDE", "10.0.1.5"));
		const body = (await res.json()) as Record<string, unknown>;

		expect(res.status).toBe(400);
		expect(body.code).toBe("INVALID_NIN");
	});

	it("retourne 400 pour un NIN vide", async () => {
		const res = await POST(makeRequest("", "10.0.1.6"));

		expect(res.status).toBe(400);
	});

	// ── Rate limiting ──────────────────────────────────────────────────────────
	// Chaque test utilise une IP unique pour éviter toute interférence de compteur.
	it("autorise 5 requêtes par IP puis bloque la 6ème avec 429", async () => {
		const ip = "192.168.99.99";
		const nin = "1G01198500654";

		for (let i = 0; i < 5; i++) {
			const res = await POST(makeRequest(nin, ip));
			expect(res.status).toBe(200);
		}

		const res = await POST(makeRequest(nin, ip));
		const body = (await res.json()) as Record<string, unknown>;

		expect(res.status).toBe(429);
		expect(body.status).toBe("rate_limited");
		expect(res.headers.get("Retry-After")).toBe("60");
	});

	it("des IPs différentes ont des compteurs indépendants", async () => {
		const nin = "1G01198500654";

		// IP A remplit sa limite (utilise des IPs différentes des tests précédents)
		for (let i = 0; i < 5; i++) {
			await POST(makeRequest(nin, "172.16.0.1"));
		}
		const blockedA = await POST(makeRequest(nin, "172.16.0.1"));
		expect(blockedA.status).toBe(429);

		// IP B reste libre
		const allowedB = await POST(makeRequest(nin, "172.16.0.2"));
		expect(allowedB.status).toBe(200);
	});
});
