// Expected: Show final summary before submit and trigger appointment creation.
"use client";

type ConfirmationStepProps = {
  onNext: () => void;
  onPrevious: () => void;
};

export function ConfirmationStep({ onNext, onPrevious }: ConfirmationStepProps) {
  return (
    <div>
      <h2>Etape 3 - Confirmation</h2>
      <button type="button" onClick={onPrevious}>
        Retour
      </button>
      <button type="button" onClick={onNext}>
        Confirmer
      </button>
    </div>
  );
}
