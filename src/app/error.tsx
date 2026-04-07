// Expected: Global runtime error UI for app router segment failures.
"use client";
import Link from "next/link";

function IconAlertTriangle({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function IconAlertCircle({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function IconRotateCcw({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15a9 9 0 1 0 .49-3.5" />
    </svg>
  );
}

function IconHome({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

type Props = { error: Error & { digest?: string }; reset: () => void };

export default function GlobalError({ reset }: Props) {
  return (
    <div className="ep ep--error">
      <div className="ep__inner">
        <p className="ep__code">500</p>
        <div className="ep__bar ep__bar--error" />
        <IconAlertTriangle className="ep__icon" />
        <h1 className="ep__title">Erreur serveur</h1>
        <p className="ep__subtitle">
          Une erreur interne s'est produite. Nos équipes ont été notifiées.
          Veuillez réessayer dans quelques instants.
        </p>
        <div className="ep__notice">
          <IconAlertCircle className="ep__notice-icon" />
          <p className="ep__notice-text">
            Contactez le consulat au{" "}
            <a href="tel:+33156892345" className="ep__notice-link"><strong>+33{'\u00a0'}1{'\u00a0'}56{'\u00a0'}89{'\u00a0'}23{'\u00a0'}45</strong></a>{" "}
            si le problème persiste.
          </p>
        </div>
        <div className="ep__actions">
          <button className="ep__cta ep__cta--error" onClick={reset}>
            <IconRotateCcw className="ep__cta-icon" /> Réessayer
          </button>
          <Link className="ep__secondary" href="/">
            <IconHome className="ep__secondary-icon" />Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
