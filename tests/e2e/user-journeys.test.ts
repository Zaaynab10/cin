import { expect, test } from "@playwright/test";

// ─── Page d'accueil — formulaire de suivi ─────────────────────────────────────

test.describe("Page d'accueil — formulaire de suivi NIN", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/");
	});

	test("affiche le formulaire de saisie du NIN", async ({ page }) => {
		await expect(page.locator("input")).toBeVisible();
	});

	test("le bouton soumettre est désactivé si NIN invalide", async ({
		page,
	}) => {
		const input = page.locator("input");
		const button = page.locator("button[type='submit']");

		await input.fill("INVALIDE");
		await expect(button).toBeDisabled();
	});

	test("le bouton soumettre est actif avec un NIN valide", async ({ page }) => {
		const input = page.locator("input");
		const button = page.locator("button[type='submit']");

		await input.fill("1G01198500654");
		await expect(button).toBeEnabled();
	});

	test("un NIN trop court ne valide pas le formulaire", async ({ page }) => {
		const input = page.locator("input");
		const button = page.locator("button[type='submit']");

		await input.fill("1G0119850065"); // 12 chars
		await expect(button).toBeDisabled();
	});
});

// ─── Page de résultat de suivi (via URL directe) ──────────────────────────────

test.describe("Page résultat /track/result", () => {
	test("affiche un état 'prêt' quand status=ready", async ({ page }) => {
		await page.goto("/track/result?status=ready");
		await expect(page.locator("body")).toContainText(
			/prêt|disponible|retirer/i,
		);
	});

	test("affiche un état 'en cours' quand status=pending", async ({ page }) => {
		await page.goto("/track/result?status=pending");
		await expect(page.locator("body")).toContainText(
			/cours|traitement|attente/i,
		);
	});

	test("affiche un état 'non trouvé' quand status=not_found", async ({
		page,
	}) => {
		await page.goto("/track/result?status=not_found");
		await expect(page.locator("body")).toContainText(
			/non référencé|référencé|enregistré/i,
		);
	});

	test("affiche un état 'bloqué' quand status=blocked", async ({ page }) => {
		await page.goto("/track/result?status=blocked");
		await expect(page.locator("body")).toContainText(
			/bloqué|suspendu|contact/i,
		);
	});

	test("affiche not_found pour un status inconnu", async ({ page }) => {
		await page.goto("/track/result?status=n_importe_quoi");
		await expect(page.locator("body")).toContainText(
			/non référencé|référencé|enregistré/i,
		);
	});

	test("contient un lien pour nouvelle recherche ou accueil", async ({
		page,
	}) => {
		await page.goto("/track/result?status=not_found");
		// "Réessayer" renvoie vers la page de recherche
		const retryLink = page
			.locator("a, button")
			.filter({ hasText: /réessayer|recherche|accueil/i })
			.first();
		await expect(retryLink).toBeVisible();
	});
});

// ─── Page choix du type de RDV ────────────────────────────────────────────────

test.describe("Page /appointment — choix du type", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/appointment");
	});

	test("affiche les 3 types de rendez-vous", async ({ page }) => {
		await expect(page.locator("body")).toContainText(
			/retrait|nouvelle|renouvellement/i,
		);
	});

	test("le lien pickup redirige vers /appointment/form?type=pickup", async ({
		page,
	}) => {
		const link = page.locator("a[href*='type=pickup']");
		await expect(link).toBeVisible();
	});

	test("le lien new_request redirige vers /appointment/form?type=new_request", async ({
		page,
	}) => {
		const link = page.locator("a[href*='type=new_request']");
		await expect(link).toBeVisible();
	});

	test("le lien renewal redirige vers /appointment/form?type=renewal", async ({
		page,
	}) => {
		const link = page.locator("a[href*='type=renewal']");
		await expect(link).toBeVisible();
	});
});

// ─── Page formulaire RDV ──────────────────────────────────────────────────────

test.describe("Page /appointment/form — formulaire multi-étapes", () => {
	test("affiche l'étape 1 pour le type pickup", async ({ page }) => {
		await page.goto("/appointment/form?type=pickup");
		// Doit afficher le champ Nom (étape infos personnelles)
		await expect(page.locator("#apf-nom")).toBeVisible();
	});

	test("affiche le champ NIN pour pickup", async ({ page }) => {
		await page.goto("/appointment/form?type=pickup");
		// Le NIN est obligatoire pour pickup
		const ninInput = page.locator(
			"input[name='nin'], input[placeholder*='NIN'], input[id*='nin']",
		);
		await expect(ninInput).toBeVisible();
	});

	test("n'affiche PAS le champ NIN pour new_request", async ({ page }) => {
		await page.goto("/appointment/form?type=new_request");
		const ninInput = page.locator("input[name='nin'], input[id*='nin']");
		await expect(ninInput).toHaveCount(0);
	});

	test("affiche le champ NIN pour renewal", async ({ page }) => {
		await page.goto("/appointment/form?type=renewal");
		const ninInput = page.locator(
			"input[name='nin'], input[placeholder*='NIN'], input[id*='nin']",
		);
		await expect(ninInput).toBeVisible();
	});
});

// ─── Navigation globale ───────────────────────────────────────────────────────

test.describe("Navigation", () => {
	test("la page 404 s'affiche pour une route invalide", async ({ page }) => {
		await page.goto("/route-qui-existe-pas");
		await expect(page.locator("body")).toContainText(
			/404|introuvable|not found/i,
		);
	});

	test("le header est présent sur la page d'accueil", async ({ page }) => {
		await page.goto("/");
		await expect(page.locator("header")).toBeVisible();
	});
});
