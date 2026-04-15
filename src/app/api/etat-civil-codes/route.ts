import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function GET() {
  // On lit le fichier JSON côté serveur (hors dossier public)
  const filePath = path.join(process.cwd(), "etat_civil_senegal.json");
  try {
    const data = await fs.readFile(filePath, "utf-8");
    const json = JSON.parse(data);
    return NextResponse.json(json);
  } catch (error) {
    return NextResponse.json({ error: "Fichier non trouvé ou illisible" }, { status: 500 });
  }
}
