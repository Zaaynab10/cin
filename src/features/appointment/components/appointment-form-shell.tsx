// Expected: Orchestrate the full multi-step form and render each step component.
"use client";

import { useState } from "react";
import { ConfirmationStep } from "./confirmation-step";
import { PersonalInfoStep } from "./personal-info-step";
import { RequiredDocumentsStep } from "./required-documents-step";
import { ScheduleStep } from "./schedule-step";
import { SuccessStep } from "./success-step";
import { useAppointmentForm } from "../hooks/use-appointment-form";
import type {
	PersonalInfoData,
	ScheduleData,
} from "../types/appointment.types";

// ─── Stepper data ─────────────────────────────────────────────────────────────

const STEPS = [
	"Infos personnelles",
	"Date & heure",
	"Récapitulatif",
	"Confirmation",
	"Documents",
] as const;

// ─── Component ────────────────────────────────────────────────────────────────

type AppointmentFormShellProps = {
	initialType?: string;
};

export function AppointmentFormShell({
	initialType,
}: AppointmentFormShellProps) {
	const { step, next, previous } = useAppointmentForm();
	const [personalInfo, setPersonalInfo] = useState<
		PersonalInfoData | undefined
	>(undefined);
	const [scheduleData, setScheduleData] = useState<ScheduleData | undefined>(
		undefined,
	);
	const [token, setToken] = useState<string>("");

	return (
		<div className="apf-page">
			<div className="apf-wrap">
				{/* Header */}
				<header className="apf-header">
					<p className="apf-header__eyebrow">Service public consulaire</p>
					<h1 className="apf-header__title">Réservation de rendez-vous</h1>
				</header>

				{/* Stepper */}
				<nav className="apf-stepper" aria-label="Étapes du formulaire">
					{STEPS.map((label, i) => {
						const num = i + 1;
						const isActive = num === step;
						const isDone = num < step;
						return (
							<div
								key={num}
								className={`apf-step${isActive ? " apf-step--active" : ""}${isDone ? " apf-step--done" : ""}`}
								aria-current={isActive ? "step" : undefined}
							>
								{i > 0 && <span className="apf-step__sep" aria-hidden="true" />}
								<div className="apf-step__dot">{num}</div>
								<span className="apf-step__label">{label}</span>
							</div>
						);
					})}
				</nav>

				{/* Étapes */}
				{step === 1 && (
					<PersonalInfoStep
						initialData={personalInfo}
						appointmentType={initialType}
						onNext={(data) => {
							setPersonalInfo(data);
							next();
						}}
					/>
				)}
				{step === 2 && (
					<ScheduleStep
						appointmentType={initialType}
						onNext={(data) => {
							setScheduleData(data);
							next();
						}}
						onPrevious={previous}
					/>
				)}
				{step === 3 && (
					<ConfirmationStep
						appointmentType={initialType}
						personalInfo={personalInfo}
						scheduleData={scheduleData}
						onNext={(t) => {
							setToken(t);
							next();
						}}
						onPrevious={previous}
					/>
				)}
				{step === 4 && (
					<SuccessStep
						token={token}
						personalInfo={personalInfo}
						scheduleData={scheduleData}
						appointmentType={initialType}
						onNext={next}
					/>
				)}
				{step === 5 && (
					<RequiredDocumentsStep
						appointmentType={initialType}
						onPrevious={previous}
					/>
				)}
			</div>
		</div>
	);
}
