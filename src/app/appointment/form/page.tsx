// Expected: Multi-step appointment form page. Loads type and orchestrates form flow.
import { AppointmentFormShell } from "../../../features/appointment/components/appointment-form-shell";

type AppointmentFormPageProps = {
	searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AppointmentFormPage({
	searchParams,
}: AppointmentFormPageProps) {
	const params = await searchParams;
	const type = typeof params?.type === "string" ? params.type : undefined;

	return <AppointmentFormShell initialType={type} />;
}
