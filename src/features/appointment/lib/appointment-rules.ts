// Expected: Frontend-only helper rules for UX gating (never source of truth).
import type { AppointmentType } from "../types/appointment.types";

export function canDisplaySlotForType(_type: AppointmentType): boolean {
	return true;
}

export function canModifyBefore48h(startAtIsoUtc: string): boolean {
	const start = new Date(startAtIsoUtc).getTime();
	const now = Date.now();
	const diffMs = start - now;
	return diffMs >= 48 * 60 * 60 * 1000;
}
