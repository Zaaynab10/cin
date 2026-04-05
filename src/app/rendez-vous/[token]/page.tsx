// Expected: Existing appointment management page. Load appointment by token and allow edit/cancel.
import { AppointmentDetails } from "../../../features/appointment/components/appointment-details";

type RendezVousPageProps = {
  params: { token: string };
};

export default function RendezVousPage({ params }: RendezVousPageProps) {
  return (
    <main className="container-page">
      <AppointmentDetails token={params.token} />
    </main>
  );
}
