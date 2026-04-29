// Fonctions de validation extraites du composant personal-info-step

import etatCivilData from "../../../../etat_civil_senegal.json";

const NAME_RE = /^[a-zA-ZÀ-ÿ' ]+$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const DIGITS_RE = /^\d+$/;
const NIN_RE = /^[12](\d{3}|[A-Z]\d{2})\d{4}\d{5}$/;

const validDeptCodes = Array.isArray(etatCivilData)
	? etatCivilData.map((item: { code: string }) =>
			String(item.code).padStart(3, "0").toUpperCase(),
		)
	: [];

export function errNom(v: string) {
	if (!v.trim()) return "Le nom est obligatoire.";
	if (v.trim().length < 2) return "Minimum 2 caractères.";
	if (!NAME_RE.test(v.trim())) return "Lettres et espaces uniquement.";
}
export function errPrenom(v: string) {
	if (!v.trim()) return "Le prénom est obligatoire.";
	if (v.trim().length < 2) return "Minimum 2 caractères.";
	if (!NAME_RE.test(v.trim())) return "Lettres et espaces uniquement.";
}
export function errNin(v: string) {
	const normalized = v.trim().toUpperCase().replace(/\s/g, "");
	if (!normalized) return "Le NIN est obligatoire.";
	if (!NIN_RE.test(normalized))
		return "Format invalide. Ex : 1075202301234 ou 1A75202301234";

	// Vérification de l'année
	const year = parseInt(normalized.slice(4, 8), 10);
	const currentYear = new Date().getFullYear();
	if (year < 1900 || year > currentYear) {
		return "Année invalide.";
	}

	// Vérification du code département (3 caractères après le 1er)
	const deptCode = normalized.slice(1, 4);
	if (!validDeptCodes.includes(deptCode)) {
		return `Code département invalide (${deptCode}).`;
	}
}
export function errEmail(v: string) {
	if (!v.trim()) return "L'adresse email est obligatoire.";
	if (!EMAIL_RE.test(v.trim()))
		return "Format d'email invalide (ex. nom@domaine.fr).";
}
export function errTel(v: string) {
	const clean = v.replace(/[\s\-+()]/g, "");
	if (!clean) return "Le numéro de téléphone est obligatoire.";
	if (!DIGITS_RE.test(clean))
		return "Chiffres uniquement (ex. +33 6 12 34 56 78).";
	if (clean.length < 8 || clean.length > 20) return "Entre 8 et 20 chiffres.";
}
export type Fields = {
	nom: string;
	prenom: string;
	nin: string;
	email: string;
	tel: string;
};
export type Errs = Partial<Record<keyof Fields | "consent", string>>;
export function validateAll(
	f: Fields,
	consent: boolean,
	needsNin: boolean,
): Errs {
	return {
		nom: errNom(f.nom),
		prenom: errPrenom(f.prenom),
		nin: needsNin ? errNin(f.nin) : undefined,
		email: errEmail(f.email),
		tel: errTel(f.tel),
		consent: !consent ? "Vous devez accepter pour continuer." : undefined,
	};
}
