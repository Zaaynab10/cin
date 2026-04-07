// Expected: 404 Not Found page. Shown when navigating to a non-existent route.
import Link from "next/link";

function IconLock({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function IconArrowLeft({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

function IconSearch({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

export default function NotFoundPage() {
  return (
    <div className="ep">
      <div className="ep__inner">
        <p className="ep__code">404</p>
        <div className="ep__bar ep__bar--accent" />
        <IconLock className="ep__icon" />
        <h1 className="ep__title">Page introuvable</h1>
        <p className="ep__subtitle">
          La page que vous recherchez n'existe pas ou a été déplacée.
          Vérifiez l'URL ou retournez à l'accueil.
        </p>
        <div className="ep__actions">
          <Link className="ep__cta ep__cta--accent" href="/">
            <IconArrowLeft className="ep__cta-icon" /> Retour à l'accueil
          </Link>
          <Link className="ep__secondary" href="/">
            <IconSearch className="ep__secondary-icon" />Vérifier mon statut CIN
          </Link>
        </div>
      </div>
    </div>
  );
}
