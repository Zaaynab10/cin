// Expected: Global runtime error UI for app router segment failures.
"use client";
import Link from "next/link";
import { IconAlertTriangle } from "../components/icons/IconAlertTriangle";
import { IconAlertCircle } from "../components/icons/IconAlertCircle";
import { IconRotateCcw } from "../components/icons/IconRotateCcw";
import { IconHome } from "../components/icons/IconHome";

type Props = { error: Error & { digest?: string }; reset: () => void };

export default function GlobalError({ reset }: Props) {
	// Recharge complet de la page pour vraiment relancer l'app et l'API
	function handleReload() {
		if (typeof window !== "undefined") {
			window.location.reload();
		} else {
			reset();
		}
	}
	return (
		<div className="ep ep--error">
			<div className="ep__inner">
				<p className="ep__code">500</p>
				<div className="ep__bar ep__bar--error" />
				<IconAlertTriangle className="ep__icon" />
				<h1 className="ep__title">Erreur serveur</h1>
				<p className="ep__subtitle">
					Une erreur interne s'est produite. Nos équipes ont été notifiées.
					Veuillez réessayer dans quelques instants.
				</p>
				<div className="ep__notice">
					<IconAlertCircle className="ep__notice-icon" />
					<p className="ep__notice-text">
						Contactez le consulat au{" "}
						<a href="tel:+33156892345" className="ep__notice-link">
							<strong>
								+33{"\u00a0"}1{"\u00a0"}56{"\u00a0"}89{"\u00a0"}23{"\u00a0"}45
							</strong>
						</a>{" "}
						si le problème persiste.
					</p>
				</div>
				<div className="ep__actions">
					<button className="ep__cta ep__cta--error" onClick={handleReload}>
						<IconRotateCcw className="ep__cta-icon" /> Réessayer
					</button>
					<Link className="ep__secondary" href="/">
						<IconHome className="ep__secondary-icon" />
						Retour à l'accueil
					</Link>
				</div>
			</div>
		</div>
	);
}
