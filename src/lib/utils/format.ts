// Expected: Generic value formatting helpers reused across features.
export function formatPhone(value: string): string {
	return value.replace(/\s+/g, "").trim();
}
