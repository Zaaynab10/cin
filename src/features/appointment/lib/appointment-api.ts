// Expected: Appointment API adapter for slots, create, read, update, and cancel operations.
import { apiClient } from "../../../lib/api/client";
import type { AppointmentInput } from "../schemas/appointment.schema";

export async function fetchSlots(type: string, date: string) {
  return apiClient(`/appointments/slots?type=${encodeURIComponent(type)}&date=${encodeURIComponent(date)}`);
}

export async function createAppointment(payload: AppointmentInput) {
  return apiClient("/appointments", { method: "POST", body: JSON.stringify(payload) });
}

export async function getAppointment(token: string) {
  return apiClient(`/appointments?token=${encodeURIComponent(token)}`);
}

export async function updateAppointment(token: string, slotId: string) {
  return apiClient(`/appointments?token=${encodeURIComponent(token)}`, {
    method: "PATCH",
    body: JSON.stringify({ slotId })
  });
}

export async function cancelAppointment(token: string) {
  return apiClient(`/appointments?token=${encodeURIComponent(token)}`, { method: "DELETE" });
}
