// Expected: Map backend appointment data into stable frontend models.
import type { AppointmentDetailsModel } from "../types/appointment.types";

export function mapAppointmentDetails(
	input: AppointmentDetailsModel,
): AppointmentDetailsModel {
	return input;
}
