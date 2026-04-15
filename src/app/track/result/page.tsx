// Expected: Tracking result page. Read status from URL params and render status-specific UI.
import { TrackingResultState } from "../../../features/tracking/components/tracking-result-state";
import type { TrackingStatus } from "../../../features/tracking/types/tracking.types";

const VALID_STATUSES: TrackingStatus[] = [
	"ready",
	"pending",
	"not_found",
	"blocked",
	"rate_limited",
];

type Props = { searchParams: Promise<{ status?: string }> };

export default async function TrackingResultPage({ searchParams }: Props) {
	const { status } = await searchParams;
	const resolved = VALID_STATUSES.includes(status as TrackingStatus)
		? (status as TrackingStatus)
		: "not_found";

	return <TrackingResultState status={resolved} />;
}
