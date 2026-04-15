// Fonctions de validation extraites du composant personal-info-step

const NAME_RE = /^[a-zA-ZÀ-ÿ' ]+$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const DIGITS_RE = /^\d+$/;
const NIN_RE = /^[12][A-Z]\d{11}$/;

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
		return "Format invalide. Ex : 1G01198500654 (1 chiffre, 1 lettre, 11 chiffres).";
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
