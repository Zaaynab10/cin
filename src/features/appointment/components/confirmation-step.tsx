// Expected: Show final summary before submit and trigger appointment creation.
"use client";

import { useState, useRef, useEffect } from "react";
import { Alert } from "../../../components/ui/alert";
import { createAppointment } from "../lib/appointment-api";
import type {
	PersonalInfoData,
	ScheduleData,
} from "../types/appointment.types";

// ─── Constants ────────────────────────────────────────────────────────────────

const DAY_NAMES_FR = ["Dim.", "Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam."];

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
	new_request: "Nouvelle demande",
	renewal: "Renouvellement",
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

function IconPencil({ className }: SvgProps) {
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
			<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
			<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
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

// ─── Component ────────────────────────────────────────────────────────────────

type ConfirmationStepProps = {
	appointmentType?: string;
	personalInfo?: PersonalInfoData;
	scheduleData?: ScheduleData;
	onNext: (token: string) => void;
	onPrevious: () => void;
};

export function ConfirmationStep({
	appointmentType,
	personalInfo,
	scheduleData,
	onNext,
	onPrevious,
}: ConfirmationStepProps) {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [existingToken, setExistingToken] = useState<string | null>(null);
	const errorRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		if (error && errorRef.current) {
			errorRef.current.focus();
		}
	}, [error]);

	async function handleConfirm() {
		if (!personalInfo || !scheduleData || !appointmentType) return;
		setLoading(true);
		setError(null);
		setExistingToken(null);
		try {
			const data = await createAppointment({
				nin: personalInfo.nin,
				fullName: `${personalInfo.prenom} ${personalInfo.nom}`.trim(),
				email: personalInfo.email,
				phone: personalInfo.tel,
				type: appointmentType as "pickup" | "new_request" | "renewal",
				slotId: scheduleData.slotId,
				consent: true,
			});
			onNext((data as { token: string }).token);
		} catch (e: unknown) {
			const err = e as { code?: string; token?: string; message?: string };
			if (err?.code === "APPOINTMENT_ALREADY_EXISTS") {
				setExistingToken(err.token ?? null);
				setError("ALREADY_EXISTS");
			} else {
				setError(
					err?.message ?? "Une erreur est survenue. Veuillez réessayer.",
				);
			}
		} finally {
			setLoading(false);
		}
	}

	const d = scheduleData
		? new Date(scheduleData.year, scheduleData.month, scheduleData.day)
		: null;
	const dateLabel = d
		? `${DAY_NAMES_FR[d.getDay()]} ${scheduleData!.day} ${MONTH_NAMES_FR[scheduleData!.month]} ${scheduleData!.year}`
		: "";
	const typeLabel = appointmentType
		? (TYPE_LABELS[appointmentType] ?? appointmentType)
		: "";

	const rows: Array<{ label: string; value: string }> = [
		{ label: "Type de démarche", value: typeLabel },
		{ label: "Nom", value: personalInfo?.nom ?? "" },
		{ label: "Prénom", value: personalInfo?.prenom ?? "" },
		{ label: "NIN", value: personalInfo?.nin ?? "" },
		{ label: "Email", value: personalInfo?.email ?? "" },
		{ label: "Téléphone", value: personalInfo?.tel ?? "" },
		{ label: "Date", value: dateLabel },
		{ label: "Heure", value: scheduleData?.slotLabel ?? "" },
	];

	return (
		<section className="apf-section">
			<div className="conf-card">
				<div className="conf-card__head">
					<h2 className="conf-card__title">Vos informations</h2>
					<div className="conf-card__bar" />
				</div>

				<ul className="conf-rows">
					{rows.map(({ label, value }) => (
						<li key={label} className="conf-row">
							<span className="conf-row__left">
								<IconCheck className="conf-check-icon" />
								<span className="conf-row__label">{label}</span>
							</span>
							<span className="conf-row__value">{value}</span>
						</li>
					))}
				</ul>

				{error && (
					<div
						ref={errorRef}
						tabIndex={-1}
						style={{ outline: "none", marginBottom: 16 }}
					>
						<Alert>
							{error === "ALREADY_EXISTS"
								? "Un rendez-vous existe déjà pour ce NIN. Consulte l’email de confirmation pour le modifier ou l’annuler."
								: error}
						</Alert>
					</div>
				)}

				<div className="conf-actions">
					<button
						type="button"
						className="conf-edit-btn"
						onClick={onPrevious}
						disabled={loading}
					>
						<IconPencil className="conf-edit-btn__icon" />
						Modifier mes informations
					</button>
					<button
						type="button"
						className="apf-submit"
						onClick={handleConfirm}
						disabled={loading || !personalInfo || !scheduleData}
					>
						{loading ? "Envoi en cours…" : "Confirmer mon rendez-vous"}
						{!loading && <IconArrowRight className="apf-submit__icon" />}
					</button>
				</div>
			</div>
		</section>
	);
}
