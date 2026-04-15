// Expected: 404 Not Found page. Shown when navigating to a non-existent route.
import Link from "next/link";
import { IconArrowLeft } from "../components/icons/IconArrowLeft";
import { IconLock } from "../components/icons/IconLock";
import { IconSearch } from "../components/icons/IconSearch";

export default function NotFoundPage() {
	return (
		<div className="ep">
			<div className="ep__inner">
				<p className="ep__code">404</p>
				<div className="ep__bar ep__bar--accent" />
				<IconLock className="ep__icon" />
				<h1 className="ep__title">Page introuvable</h1>
				<p className="ep__subtitle">
					La page que vous recherchez n'existe pas ou a été déplacée. Vérifiez
					l'URL ou retournez à l'accueil.
				</p>
				<div className="ep__actions">
					<Link className="ep__cta ep__cta--accent" href="/">
						<IconArrowLeft className="ep__cta-icon" /> Retour à l'accueil
					</Link>
					<Link className="ep__secondary" href="/">
						<IconSearch className="ep__secondary-icon" />
						Vérifier mon statut CIN
					</Link>
				</div>
			</div>
		</div>
	);
}
