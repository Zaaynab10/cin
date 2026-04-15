// Expected: Stateless hero block for landing page context and instructions.
import { TrackingForm } from "./tracking-form";

export function TrackingHero() {
	return (
		<section className="tracking-hero" aria-labelledby="tracking-hero-title">
			<div className="tracking-hero__media" aria-hidden="true" />
			<div className="tracking-hero__overlay" aria-hidden="true" />

			<div className="tracking-hero__content">
				<div className="tracking-hero__copy">
					<h1 id="tracking-hero-title" className="tracking-hero__title">
						Consultez l'état de votre Carte nationale d'identité
					</h1>
					<p className="tracking-hero__eyebrow">Service en ligne officiel</p>
					<p className="tracking-hero__subtitle">
						Vérifiez la disponibilité de votre CIN au consulat, sans
						déplacement.
					</p>
				</div>

				<TrackingForm />
			</div>
		</section>
	);
}
