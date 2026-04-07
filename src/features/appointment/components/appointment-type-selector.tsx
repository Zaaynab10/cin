// Expected: Let user choose appointment type and route to /appointment/form?type=...
import Link from "next/link";

// ─── Icons ────────────────────────────────────────────────────────────────────

type SvgProps = { className?: string };

function IconClock({ className }: SvgProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function IconFilePlus({ className }: SvgProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="12" y1="18" x2="12" y2="12" />
      <line x1="9" y1="15" x2="15" y2="15" />
    </svg>
  );
}

function IconRefreshCw({ className }: SvgProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  );
}

function IconArrowRight({ className }: SvgProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const APPOINTMENT_TYPES = [
  {
    value: "pickup",
    Icon: IconClock,
    label: "Retrait de CIN",
    description:
      "Votre CIN de nouvelle génération est disponible au consulat. Les rendez-vous de retrait sont proposés tous les jours à partir de 14h00.",
    badge: "À partir de 14h00",
  },
  {
    value: "new_request",
    Icon: IconFilePlus,
    label: "Nouvelle demande",
    description:
      "Première demande de Carte d'Identité Nationale de nouvelle génération. Créneaux disponibles à 9h00, 10h00 et 11h00, dans la limite de la capacité journalière.",
    badge: "9h · 10h · 11h",
  },
  {
    value: "renewal",
    Icon: IconRefreshCw,
    label: "Renouvellement / Duplicata",
    description:
      "Renouvellement ou duplicata de Carte d'Identité Nationale de nouvelle génération. Créneaux disponibles à 9h00, 10h00 et 11h00, dans la limite de la capacité journalière.",
    badge: "9h · 10h · 11h",
  },
] as const;

// ─── Component ────────────────────────────────────────────────────────────────

export function AppointmentTypeSelector() {
  return (
    <div className="apt-page">

      {/* Zone 1 — Hero photo plein écran */}
      <section className="apt-hero" aria-labelledby="apt-hero-title">
        <div className="apt-hero__media" aria-hidden="true" />
        <div className="apt-hero__overlay" aria-hidden="true" />
        <div className="apt-hero__content">
          <p className="apt-hero__eyebrow">Service public consulaire</p>
          <h1 id="apt-hero-title" className="apt-hero__title">
            Prendre un rendez-vous
          </h1>
          <p className="apt-hero__subtitle">
            Réservez votre créneau en ligne, sans création de compte. Un seul rendez-vous
            actif par numéro d'identification. Toute annulation doit être effectuée
            au moins 48h avant.
          </p>
        </div>
      </section>

      {/* Zone 2 — Question : quelle démarche ? */}
      <section className="apt-zone apt-zone--question" aria-labelledby="apt-zone-title">
        <div className="apt-zone__inner">
          <h2 id="apt-zone-title" className="apt-zone__heading">
            Quelle est votre démarche ?
          </h2>
          <div className="apt-zone__bar" aria-hidden="true" />
          <p className="apt-zone__sub">
            Les créneaux disponibles vous seront proposés à l'étape suivante selon votre choix.
          </p>
        </div>
      </section>

      {/* Zone 3 — Choix de démarches */}
      <section className="apt-zone apt-zone--choices" aria-label="Choix de démarche">
        <div className="apt-zone__inner">
          <div className="apt-rows" role="list">
            {APPOINTMENT_TYPES.map(({ value, Icon, label, description, badge }) => (
              <div key={value} className="apt-row" role="listitem">
                <div className="apt-row__icon-wrap">
                  <Icon className="apt-row__icon" />
                </div>
                <div className="apt-row__content">
                  <div className="apt-row__top">
                    <h3 className="apt-row__title">{label}</h3>
                    <span className="apt-row__badge">
                      <IconClock className="apt-row__badge-icon" />
                      {badge}
                    </span>
                  </div>
                  <p className="apt-row__desc">{description}</p>
                </div>
                <Link href={`/appointment/form?type=${value}`} className="apt-row__cta">
                  Choisir
                  <IconArrowRight className="apt-row__cta-icon" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
