// Expected: State renderer for all tracking result statuses.
import Link from "next/link";
import type { TrackingStatus } from "../types/tracking.types";

// ─── Entry point ──────────────────────────────────────────────────────────────

type Props = { status: TrackingStatus };

export function TrackingResultState({ status }: Props) {
	if (status === "ready") return <ReadyState />;
	if (status === "pending") return <PendingState />;
	if (status === "not_found") return <NotFoundState />;
	if (status === "blocked") return <BlockedState />;
	return <RateLimitedState />;
}

// ─── SVG icons ────────────────────────────────────────────────────────────────

type SvgProps = { className?: string };

function IconCheck({ className }: SvgProps) {
	return (
		<svg
			className={className}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2.5"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<polyline points="20 6 9 17 4 12" />
		</svg>
	);
}

function IconHourglass({ className }: SvgProps) {
	return (
		<svg
			className={className}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<path d="M5 22h14" />
			<path d="M5 2h14" />
			<path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" />
			<path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
		</svg>
	);
}

function IconXCircle({ className }: SvgProps) {
	return (
		<svg
			className={className}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<circle cx="12" cy="12" r="10" />
			<line x1="15" y1="9" x2="9" y2="15" />
			<line x1="9" y1="9" x2="15" y2="15" />
		</svg>
	);
}

function IconMapPin({ className }: SvgProps) {
	return (
		<svg
			className={className}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
			<circle cx="12" cy="10" r="3" />
		</svg>
	);
}

function IconClock({ className }: SvgProps) {
	return (
		<svg
			className={className}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<circle cx="12" cy="12" r="10" />
			<polyline points="12 6 12 12 16 14" />
		</svg>
	);
}

function IconAlertTriangle({ className }: SvgProps) {
	return (
		<svg
			className={className}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
			<line x1="12" y1="9" x2="12" y2="13" />
			<line x1="12" y1="17" x2="12.01" y2="17" />
		</svg>
	);
}

function IconAlertCircle({ className }: SvgProps) {
	return (
		<svg
			className={className}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<circle cx="12" cy="12" r="10" />
			<line x1="12" y1="8" x2="12" y2="12" />
			<line x1="12" y1="16" x2="12.01" y2="16" />
		</svg>
	);
}

function IconArrowRight({ className }: SvgProps) {
	return (
		<svg
			className={className}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<line x1="5" y1="12" x2="19" y2="12" />
			<polyline points="12 5 19 12 12 19" />
		</svg>
	);
}

function IconRotateCcw({ className }: SvgProps) {
	return (
		<svg
			className={className}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<polyline points="1 4 1 10 7 10" />
			<path d="M3.51 15a9 9 0 1 0 .49-3.5" />
		</svg>
	);
}

function IconSearch({ className }: SvgProps) {
	return (
		<svg
			className={className}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<circle cx="11" cy="11" r="8" />
			<line x1="21" y1="21" x2="16.65" y2="16.65" />
		</svg>
	);
}

function IconHome({ className }: SvgProps) {
	return (
		<svg
			className={className}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
			<polyline points="9 22 9 12 15 12 15 22" />
		</svg>
	);
}

function IconShield({ className }: SvgProps) {
	return (
		<svg
			className={className}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
		</svg>
	);
}

// ─── Page 1 : READY ──────────────────────────────────────────────────────────

function ReadyState() {
	return (
		<div className="rs-page rs-page--ready" role="status">
			{/* Zone 1 — hero coloré */}
			<div className="rs__hero">
				<div className="rs__icon-wrap">
					<IconCheck className="rs__icon" />
				</div>
				<h1 className="rs__title">Votre CIN est disponible au retrait !</h1>
				<p className="rs__subtitle">
					Présentez-vous au guichet du Consulat Général du Sénégal à Paris.
				</p>
			</div>
			{/* Zone 2 — carte blanche */}
			<div className="rs__body">
				<ul className="rs__info-list">
					<li className="rs__info-item">
						<IconMapPin className="rs__info-icon rs__info-icon--green" />
						<div className="rs__info-body">
							<span className="rs__info-label">
								22 rue du Faubourg Saint-Honoré, 75008 Paris
							</span>
						</div>
					</li>
					<li className="rs__info-item">
						<IconClock className="rs__info-icon rs__info-icon--green" />
						<div className="rs__info-body">
							<span className="rs__info-label">Tous les jours dès 14h00</span>
							<span className="rs__info-text">Dernière entrée à 16h30.</span>
						</div>
					</li>
				</ul>
				<div className="rs__notice rs__notice--orange">
					<IconAlertTriangle className="rs__notice-icon rs__notice-icon--orange" />
					<p className="rs__notice-text">
						Réservé aux CIN de nouvelle génération. Les anciens formats ne sont
						pas acceptés.
					</p>
				</div>
				<div className="rs__actions">
					<Link className="rs__cta rs__cta--green" href="/appointment">
						Prendre un rendez-vous <IconArrowRight className="rs__cta-icon" />
					</Link>
					<Link className="rs__secondary" href="/">
						<IconRotateCcw className="rs__secondary-icon" />
						Nouvelle recherche
					</Link>
				</div>
			</div>
		</div>
	);
}

// ─── Page 2 : PENDING ───────────────────────────────────────────────────────

function PendingState() {
	return (
		<div className="rs-page rs-page--pending" role="status">
			{/* Zone 1 — hero coloré */}
			<div className="rs__hero">
				<div className="rs__icon-wrap">
					<IconHourglass className="rs__icon" />
				</div>
				<h1 className="rs__title">Dossier en cours de traitement</h1>
				<p className="rs__subtitle">
					Votre demande est traitée par les services compétents.
				</p>
			</div>
			{/* Zone 2 — carte blanche */}
			<div className="rs__body">
				<ul className="rs__info-list">
					<li className="rs__info-item">
						<IconHourglass className="rs__info-icon rs__info-icon--orange" />
						<div className="rs__info-body">
							<span className="rs__info-label">
								Notification par email et SMS
							</span>
							<span className="rs__info-text">
								Vous serez averti dès que votre CIN sera disponible.
							</span>
						</div>
					</li>
					<li className="rs__info-item">
						<IconClock className="rs__info-icon rs__info-icon--orange" />
						<div className="rs__info-body">
							<span className="rs__info-label">
								Délai habituel : 4 à 8 semaines
							</span>
							<span className="rs__info-text">
								À compter du dépôt du dossier.
							</span>
						</div>
					</li>
				</ul>
				<div className="rs__notice rs__notice--orange">
					<IconAlertTriangle className="rs__notice-icon rs__notice-icon--orange" />
					<p className="rs__notice-text">
						Si votre dossier date de plus de 3 mois sans notification, contactez
						le consulat.
					</p>
				</div>
				<div className="rs__actions">
					<Link className="rs__cta rs__cta--pending" href="/appointment">
						Prendre un rendez-vous <IconArrowRight className="rs__cta-icon" />
					</Link>
					<Link className="rs__secondary" href="/">
						<IconRotateCcw className="rs__secondary-icon" />
						Nouvelle recherche
					</Link>
				</div>
			</div>
		</div>
	);
}

// ─── Page 3 : NOT FOUND ─────────────────────────────────────────────────────

function NotFoundState() {
	return (
		<div className="rs-page rs-page--error" role="alert">
			{/* Zone 1 — hero coloré */}
			<div className="rs__hero">
				<div className="rs__icon-wrap">
					<IconXCircle className="rs__icon" />
				</div>
				<h1 className="rs__title">Numéro non référencé</h1>
				<p className="rs__subtitle">
					Aucun dossier ne correspond au numéro saisi. Vérifiez votre saisie.
				</p>
			</div>
			{/* Zone 2 — carte blanche */}
			<div className="rs__body">
				<ul className="rs__info-list">
					<li className="rs__info-item">
						<IconAlertCircle className="rs__info-icon rs__info-icon--red" />
						<div className="rs__info-body">
							<span className="rs__info-label">
								Numéro incorrect ou non enregistré
							</span>
							<span className="rs__info-text">
								Vérifiez le NIN saisi et qu'il s'agit d'une CIN nouvelle
								génération.
							</span>
						</div>
					</li>
					<li className="rs__info-item">
						<IconAlertTriangle className="rs__info-icon rs__info-icon--orange" />
						<div className="rs__info-body">
							<span className="rs__info-label">
								Seules les CIN de nouvelle génération
							</span>
							<span className="rs__info-text">
								sont suivies dans ce système.
							</span>
						</div>
					</li>
				</ul>
				<div className="rs__notice rs__notice--red">
					<IconAlertCircle className="rs__notice-icon rs__notice-icon--red" />
					<p className="rs__notice-text">
						Contactez le consulat au{" "}
						<a href="tel:+33156892345" className="rs__notice-link">
							<strong>+33 1 56 89 23 45</strong>
						</a>{" "}
						si le problème persiste.
					</p>
				</div>
				<div className="rs__actions">
					<Link className="rs__cta rs__cta--red" href="/">
						Réessayer <IconArrowRight className="rs__cta-icon" />
					</Link>
					<Link className="rs__secondary" href="/appointment">
						<IconArrowRight className="rs__secondary-icon" />
						Prendre un rendez-vous
					</Link>
				</div>
			</div>
		</div>
	);
}

// ─── Page 4 : BLOCKED ───────────────────────────────────────────────────────

function BlockedState() {
	return (
		<div className="rs-page rs-page--error" role="alert">
			{/* Zone 1 — hero coloré */}
			<div className="rs__hero">
				<div className="rs__icon-wrap">
					<IconShield className="rs__icon" />
				</div>
				<h1 className="rs__title">Votre dossier a été suspendu</h1>
				<p className="rs__subtitle">
					Contactez le consulat pour régulariser votre situation.
				</p>
			</div>
			{/* Zone 2 — carte blanche */}
			<div className="rs__body">
				<ul className="rs__info-list">
					<li className="rs__info-item">
						<IconAlertCircle className="rs__info-icon rs__info-icon--red" />
						<div className="rs__info-body">
							<span className="rs__info-label">Accès suspendu</span>
							<span className="rs__info-text">
								Aucune action en ligne n'est possible.
							</span>
						</div>
					</li>
					<li className="rs__info-item">
						<IconAlertTriangle className="rs__info-icon rs__info-icon--orange" />
						<div className="rs__info-body">
							<span className="rs__info-label">
								Déplacement en personne requis
							</span>
							<span className="rs__info-text">
								Munissez-vous d'une pièce d'identité valide pour vous présenter
								au guichet.
							</span>
						</div>
					</li>
				</ul>
				<div className="rs__notice rs__notice--red">
					<IconAlertCircle className="rs__notice-icon rs__notice-icon--red" />
					<p className="rs__notice-text">
						Contactez le consulat au{" "}
						<a href="tel:+33156892345" className="rs__notice-link">
							<strong>+33 1 56 89 23 45</strong>
						</a>{" "}
						pour régulariser votre situation.
					</p>
				</div>
				<div className="rs__actions">
					<Link className="rs__cta rs__cta--red" href="/appointment">
						Contacter le consulat <IconArrowRight className="rs__cta-icon" />
					</Link>
					<Link className="rs__secondary" href="/">
						<IconSearch className="rs__secondary-icon" />
						Nouvelle recherche
					</Link>
				</div>
			</div>
		</div>
	);
}

// ─── Page 5 : RATE LIMITED ──────────────────────────────────────────────────

function RateLimitedState() {
	return (
		<div className="rs-page rs-page--neutral" role="alert">
			{/* Zone 1 — hero coloré */}
			<div className="rs__hero">
				<div className="rs__icon-wrap">
					<IconClock className="rs__icon" />
				</div>
				<h1 className="rs__title">Accès temporairement restreint</h1>
				<p className="rs__subtitle">
					Par mesure de sécurité, l'accès à ce service est temporairement
					limité.
				</p>
			</div>
			{/* Zone 2 — carte blanche */}
			<div className="rs__body">
				<div className="rs__notice rs__notice--orange">
					<IconAlertTriangle className="rs__notice-icon rs__notice-icon--orange" />
					<p className="rs__notice-text">
						Accès rétabli dans <strong>10 minutes</strong>.
					</p>
				</div>
				<div className="rs__notice rs__notice--grey">
					<IconShield className="rs__notice-icon rs__notice-icon--grey" />
					<p className="rs__notice-text">
						Cette mesure protège le service et garantit un accès équitable à
						tous les ressortissants.
					</p>
				</div>
				<div className="rs__actions">
					<Link className="rs__cta rs__cta--slate" href="/">
						<IconHome className="rs__cta-icon" />
						Retour à l'accueil
					</Link>
				</div>
			</div>
		</div>
	);
}
