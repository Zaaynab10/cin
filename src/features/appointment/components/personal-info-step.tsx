// Expected: Capture identity/contact inputs with frontend validation feedback.
"use client";

type PersonalInfoStepProps = {
  onNext: () => void;
};

export function PersonalInfoStep({ onNext }: PersonalInfoStepProps) {
  return (
    <div>
      <h2>Etape 1 - Informations personnelles</h2>
      <button type="button" onClick={onNext}>
        Continuer
      </button>
    </div>
  );
}
