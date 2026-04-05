// Expected: Display required documents according to appointment type.
"use client";

type RequiredDocumentsStepProps = {
  onPrevious: () => void;
};

export function RequiredDocumentsStep({ onPrevious }: RequiredDocumentsStepProps) {
  return (
    <div>
      <h2>Etape 5 - Documents requis</h2>
      <ul>
        <li>Piece d'identite</li>
        <li>Justificatifs requis selon le type</li>
      </ul>
      <button type="button" onClick={onPrevious}>
        Retour
      </button>
    </div>
  );
}
