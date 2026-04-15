import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
	testDir: "./tests/e2e",
	timeout: 30_000,
	retries: 0,
	reporter: "list",

	use: {
		baseURL: "http://localhost:3000",
		headless: true,
		screenshot: "only-on-failure",
	},

	projects: [
		{
			name: "edge",
			use: {
				...devices["Desktop Edge"],
				channel: "msedge", // utilise Edge déjà installé sur Windows
			},
		},
	],

	// Lance le frontend automatiquement avant les tests
	webServer: {
		command: "npm run dev",
		url: "http://localhost:3000",
		reuseExistingServer: true,
		timeout: 60_000,
	},
});
