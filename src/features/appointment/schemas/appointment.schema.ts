// Expected: Zod validation schemas for appointment creation and updates.
import { z } from "zod";
import etatCivilData from "../../../../etat_civil_senegal.json";

const NIN_RE = /^[12](\d{3}|[A-Z]\d{2})\d{4}\d{5}$/;

const validDeptCodes = Array.isArray(etatCivilData)
	? etatCivilData.map((item: { code: string }) =>
			String(item.code).padStart(3, "0").toUpperCase(),
		)
	: [];

function validateNin(nin: string): boolean {
	if (!NIN_RE.test(nin)) return false;
	const deptCode = nin.slice(1, 4);
	return validDeptCodes.includes(deptCode);
}

function validateNinYear(nin: string): boolean {
	const year = parseInt(nin.slice(4, 8), 10);
	const currentYear = new Date().getFullYear();
	return year >= 1900 && year <= currentYear;
}

export const appointmentSchema = z.object({
	// NIN sénégalais CEDEAO : [1|2] + dept(3 chiffres ou lettre+2 chiffres) + année(4) + numéro(5) = 13 chars
	// Ex : 1G01198500654 ou 1075202301234
	nin: z
		.string()
		.trim()
		.toUpperCase()
		.refine((v) => NIN_RE.test(v), {
			message: "Format invalide. Ex : 1075202301234 ou 1A75202301234",
		})
		.refine((v) => validateNin(v), {
			message: "Code département invalide.",
		})
		.refine((v) => validateNinYear(v), {
			message: "Année invalide.",
		}),
	fullName: z.string().min(3).max(100),
	email: z.string().email(),
	phone: z.string().min(8).max(20),
	type: z.enum(["pickup", "new_request", "renewal"]),
	slotId: z.string().min(1),
	consent: z.literal(true),
});

export type AppointmentInput = z.infer<typeof appointmentSchema>;
