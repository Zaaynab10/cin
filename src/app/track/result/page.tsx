// Expected: Tracking result page. Read server session result and render status-specific UI.
import { TrackingResultState } from "../../../features/tracking/components/tracking-result-state";

export default function TrackingResultPage() {
  // TODO: read tracking result from session on the server.

  return (
    <main className="container-page">
      <TrackingResultState status="pending" />
    </main>
  );
}
