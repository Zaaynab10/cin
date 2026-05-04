// Expected: Entry page. Display tracking hero + tracking form and submit to internal POST /api/track.
import { TrackingHero } from "../features/tracking/components/tracking-hero";

export default function HomePage() {
	return <TrackingHero />;
}
