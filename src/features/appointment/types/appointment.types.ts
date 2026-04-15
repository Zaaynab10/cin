// Expected: Appointment types shared by form, hooks, and API adapters.
export type AppointmentType = "pickup" | "new_request" | "renewal";

// Data collected in step 2 (calendar + slot)
export type ScheduleData = {
  day: number;
  month: number;    // 0-indexed
  year: number;
  slotId: string;    // UUID from backend
  slotLabel: string; // e.g. "14h00" for display
};

// Raw data collected in step 1 (personal info form)
export type PersonalInfoData = {
  nom: string;
  prenom: string;
  nin?: string;  // Required for pickup/renewal, absent for new_request
  email: string;
  tel: string;
  consent: boolean;
};

export type AppointmentPayload = {
  nin?: string;
  fullName: string;
  email: string;
  phone: string;
  type: AppointmentType;
  slotId: string;
  consent: boolean;
};

export type AppointmentDetailsModel = {
  appointmentId: string;
  nin: string;
  fullName: string;
  email: string;
  phone: string;
  type: string;
  startAt: string;
  endAt: string;
  status: string;
  canEdit: boolean;
  canCancel: boolean;
};
