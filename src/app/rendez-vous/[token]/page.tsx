// Expected: Existing appointment management page. Load appointment by token and allow edit/cancel.
import { AppointmentDetails } from "../../../features/appointment/components/appointment-details";

type RendezVousPageProps = {
  params: Promise<{ token: string }>;
};

export default async function RendezVousPage({ params }: RendezVousPageProps) {
  const { token } = await params;
  return (
    <main className="container-page">
      <AppointmentDetails token={token} />
    </main>
  );
}
