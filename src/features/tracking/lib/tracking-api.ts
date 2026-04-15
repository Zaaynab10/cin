// Expected: Tracking API adapter. Centralize backend calls and response parsing.
import { apiClient } from "../../../lib/api/client";
import {
	type TrackingResponse,
	trackingResponseSchema,
} from "../schemas/tracking.schema";

export async function fetchTrackingStatus(
	nin: string,
): Promise<TrackingResponse> {
	const data = await apiClient(`/cin/status?nin=${encodeURIComponent(nin)}`);
	return trackingResponseSchema.parse(data);
}
