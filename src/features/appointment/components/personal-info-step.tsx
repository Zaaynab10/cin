
"use client";
import { useState } from "react";
import type { PersonalInfoData } from "../types/appointment.types";
import { validateAll } from "../lib/validation";

type Props = {
	initialData?: PersonalInfoData;
	appointmentType?: string;
	onNext: (data: PersonalInfoData) => void;
};

export function PersonalInfoStep({ initialData, appointmentType, onNext }: Props) {
	const needsNin = appointmentType === "pickup" || appointmentType === "renewal";
	const [fields, setFields] = useState<PersonalInfoData>({
		nom: initialData?.nom || "",
		prenom: initialData?.prenom || "",
		nin: initialData?.nin || "",
		email: initialData?.email || "",
		tel: initialData?.tel || "",
		consent: initialData?.consent ?? false,
	});
	const [errs, setErrs] = useState<{ [k: string]: string | undefined }>({});

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		const { name, value, type, checked } = e.target;
		setFields((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
	}

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		const newErrs = validateAll(fields, fields.consent, needsNin);
		setErrs(newErrs);
		const hasError = Object.values(newErrs).some(Boolean);
		if (!hasError) {
			onNext(fields);
		}
	}

	return (
		<form
			className="tracking-form-card"
			style={{
				padding: '3.5rem 2.5rem 3.5rem 2.5rem',
				maxWidth: 620,
				margin: '3.5rem auto',
				fontFamily: 'var(--font-sans), system-ui, sans-serif',
				fontSize: '1.13em',
				letterSpacing: '0.01em',
				background: 'var(--color-card-soft)',
				boxShadow: 'none',
				borderRadius: 'var(--radius-hero-card)',
			}}
			onSubmit={handleSubmit}
		>
			<h2 style={{
				fontWeight: 700,
				fontSize: '2.1rem',
				color: 'var(--color-brand-ink)',
				margin: '0 0 2.7rem 0',
				textAlign: 'center',
				letterSpacing: '0.01em',
				textTransform: 'none',
				fontFamily: 'var(--font-sans), system-ui, sans-serif',
			}}>
				Informations personnelles
			</h2>
			<div className="tracking-form-card__field-wrap" style={{marginBottom: 28}}>
				<label htmlFor="apf-nom" style={{fontWeight: 600, marginBottom: 6, fontSize: '0.97em'}}>Nom</label>
				<input
					id="apf-nom"
					name="nom"
					value={fields.nom}
					onChange={handleChange}
					autoComplete="family-name"
					className="tracking-form-card__field"
					placeholder="Nom"
				/>
				{errs.nom && <div className="tracking-form-card__error">{errs.nom}</div>}
			</div>
			<div className="tracking-form-card__field-wrap" style={{marginBottom: 28}}>
				<label htmlFor="apf-prenom" style={{fontWeight: 600, marginBottom: 6, fontSize: '0.97em'}}>Prénom</label>
				<input
					id="apf-prenom"
					name="prenom"
					value={fields.prenom}
					onChange={handleChange}
					autoComplete="given-name"
					className="tracking-form-card__field"
					placeholder="Prénom"
				/>
				{errs.prenom && <div className="tracking-form-card__error">{errs.prenom}</div>}
			</div>
			{needsNin && (
				<div className="tracking-form-card__field-wrap" style={{marginBottom: 28}}>
					<label htmlFor="apf-nin" style={{fontWeight: 600, marginBottom: 6, fontSize: '0.97em'}}>NIN</label>
					<input
						id="apf-nin"
						name="nin"
						value={fields.nin}
						onChange={handleChange}
						autoComplete="off"
						className="tracking-form-card__field"
						placeholder="NIN (ex: 1G01198500654)"
					/>
					{errs.nin && <div className="tracking-form-card__error">{errs.nin}</div>}
				</div>
			)}
			<div className="tracking-form-card__field-wrap" style={{marginBottom: 28}}>
				<label htmlFor="apf-email" style={{fontWeight: 600, marginBottom: 6, fontSize: '0.97em'}}>Email</label>
				<input
					id="apf-email"
					name="email"
					value={fields.email}
					onChange={handleChange}
					autoComplete="email"
					className="tracking-form-card__field"
					placeholder="Adresse email"
				/>
				{errs.email && <div className="tracking-form-card__error">{errs.email}</div>}
			</div>
			<div className="tracking-form-card__field-wrap" style={{marginBottom: 28}}>
				<label htmlFor="apf-tel" style={{fontWeight: 600, marginBottom: 6, fontSize: '0.97em'}}>Téléphone</label>
				<input
					id="apf-tel"
					name="tel"
					value={fields.tel}
					onChange={handleChange}
					autoComplete="tel"
					className="tracking-form-card__field"
					placeholder="Téléphone"
				/>
				{errs.tel && <div className="tracking-form-card__error">{errs.tel}</div>}
			</div>
			<div className="tracking-form-card__field-wrap" style={{marginTop: "-0.5em", marginBottom: "1.5em"}}>
				<label style={{display: "flex", alignItems: "center", gap: 8, fontWeight: 500, fontSize: '0.97em'}}>
					<input
						type="checkbox"
						id="apf-consent"
						name="consent"
						checked={fields.consent}
						onChange={handleChange}
						style={{marginRight: 8}}
					/>
					J’accepte le traitement de mes données pour la prise de rendez-vous
				</label>
				{errs.consent && <div className="tracking-form-card__error">{errs.consent}</div>}
			</div>
			<button type="submit" className="tracking-form-card__submit" style={{width: '100%', padding: '15px 0', fontSize: '1.08em', fontWeight: 700, letterSpacing: '0.01em'}}>Suivant</button>
		</form>
	);
}

