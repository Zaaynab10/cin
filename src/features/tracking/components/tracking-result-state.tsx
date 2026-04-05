// Expected: State renderer for tracking result statuses and next actions.
import type { TrackingStatus } from "../types/tracking.types";

type TrackingResultStateProps = {
  status: TrackingStatus;
};

export function TrackingResultState({ status }: TrackingResultStateProps) {
  if (status === "ready") {
    return <p>Votre CIN est prete.</p>;
  }

  if (status === "pending") {
    return <p>Votre CIN est en cours de traitement.</p>;
  }

  if (status === "blocked") {
    return <p>Votre dossier est bloque. Merci de contacter le support.</p>;
  }

  return <p>Aucune CIN trouvee pour ce NIN.</p>;
}
