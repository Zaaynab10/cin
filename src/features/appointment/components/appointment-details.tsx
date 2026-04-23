// Expected: Show existing appointment and actions (edit/cancel) based on backend permissions.
"use client";

import { useEffect, useState } from "react";
import { mapApiError } from "../../../lib/errors/map-api-error";
import { toParisDisplay } from "../../../lib/utils/date";
import {
	cancelAppointment,
	fetchSlots,
	getAppointment,
	updateAppointment,
} from "../lib/appointment-api";
import type { AppointmentDetailsModel } from "../types/appointment.types";

// ─── Constants ────────────────────────────────────────────────────────────────

const TYPE_LABELS: Record<string, string> = {
	pickup: "Retrait",
	new_request: "Première demande",
	renewal: "Renouvellement",
};

const STATUS_LABELS: Record<string, string> = {
	booked: "Confirmé",
	cancelled: "Annulé",
	updated: "Modifié",
};

type SvgProps = { className?: string };

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

function IconEdit({ className }: SvgProps) {
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

function IconArrowLeft({ className }: SvgProps) {
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
			<line x1="19" y1="12" x2="5" y2="12" />
			<polyline points="12 19 5 12 12 5" />
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

function IconX({ className }: SvgProps) {
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
			<line x1="18" y1="6" x2="6" y2="18" />
			<line x1="6" y1="6" x2="18" y2="18" />
		</svg>
	);
}

function IconCheck({ className }: SvgProps) {
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
			<polyline points="20 6 9 17 4 12" />
		</svg>
	);
}

// ─── Component ────────────────────────────────────────────────────────────────

type SlotItem = { id: string; startAt: string; available: boolean };
type Mode = "view" | "edit" | "cancelled" | "updated";

type AppointmentDetailsProps = {
	token: string;
};

export function AppointmentDetails({ token }: AppointmentDetailsProps) {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [data, setData] = useState<AppointmentDetailsModel | null>(null);
	const [mode, setMode] = useState<Mode>("view");

	// Edit state
	const [editDate, setEditDate] = useState("");
	const [editSlots, setEditSlots] = useState<SlotItem[]>([]);
	const [editSlotId, setEditSlotId] = useState("");
	const [slotsLoading, setSlotsLoading] = useState(false);
	const [slotsError, setSlotsError] = useState<string | null>(null);
	const [updateLoading, setUpdateLoading] = useState(false);
	const [updateError, setUpdateError] = useState<string | null>(null);

	// Cancel state
	const [showCancelConfirm, setShowCancelConfirm] = useState(false);
	const [cancelLoading, setCancelLoading] = useState(false);
	const [cancelError, setCancelError] = useState<string | null>(null);

	useEffect(() => {
		getAppointment(token)
			.then((res: unknown) => {
				setData(res as AppointmentDetailsModel);
				setLoading(false);
			})
			.catch((err: unknown) => {
				const appErr = mapApiError(err);
				if (appErr.code === "TOKEN_INVALID") {
					setError(
						"Lien invalide. Vérifiez l'adresse ou votre e-mail de confirmation.",
					);
				} else if (appErr.code === "TOKEN_EXPIRED") {
					setError("Ce lien a expiré. Veuillez contacter le bureau compétent.");
				} else {
					setError("Une erreur est survenue. Veuillez réessayer.");
				}
				setLoading(false);
			});
	}, [token]);

	async function handleLoadSlots(date: string) {
		if (!data) return;
		setEditDate(date);
		setEditSlotId("");
		if (!date) {
			setEditSlots([]);
			return;
		}
		setSlotsLoading(true);
		setSlotsError(null);
		try {
			const res = await fetchSlots(data.type, date);
			setEditSlots((res as { slots: SlotItem[] }).slots ?? []);
		} catch {
			setSlotsError("Impossible de charger les créneaux pour cette date.");
		} finally {
			setSlotsLoading(false);
		}
	}

	async function handleUpdate() {
		if (!editSlotId) return;
		setUpdateLoading(true);
		setUpdateError(null);
		try {
			await updateAppointment(token, editSlotId);
			setMode("updated");
		} catch (err: unknown) {
			const appErr = mapApiError(err);
			if (appErr.code === "APPOINTMENT_TOO_CLOSE_TO_EDIT") {
				setUpdateError(
					"Ce rendez-vous ne peut plus être modifié (moins de 48h).",
				);
			} else if (appErr.code === "SLOT_ALREADY_BOOKED") {
				setUpdateError(
					"Ce créneau est déjà réservé. Choisissez un autre créneau.",
				);
			} else {
				setUpdateError("La modification a échoué. Veuillez réessayer.");
			}
		} finally {
			setUpdateLoading(false);
		}
	}

	async function handleCancel() {
		setCancelLoading(true);
		setCancelError(null);
		try {
			await cancelAppointment(token);
			setMode("cancelled");
		} catch (err: unknown) {
			const appErr = mapApiError(err);
			if (appErr.code === "APPOINTMENT_TOO_CLOSE_TO_EDIT") {
				setCancelError(
					"Ce rendez-vous ne peut plus être annulé (moins de 48h).",
				);
			} else {
				setCancelError("L'annulation a échoué. Veuillez réessayer.");
			}
			setShowCancelConfirm(false);
		} finally {
			setCancelLoading(false);
		}
	}

	function handleEnterEdit() {
		setMode("edit");
		setEditDate("");
		setEditSlots([]);
		setEditSlotId("");
		setUpdateError(null);
	}

	function handleLeaveEdit() {
		setMode("view");
		setEditDate("");
		setEditSlots([]);
		setEditSlotId("");
		setSlotsError(null);
		setUpdateError(null);
	}

	// ── Loading ──
	if (loading) {
		return <div className="rdv-loading">Chargement…</div>;
	}

	// ── Error ──
	if (error || !data) {
		return (
			<div className="rdv-error" role="alert">
				<IconAlertCircle className="rdv-error__icon" />
				<p>{error ?? "Données introuvables."}</p>
			</div>
		);
	}

	// ── Cancelled success ──
	if (mode === "cancelled") {
		return (
			<div className="rdv-state">
				<div className="rdv-state__icon-wrap rdv-state__icon-wrap--cancel">
					<IconX className="rdv-state__icon" />
				</div>
				<h2 className="rdv-state__title">Rendez-vous annulé</h2>
				<p className="rdv-state__desc">
					Votre rendez-vous a été annulé avec succès.
				</p>
			</div>
		);
	}

	// ── Updated success ──
	if (mode === "updated") {
		return (
			<div className="rdv-state">
				<div className="rdv-state__icon-wrap rdv-state__icon-wrap--success">
					<IconCheck className="rdv-state__icon" />
				</div>
				<h2 className="rdv-state__title">Rendez-vous modifié</h2>
				<p className="rdv-state__desc">
					Votre rendez-vous a été déplacé avec succès.
				</p>
			</div>
		);
	}

	const availableSlots = editSlots.filter((s) => s.available);
	const today = new Date().toISOString().slice(0, 10);

	return (
		<section className="apf-section">
			<div className="apf-section__header">
				<h2 className="apf-section__heading">Mon rendez-vous</h2>
				<div className="apf-section__bar" />
			</div>

			{/* ── Recap ── */}
			<div className="conf-recap">
				<div className="conf-group">
					<p className="conf-label">Type</p>
					<p className="conf-value">{TYPE_LABELS[data.type] ?? data.type}</p>
				</div>

				<hr className="conf-divider" />

				<div className="conf-group">
					<p className="conf-label">Nom complet</p>
					<p className="conf-value">{data.fullName}</p>
				</div>
				<div className="conf-group">
					<p className="conf-label">NIN</p>
					<p className="conf-value conf-value--mono">{data.nin}</p>
				</div>
				<div className="conf-group">
					<p className="conf-label">E-mail</p>
					<p className="conf-value">{data.email}</p>
				</div>
				<div className="conf-group">
					<p className="conf-label">Téléphone</p>
					<p className="conf-value">{data.phone}</p>
				</div>

				<hr className="conf-divider" />

				<div className="conf-group">
					<p className="conf-label">Date et heure</p>
					<p className="conf-value">{toParisDisplay(data.startAt)}</p>
				</div>
				<div className="conf-group">
					<p className="conf-label">Statut</p>
					<p className="conf-value">
						{STATUS_LABELS[data.status] ?? data.status}
					</p>
				</div>
			</div>

			{/* ── Edit form ── */}
			{mode === "edit" && (
				<div className="rdv-edit">
					<h3 className="rdv-edit__title">Choisir un nouveau créneau</h3>

					<div className="rdv-edit__field">
						<label htmlFor="rdv-edit-date" className="rdv-edit__label">
							Nouvelle date
						</label>
						<input
							id="rdv-edit-date"
							type="date"
							className="rdv-edit__input"
							value={editDate}
							min={today}
							onChange={(e) => handleLoadSlots(e.target.value)}
						/>
					</div>

					{slotsLoading && (
						<p className="rdv-edit__hint">Chargement des créneaux…</p>
					)}
					{slotsError && <p className="rdv-error__text">{slotsError}</p>}

					{availableSlots.length > 0 && (
						<div className="rdv-edit__slots">
							{availableSlots.map((slot) => (
								<button
									key={slot.id}
									type="button"
									className={`rdv-slot${editSlotId === slot.id ? " rdv-slot--selected" : ""}`}
									onClick={() => setEditSlotId(slot.id)}
								>
									{toParisDisplay(slot.startAt)}
								</button>
							))}
						</div>
					)}

					{editDate &&
						!slotsLoading &&
						availableSlots.length === 0 &&
						!slotsError && (
							<p className="rdv-edit__hint">
								Aucun créneau disponible pour cette date.
							</p>
						)}

					{updateError && (
						<p className="rdv-error__text" style={{ marginTop: "8px" }}>
							{updateError}
						</p>
					)}

					<div className="apf-actions" style={{ marginTop: "16px" }}>
						<button
							type="button"
							className="apf-back"
							onClick={handleLeaveEdit}
							disabled={updateLoading}
						>
							<IconArrowLeft className="apf-back__icon" />
							Annuler
						</button>
						<button
							type="button"
							className="apf-submit"
							style={{ flex: 1 }}
							onClick={handleUpdate}
							disabled={!editSlotId || updateLoading}
						>
							{updateLoading ? "Modification…" : "Confirmer la modification"}
							{!updateLoading && (
								<IconArrowRight className="apf-submit__icon" />
							)}
						</button>
					</div>
				</div>
			)}

			{/* ── Actions ── */}
			{mode === "view" &&
				(showCancelConfirm ? (
					<div className="rdv-confirm-cancel">
						<p className="rdv-confirm-cancel__text">
							Êtes-vous sûr(e) de vouloir annuler ce rendez-vous ?
						</p>
						{cancelError && <p className="rdv-error__text">{cancelError}</p>}
						<div className="apf-actions">
							<button
								type="button"
								className="apf-back"
								onClick={() => {
									setShowCancelConfirm(false);
									setCancelError(null);
								}}
								disabled={cancelLoading}
							>
								<IconArrowLeft className="apf-back__icon" />
								Retour
							</button>
							<button
								type="button"
								className="apf-submit apf-submit--danger"
								style={{ flex: 1 }}
								onClick={handleCancel}
								disabled={cancelLoading}
							>
								{cancelLoading ? "Annulation…" : "Confirmer l'annulation"}
							</button>
						</div>
					</div>
				) : (
					<div className="apf-actions" style={{ marginTop: "24px" }}>
						{data.canEdit && (
							<button
								type="button"
								className="apf-back"
								onClick={handleEnterEdit}
							>
								<IconEdit className="apf-back__icon" />
								Modifier
							</button>
						)}
						{data.canCancel && (
							<button
								type="button"
								className="apf-submit apf-submit--danger"
								style={{
									flex: data.canEdit ? 1 : undefined,
									width: data.canEdit ? undefined : "100%",
								}}
								onClick={() => setShowCancelConfirm(true)}
							>
								Annuler le rendez-vous
							</button>
						)}
						{!data.canEdit && !data.canCancel && (
							<p className="rdv-edit__hint" style={{ padding: "12px 0" }}>
								Ce rendez-vous ne peut plus être modifié ni annulé (moins de 48h
								avant l&apos;heure prévue).
							</p>
						)}
					</div>
				))}
		</section>
	);
}
