// Expected: Multi-step appointment form page. Loads type and orchestrates form flow.
import { AppointmentFormShell } from "../../../features/appointment/components/appointment-form-shell";

type AppointmentFormPageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export default function AppointmentFormPage({ searchParams }: AppointmentFormPageProps) {
  const type = typeof searchParams?.type === "string" ? searchParams.type : undefined;

  return (
    <main className="container-page">
      <AppointmentFormShell initialType={type} />
    </main>
  );
}
