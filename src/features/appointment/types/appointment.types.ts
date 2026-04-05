// Expected: Appointment types shared by form, hooks, and API adapters.
export type AppointmentType = "pickup" | "new_request" | "renewal";

export type AppointmentPayload = {
  nin: string;
  fullName: string;
  email: string;
  phone: string;
  type: AppointmentType;
  slotId: string;
  consent: boolean;
};

export type AppointmentDetailsModel = {
  appointmentId: string;
  status: string;
  canEdit: boolean;
  canCancel: boolean;
};
