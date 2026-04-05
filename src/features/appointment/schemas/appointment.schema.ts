// Expected: Zod validation schemas for appointment creation and updates.
import { z } from "zod";

export const appointmentSchema = z.object({
  nin: z.string().regex(/^\d{9}$/),
  fullName: z.string().min(3).max(100),
  email: z.string().email(),
  phone: z.string().min(8).max(20),
  type: z.enum(["pickup", "new_request", "renewal"]),
  slotId: z.string().min(1),
  consent: z.literal(true)
});

export type AppointmentInput = z.infer<typeof appointmentSchema>;
