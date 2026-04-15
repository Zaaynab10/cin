import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";

export async function GET() {
	// On lit le fichier JSON côté serveur (hors dossier public)
	const filePath = path.join(process.cwd(), "etat_civil_senegal.json");
	try {
		const data = await fs.readFile(filePath, "utf-8");
		const json = JSON.parse(data);
		return NextResponse.json(json);
	} catch (_error) {
		return NextResponse.json(
			{ error: "Fichier non trouvé ou illisible" },
			{ status: 500 },
		);
	}
}
