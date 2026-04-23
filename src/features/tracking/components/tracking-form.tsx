// Ce composant affiche le formulaire de suivi CIN.
// Il envoie le NIN vers l'API interne /api/track via fetch (pas de form classique).
"use client";

// useRouter sert a naviguer vers une autre page apres un succes.
import { useRouter } from "next/navigation";
// useState stocke l'etat local du composant.
// FormEvent donne le bon type TypeScript pour l'evenement du formulaire.
// Chargement dynamique du fichier JSON côté client
import { type FormEvent, useEffect, useState } from "react";

function IdCardIcon() {
	return (
		<svg
			aria-hidden="true"
			viewBox="0 0 24 24"
			className="tracking-form__inline-icon"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.8"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<rect x="3" y="5" width="18" height="14" rx="3" />
			<circle cx="9" cy="12" r="2" />
			<path d="M13.5 11H18" />
			<path d="M13.5 14H17" />
		</svg>
	);
}

function SearchIcon() {
	return (
		<svg
			aria-hidden="true"
			viewBox="0 0 24 24"
			className="tracking-form__field-icon"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.9"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<circle cx="11" cy="11" r="6" />
			<path d="M16 16L21 21" />
		</svg>
	);
}

function InfoIcon() {
	return (
		<svg
			aria-hidden="true"
			viewBox="0 0 24 24"
			className="tracking-form__help-icon"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.8"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<circle cx="12" cy="12" r="8" />
			<path d="M12 10V15" />
			<path d="M12 8H12.01" />
		</svg>
	);
}

function ArrowRightIcon() {
	return (
		<svg
			aria-hidden="true"
			viewBox="0 0 24 24"
			className="tracking-form__submit-icon"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M5 12H19" />
			<path d="M13 6L19 12L13 18" />
		</svg>
	);
}

// NIN format: [1|2][A-Z][0-9]{11} = 13 chars
const NIN_REGEX = /^[12][A-Z]\d{11}$/;

// Composant React responsable de la saisie du NIN et de l'envoi de la requete.
export function TrackingForm() {
	// nin contient la valeur actuellement tapee dans l'input.
	const [nin, setNin] = useState("");
	// isLoading permet de savoir si une requete est en cours.
	const [isLoading, setIsLoading] = useState(false);
	// errorMessage contient un message a afficher si la requete echoue (erreur réseau uniquement).
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	// router donne acces a la navigation programmatique cote client.
	const router = useRouter();

	const isValidNin = NIN_REGEX.test(nin);
	// Extraction du code d'état civil (lettre+2 chiffres ou 3 chiffres)
	const [etatCivilCodes, setEtatCivilCodes] = useState<string[]>([]);
	useEffect(() => {
		fetch("/api/etat-civil-codes")
			.then((res) => res.json())
			.then((data) =>
				setEtatCivilCodes(data.map((c: { code: string }) => c.code)),
			);
	}, []);
	let ninCode = "";
	if (nin.length >= 4) {
		ninCode = nin.substring(1, 4); // caractères 2, 3, 4 (après le 1 ou 2)
	}
	const isValidEtatCivilCode = ninCode && etatCivilCodes.includes(ninCode);

	// Soumission moderne: on controle la requete en JavaScript.
	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		// Empêche le comportement HTML natif qui rechargerait la page.
		event.preventDefault();
		// On active l'etat de chargement pour desactiver le formulaire.
		setIsLoading(true);
		// On efface une ancienne erreur avant une nouvelle tentative.
		setErrorMessage(null);

		if (!isValidNin) {
			setErrorMessage(
				"Le NIN saisi n'est pas valide. Vérifie le format : 1 ou 2, une lettre, puis 11 chiffres.",
			);
			setIsLoading(false);
			return;
		}
		if (!isValidEtatCivilCode) {
			setErrorMessage(
				"Le code d'état civil (" +
					ninCode +
					") n'est pas reconnu. Merci de vérifier votre saisie.",
			);
			setIsLoading(false);
			return;
		}

		try {
			// Appel HTTP vers notre route interne Next.js.
			const response = await fetch("/api/track", {
				method: "POST",
				// On annonce qu'on envoie du JSON.
				headers: { "Content-Type": "application/json" },
				// Corps de la requete: on envoie le NIN saisi.
				body: JSON.stringify({ nin }),
			});

			// Si le serveur renvoie une erreur HTTP, on la traite.
			if (!response.ok) {
				// 429 = rate limited → on redirige vers la page dédiée
				if (response.status === 429) {
					router.push("/track/result?status=rate_limited");
					return;
				}
				// 400 = format invalide côté serveur (ne devrait pas arriver car le bouton est désactivé)
				setErrorMessage(
					"Le NIN envoyé n'est pas reconnu. Vérifie le format et réessaie.",
				);
				return;
			}

			// Si tout se passe bien, on navigue vers la page de resultat.
			const result = (await response.json()) as {
				status: string;
				availableAt?: string;
			};
			const params = new URLSearchParams({ status: result.status });
			if (result.availableAt) params.set("availableAt", result.availableAt);
			router.push(`/track/result?${params.toString()}`);
		} catch {
			// Cette branche capte surtout les erreurs reseau ou serveur inaccessible.
			setErrorMessage("Erreur réseau, réessayez dans un instant");
		} finally {
			// Le finally s'execute dans tous les cas: succes, erreur HTTP ou exception.
			setIsLoading(false);
		}
	}

	// JSX rendu dans le navigateur.
	return (
		// onSubmit relie l'envoi du formulaire a notre fonction handleSubmit.
		<form onSubmit={handleSubmit} className="tracking-form-card" noValidate>
			<div className="tracking-form-card__label">
				<IdCardIcon />
				<span>Numéro d'identification national (NIN)</span>
			</div>

			<div className="tracking-form-card__field-wrap">
				<SearchIcon />
				<input
					id="nin"
					name="nin"
					value={nin}
					onChange={(event) => setNin(event.target.value.toUpperCase())}
					placeholder="Ex: 1G01198500654"
					maxLength={13}
					disabled={isLoading}
					className="tracking-form-card__field"
					aria-describedby="nin-help"
				/>
			</div>

			{errorMessage ? (
				<p role="alert" className="tracking-form-card__error">
					{errorMessage}
				</p>
			) : null}

			<p id="nin-help" className="tracking-form-card__help">
				<InfoIcon />
				<span>Format attendu : 13 caractères (1/2 + lettre + 11 chiffres)</span>
			</p>

			<button
				type="submit"
				disabled={isLoading}
				className="tracking-form-card__submit"
			>
				<span>
					{isLoading ? "Vérification..." : "Consulter le statut de ma demande"}
				</span>
				<ArrowRightIcon />
			</button>
		</form>
	);
}
