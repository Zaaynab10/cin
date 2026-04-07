// Expected: Display required documents according to appointment type.
"use client";

// ─── Documents by type ───────────────────────────────────────────────────────

type DocItem = { label: string; required: boolean };

const DOCS_BY_TYPE: Record<string, { title: string; items: DocItem[] }> = {
  pickup: {
    title: "Documents à apporter pour le retrait",
    items: [
      { label: "Ancienne CIN ou récépissé de dépôt",          required: true  },
      { label: "1 photo d'identité récente (fond blanc)",      required: true  },
      { label: "Passeport ou titre de voyage (si disponible)", required: false },
    ],
  },
  new_request: {
    title: "Documents à apporter pour une nouvelle demande",
    items: [
      { label: "Acte de naissance (de moins de 3 mois)",        required: true  },
      { label: "Justificatif de domicile",                      required: true  },
      { label: "2 photos d'identité récentes (fond blanc)",     required: true  },
      { label: "Timbre fiscal consulaire",                      required: true  },
      { label: "Passeport ou titre de voyage",                  required: false },
    ],
  },
  renewal: {
    title: "Documents à apporter pour un renouvellement",
    items: [
      { label: "Ancienne CIN (originale)",                           required: true  },
      { label: "Justificatif de domicile",                           required: true  },
      { label: "2 photos d'identité récentes (fond blanc)",          required: true  },
      { label: "Timbre fiscal consulaire",                           required: true  },
      { label: "Acte de naissance (si changement d'état civil)",     required: false },
    ],
  },
};

const DEFAULT_DOCS = DOCS_BY_TYPE.new_request;

// ─── Icons ────────────────────────────────────────────────────────────────────

type SvgProps = { className?: string };

function IconCheck({ className }: SvgProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconAlertTriangle({ className }: SvgProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function IconArrowLeft({ className }: SvgProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

type RequiredDocumentsStepProps = {
  appointmentType?: string;
  onPrevious: () => void;
};

export function RequiredDocumentsStep({ appointmentType, onPrevious }: RequiredDocumentsStepProps) {
  const docs = (appointmentType && DOCS_BY_TYPE[appointmentType])
    ? DOCS_BY_TYPE[appointmentType]
    : DEFAULT_DOCS;

  const required = docs.items.filter((d) => d.required);
  const optional = docs.items.filter((d) => !d.required);

  return (
    <section className="apf-section">
      <div className="apf-section__header">
        <h2 className="apf-section__heading">Documents requis</h2>
        <div className="apf-section__bar" />
      </div>

      <div className="docs-wrap">
        <p className="docs-intro">{docs.title}</p>

        <div className="docs-group">
          <p className="docs-group__label">Obligatoires</p>
          <ul className="docs-list">
            {required.map((doc) => (
              <li key={doc.label} className="docs-item docs-item--required">
                <IconCheck className="docs-item__icon docs-item__icon--green" />
                <span>{doc.label}</span>
              </li>
            ))}
          </ul>
        </div>

        {optional.length > 0 && (
          <div className="docs-group">
            <p className="docs-group__label">Facultatifs / conseillés</p>
            <ul className="docs-list">
              {optional.map((doc) => (
                <li key={doc.label} className="docs-item docs-item--optional">
                  <IconAlertTriangle className="docs-item__icon docs-item__icon--orange" />
                  <span>{doc.label}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="docs-notice">
          <IconAlertTriangle className="docs-notice__icon" />
          <p className="docs-notice__text">
            Tout document manquant peut entraîner le refus du rendez-vous.
            Présentez les originaux et une copie de chaque document.
          </p>
        </div>
      </div>

      <div className="apf-actions">
        <button type="button" className="apf-back" onClick={onPrevious}>
          <IconArrowLeft className="apf-back__icon" />
          Retour
        </button>
      </div>
    </section>
  );
}
