// Ce composant affiche le formulaire de suivi CIN.
// Il envoie le NIN vers l'API interne /api/track via fetch (pas de form classique).
"use client";

// useRouter sert a naviguer vers une autre page apres un succes.
import { useRouter } from "next/navigation";
// useState stocke l'etat local du composant.
// FormEvent donne le bon type TypeScript pour l'evenement du formulaire.
import { useState, type FormEvent } from "react";

function IdCardIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="tracking-form__inline-icon" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <circle cx="9" cy="12" r="2" />
      <path d="M13.5 11H18" />
      <path d="M13.5 14H17" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="tracking-form__field-icon" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="6" />
      <path d="M16 16L21 21" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="tracking-form__help-icon" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 10V15" />
      <path d="M12 8H12.01" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="tracking-form__submit-icon" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12H19" />
      <path d="M13 6L19 12L13 18" />
    </svg>
  );
}

// Composant React responsable de la saisie du NIN et de l'envoi de la requete.
export function TrackingForm() {
  // nin contient la valeur actuellement tapee dans l'input.
  const [nin, setNin] = useState("");
  // isLoading permet de savoir si une requete est en cours.
  const [isLoading, setIsLoading] = useState(false);
  // errorMessage contient un message a afficher si la requete echoue.
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // router donne acces a la navigation programmatique cote client.
  const router = useRouter();

  // Soumission moderne: on controle la requete en JavaScript.
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    // Empêche le comportement HTML natif qui rechargerait la page.
    event.preventDefault();
    // On active l'etat de chargement pour desactiver le formulaire.
    setIsLoading(true);
    // On efface une ancienne erreur avant une nouvelle tentative.
    setErrorMessage(null);

    try {
      // Appel HTTP vers notre route interne Next.js.
      const response = await fetch("/api/track", {
        method: "POST",
        // On annonce qu'on envoie du JSON.
        headers: { "Content-Type": "application/json" },
        // Corps de la requete: on envoie le NIN saisi.
        body: JSON.stringify({ nin })
      });

      // Si le serveur renvoie une erreur HTTP (400, 500...), on la traite.
      if (!response.ok) {
        // On tente de lire le JSON d'erreur sans faire planter l'UI si le corps est vide.
        const errorBody = (await response.json().catch(() => null)) as
          | { message?: string }
          | null;
        // On affiche le message du serveur s'il existe, sinon un message generique.
        setErrorMessage(errorBody?.message ?? "Requête invalide");
        return;
      }

      // Si tout se passe bien, on navigue vers la page de resultat.
      router.push("/track/result");
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
          pattern="[12][A-Za-z][0-9]{11}"
          required
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

      <button type="submit" disabled={isLoading} className="tracking-form-card__submit">
        <span>{isLoading ? "Vérification..." : "Consulter le statut de ma demande"}</span>
        <ArrowRightIcon />
      </button>
    </form>
  );
}
