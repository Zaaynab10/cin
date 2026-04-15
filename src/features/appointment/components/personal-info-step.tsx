// Expected: Capture identity/contact inputs with frontend validation feedback.
"use client";

import { useState } from "react";
import type { PersonalInfoData } from "../types/appointment.types";

// ─── Icons ────────────────────────────────────────────────────────────────────

type SvgProps = { className?: string };

function IconArrowRight({ className }: SvgProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function IconInfo({ className }: SvgProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

// ─── Validation helpers ───────────────────────────────────────────────────────

const NAME_RE = /^[a-zA-ZÀ-ÿ' ]+$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const DIGITS_RE = /^\d+$/;
// NIN sénégalais CEDEAO : [1|2][A-Z]\d{11} = 13 chars, ex: 1G01198500654

import etatCivilData from '../../../../etat_civil_senegal.json';
const NIN_RE = /^[12](\d{3}|[A-Z]\d{2})\d{4}\d{5}$/;

function errNom(v: string) {
  if (!v.trim()) return "Le nom est obligatoire.";
  if (v.trim().length < 2) return "Minimum 2 caractères.";
  if (!NAME_RE.test(v.trim())) return "Lettres et espaces uniquement.";
}
function errPrenom(v: string) {
  if (!v.trim()) return "Le prénom est obligatoire.";
  if (v.trim().length < 2) return "Minimum 2 caractères.";
  if (!NAME_RE.test(v.trim())) return "Lettres et espaces uniquement.";
}
function errNin(v: string) {
  const normalized = v.trim().toUpperCase().replace(/\s/g, "");
  if (!normalized) return "Le NIN est obligatoire.";
  if (!NIN_RE.test(normalized))
    return "Format invalide. Ex : 1075202301234 ou 1A75202301234";
  // Vérification de l'année
  const year = parseInt(normalized.slice(4, 8));
  const currentYear = new Date().getFullYear();
  if (year < 1900 || year > currentYear) {
    return "Année invalide.";
  }
  // Vérification du code département (3 chiffres après le 1er caractère)
  const deptCode = normalized.slice(1, 4);
  const validCodes = Array.isArray(etatCivilData)
    ? etatCivilData.map((item: any) => String(item.code).padStart(3, '0').toUpperCase())
    : [];
  if (!validCodes.includes(deptCode)) {
    return `Code département invalide (${deptCode}).`;
  }
}
function errEmail(v: string) {
  if (!v.trim()) return "L'adresse email est obligatoire.";
  if (!EMAIL_RE.test(v.trim())) return "Format d'email invalide (ex. nom@domaine.fr).";
}
function errTel(v: string) {
  const clean = v.replace(/[\s\-\+\(\)]/g, "");
  if (!clean) return "Le numéro de téléphone est obligatoire.";
  if (!DIGITS_RE.test(clean)) return "Chiffres uniquement (ex. +33 6 12 34 56 78).";
  if (clean.length < 8 || clean.length > 20) return "Entre 8 et 20 chiffres.";
}

type Fields = { nom: string; prenom: string; nin: string; email: string; tel: string };
type Errs   = Partial<Record<keyof Fields | "consent", string>>;

function validateAll(f: Fields, consent: boolean): Errs {
  return {
    nom:     errNom(f.nom),
    prenom:  errPrenom(f.prenom),
    nin:     errNin(f.nin),
    email:   errEmail(f.email),
    tel:     errTel(f.tel),
    consent: !consent ? "Vous devez accepter pour continuer." : undefined,
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

type Props = {
  initialData?: PersonalInfoData;
  onNext: (data: PersonalInfoData) => void;
};

export function PersonalInfoStep({ initialData, onNext }: Props) {
  const [nom,     setNom]     = useState(initialData?.nom     ?? "");
  const [prenom,  setPrenom]  = useState(initialData?.prenom  ?? "");
  const [nin,     setNin]     = useState(initialData?.nin     ?? "");
  const [email,   setEmail]   = useState(initialData?.email   ?? "");
  const [tel,     setTel]     = useState(initialData?.tel     ?? "");
  const [consent, setConsent] = useState(initialData?.consent ?? false);

  const [errors,   setErrors]   = useState<Errs>({});
  const [submitted, setSubmitted] = useState(false);

  function revalidate(overrides?: Partial<Fields & { consent: boolean }>) {
    if (!submitted) return;
    const fields: Fields = { nom, prenom, nin, email, tel, ...overrides };
    const con = overrides?.consent !== undefined ? overrides.consent : consent;
    setErrors(validateAll(fields, con));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    const fields: Fields = { nom, prenom, nin, email, tel };
    const errs = validateAll(fields, consent);
    setErrors(errs);
    if (Object.values(errs).some(Boolean)) return;
    onNext({
      nom:     nom.trim(),
      prenom:  prenom.trim(),
      nin:     nin.trim().toUpperCase().replace(/\s/g, ""),
      email:   email.trim(),
      tel:     tel.trim(),
      consent: true,
    });
  }

  return (
    <section className="apf-section">
      <div className="apf-section__header">
        <h2 className="apf-section__heading">Vos informations personnelles</h2>
        <div className="apf-section__bar" />
      </div>

      <form className="apf-fields" onSubmit={handleSubmit} noValidate>

        {/* Nom */}
        <div className={`apf-field${errors.nom && submitted ? " apf-field--error" : ""}`}>
          <label className="apf-field__label" htmlFor="apf-nom">
            Nom <span className="apf-field__required">*</span>
          </label>
          <input
            id="apf-nom"
            className="apf-field__input"
            type="text"
            value={nom}
            placeholder="Votre nom de famille"
            autoComplete="family-name"
            onChange={e => { setNom(e.target.value); revalidate({ nom: e.target.value }); }}
          />
          {errors.nom && submitted
            ? <p className="apf-field__error" role="alert">{errors.nom}</p>
            : <p className="apf-field__hint"><IconInfo className="apf-field__hint-icon" />Tel qu'il figure sur votre acte de naissance</p>
          }
        </div>

        {/* Prénom */}
        <div className={`apf-field${errors.prenom && submitted ? " apf-field--error" : ""}`}>
          <label className="apf-field__label" htmlFor="apf-prenom">
            Prénom <span className="apf-field__required">*</span>
          </label>
          <input
            id="apf-prenom"
            className="apf-field__input"
            type="text"
            value={prenom}
            placeholder="Votre prénom"
            autoComplete="given-name"
            onChange={e => { setPrenom(e.target.value); revalidate({ prenom: e.target.value }); }}
          />
          {errors.prenom && submitted
            ? <p className="apf-field__error" role="alert">{errors.prenom}</p>
            : <p className="apf-field__hint"><IconInfo className="apf-field__hint-icon" />Sans abréviation</p>
          }
        </div>

        {/* NIN */}
        <div className={`apf-field${errors.nin && submitted ? " apf-field--error" : ""}`}>
          <label className="apf-field__label" htmlFor="apf-nin">
            Numéro d'Identification National (NIN) <span className="apf-field__required">*</span>
          </label>
          <input
            id="apf-nin"
            className="apf-field__input"
            type="text"
            value={nin}
            placeholder="1G01198500654"
            autoComplete="off"
            maxLength={13}
            style={{ textTransform: "uppercase" }}
            onChange={e => { const v = e.target.value.toUpperCase(); setNin(v); revalidate({ nin: v }); }}
          />
          {errors.nin && submitted
            ? <p className="apf-field__error" role="alert">{errors.nin}</p>
            : <p className="apf-field__hint"><IconInfo className="apf-field__hint-icon" />13 caractères : 1/2 + département + année + numéro. Ex : 1075202301234 ou 1A75202301234</p>
          }
        </div>

        {/* Email */}
        <div className={`apf-field${errors.email && submitted ? " apf-field--error" : ""}`}>
          <label className="apf-field__label" htmlFor="apf-email">
            Adresse email <span className="apf-field__required">*</span>
          </label>
          <input
            id="apf-email"
            className="apf-field__input"
            type="email"
            value={email}
            placeholder="exemple@domaine.fr"
            autoComplete="email"
            onChange={e => { setEmail(e.target.value); revalidate({ email: e.target.value }); }}
          />
          {errors.email && submitted
            ? <p className="apf-field__error" role="alert">{errors.email}</p>
            : <p className="apf-field__hint"><IconInfo className="apf-field__hint-icon" />Pour recevoir votre confirmation</p>
          }
        </div>

        {/* Téléphone */}
        <div className={`apf-field${errors.tel && submitted ? " apf-field--error" : ""}`}>
          <label className="apf-field__label" htmlFor="apf-tel">
            Numéro de téléphone <span className="apf-field__required">*</span>
          </label>
          <input
            id="apf-tel"
            className="apf-field__input"
            type="tel"
            value={tel}
            placeholder="+33 6 12 34 56 78"
            autoComplete="tel"
            onChange={e => { setTel(e.target.value); revalidate({ tel: e.target.value }); }}
          />
          {errors.tel && submitted
            ? <p className="apf-field__error" role="alert">{errors.tel}</p>
            : <p className="apf-field__hint"><IconInfo className="apf-field__hint-icon" />Mobile de préférence, pour recevoir le SMS de rappel</p>
          }
        </div>

        {/* Consentement RGPD */}
        <div className={`apf-consent-wrap${errors.consent && submitted ? " apf-consent-wrap--error" : ""}`}>
          <label className="apf-consent">
            <input
              className="apf-consent__check"
              type="checkbox"
              checked={consent}
              onChange={e => { setConsent(e.target.checked); revalidate({ consent: e.target.checked }); }}
            />
            <span className="apf-consent__text">
              J'accepte que mes données personnelles soient traitées dans le cadre de
              ma demande, conformément à la{" "}
              <span className="apf-consent__link">loi sénégalaise n°2008-12</span>.
            </span>
          </label>
          {errors.consent && submitted && (
            <p className="apf-field__error apf-consent__error" role="alert">{errors.consent}</p>
          )}
        </div>

        <button className="apf-submit" type="submit">
          Continuer vers le choix du créneau
          <IconArrowRight className="apf-submit__icon" />
        </button>

      </form>
    </section>
  );
}
