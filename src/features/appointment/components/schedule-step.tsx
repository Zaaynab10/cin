// Expected: Display available slots and let user pick a valid time slot.
"use client";

type ScheduleStepProps = {
  onNext: () => void;
  onPrevious: () => void;
};

export function ScheduleStep({ onNext, onPrevious }: ScheduleStepProps) {
  return (
    <div>
      <h2>Etape 2 - Choix du creneau</h2>
      <button type="button" onClick={onPrevious}>
        Retour
      </button>
      <button type="button" onClick={onNext}>
        Continuer
      </button>
    </div>
  );
}
