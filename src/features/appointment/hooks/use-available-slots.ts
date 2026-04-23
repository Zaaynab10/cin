// Expected: Client hook fetching and caching available slots for selected type/date.
"use client";

import { useEffect, useState } from "react";

import { fetchSlots } from "../lib/appointment-api";

export function useAvailableSlots(type: string, date: string) {
	const [slots, setSlots] = useState<unknown[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		let cancelled = false;

		async function run() {
			if (!type || !date) {
				setSlots([]);
				return;
			}

			setLoading(true);
			try {
				const data = await fetchSlots(type, date);
				if (!cancelled) {
					setSlots(
						Array.isArray((data as { slots?: unknown[] }).slots)
							? (data as { slots: unknown[] }).slots
							: [],
					);
				}
			} finally {
				if (!cancelled) {
					setLoading(false);
				}
			}
		}

		void run();

		return () => {
			cancelled = true;
		};
	}, [type, date]);

	return { slots, loading };
}
