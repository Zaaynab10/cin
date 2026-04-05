// Expected: Success state after creation. Show next actions and token-based link.
"use client";

type SuccessStepProps = {
  onNext: () => void;
};

export function SuccessStep({ onNext }: SuccessStepProps) {
  return (
    <div>
      <h2>Etape 4 - Succes</h2>
      <p>Votre rendez-vous est enregistre.</p>
      <button type="button" onClick={onNext}>
        Voir les documents
      </button>
    </div>
  );
}
