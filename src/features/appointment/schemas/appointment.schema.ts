// Expected: Zod validation schemas for appointment creation and updates.
import { z } from "zod";

export const appointmentSchema = z.object({
  // NIN sénégalais CEDEAO : [1|2][A-Z]\d{11} — 13 chars — ex : 1G01198500654
  nin: z.string().trim().toUpperCase().regex(/^[12][A-Z]\d{11}$/),
  fullName: z.string().min(3).max(100),
  email: z.string().email(),
  phone: z.string().min(8).max(20),
  type: z.enum(["pickup", "new_request", "renewal"]),
  slotId: z.string().min(1),
  consent: z.literal(true)
});

export type AppointmentInput = z.infer<typeof appointmentSchema>;
