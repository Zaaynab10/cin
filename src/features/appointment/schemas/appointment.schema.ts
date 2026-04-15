// Expected: Zod validation schemas for appointment creation and updates.
import { z } from "zod";

const NIN_REGEX = /^[12][A-Z]\d{11}$/;

export const appointmentSchema = z.object({
  // NIN sénégalais CEDEAO : [1|2][A-Z]\d{11} — 13 chars — ex : 1G01198500654
  // Optionnel pour new_request (pas encore de NIN), obligatoire pour pickup/renewal
  nin: z.string().trim().toUpperCase().regex(NIN_REGEX).optional(),
  fullName: z.string().min(3).max(100),
  email: z.string().email(),
  phone: z.string().min(8).max(20),
  type: z.enum(["pickup", "new_request", "renewal"]),
  slotId: z.string().min(1),
  consent: z.literal(true)
}).refine(
  (data) => data.type === "new_request" || !!data.nin,
  { message: "Le NIN est obligatoire pour ce type de demande.", path: ["nin"] }
);

export type AppointmentInput = z.infer<typeof appointmentSchema>;
