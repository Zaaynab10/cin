// Expected: Success state after creation. Show appointment summary and next actions.
"use client";

import Link from "next/link";
import type {
	PersonalInfoData,
	ScheduleData,
} from "../types/appointment.types";

// ─── Constants ────────────────────────────────────────────────────────────────

const DAY_NAMES_FR = [
	"Dimanche",
	"Lundi",
	"Mardi",
	"Mercredi",
	"Jeudi",
	"Vendredi",
	"Samedi",
];
const MONTH_NAMES_FR = [
	"janvier",
	"février",
	"mars",
	"avril",
	"mai",
	"juin",
	"juillet",
	"août",
	"septembre",
	"octobre",
	"novembre",
	"décembre",
];
const TYPE_LABELS: Record<string, string> = {
	pickup: "Retrait de CIN",
	new_request: "Nouvelle demande de CIN",
	renewal: "Renouvellement de CIN",
};

// ─── Icons ────────────────────────────────────────────────────────────────────

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

function IconArrowRight({ className }: SvgProps) {
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
			<line x1="5" y1="12" x2="19" y2="12" />
			<polyline points="12 5 19 12 12 19" />
		</svg>
	);
}

function IconMail({ className }: SvgProps) {
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
			<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
			<polyline points="22,6 12,13 2,6" />
		</svg>
	);
}

function IconSmartphone({ className }: SvgProps) {
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
			<rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
			<line x1="12" y1="18" x2="12.01" y2="18" />
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

// ─── Component ────────────────────────────────────────────────────────────────

type SuccessStepProps = {
	token: string;
	personalInfo?: PersonalInfoData;
	scheduleData?: ScheduleData;
	appointmentType?: string;
	onNext: () => void;
};

export function SuccessStep({
	token,
	personalInfo,
	scheduleData,
	appointmentType,
	onNext,
}: SuccessStepProps) {
	const d = scheduleData
		? new Date(scheduleData.year, scheduleData.month, scheduleData.day)
		: null;
	const dateLabel = d
		? `${DAY_NAMES_FR[d.getDay()]} ${scheduleData!.day} ${MONTH_NAMES_FR[scheduleData!.month]} ${scheduleData!.year}`
		: "";
	const timeLabel = scheduleData?.slotLabel ?? "";
	const typeLabel = appointmentType
		? (TYPE_LABELS[appointmentType] ?? appointmentType)
		: "";

	return (
		<section className="apf-section">
			<div className="suc-card">
				{/* Green check badge */}
				<div className="suc__badge">
					<IconCheck className="suc__badge-icon" />
				</div>

				{/* Title */}
				<h2 className="suc__title">
					Votre rendez-vous a bien été
					<br />
					enregistré
				</h2>

				{/* Date + type pill */}
				<p className="suc__slot">
					{dateLabel} {timeLabel}
					<br />
					{typeLabel}
				</p>

				{/* Separator */}
				<div className="suc__divider" />

				{/* Email confirmation */}
				<div className="suc__info-row">
					<IconMail className="suc__info-icon suc__info-icon--green" />
					<p className="suc__info-text">
						<strong>Un email de confirmation</strong> a été envoyé à{" "}
						<strong>{personalInfo?.email ?? "votre adresse"}</strong>. Si vous
						ne le recevez pas, pensez à vérifier votre dossier spam.
					</p>
				</div>

				{/* SMS confirmation */}
				<div className="suc__info-row">
					<IconSmartphone className="suc__info-icon suc__info-icon--green" />
					<p className="suc__info-text">
						<strong>Un SMS de confirmation</strong> a également été envoyé au{" "}
						<strong>{personalInfo?.tel ?? "votre numéro"}</strong>.
					</p>
				</div>

				{/* Separator */}
				<div className="suc__divider" />

				{/* Modification notice */}
				<div className="suc__info-row">
					<IconAlertTriangle className="suc__info-icon suc__info-icon--orange" />
					<p className="suc__info-text">
						<strong>Modification ou annulation</strong> possible jusqu&apos;à
						48h avant via le lien sécurisé dans votre email. Passé ce délai,
						aucune modification ne sera possible.
					</p>
				</div>

				{/* CTA */}
				<button type="button" className="apf-submit" onClick={onNext}>
					Voir les documents à ramener
					<IconArrowRight className="apf-submit__icon" />
				</button>

				{/* Home link */}
				<Link className="suc__home-link" href="/">
					<IconHome className="suc__home-icon" />
					Retour à l&apos;accueil
				</Link>
			</div>
		</section>
	);
}
