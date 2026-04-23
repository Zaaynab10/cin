import Image from "next/image";
import Link from "next/link";

function CalendarIcon() {
	return (
		<svg
			aria-hidden="true"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.8"
			strokeLinecap="round"
			strokeLinejoin="round"
			className="site-header__cta-icon"
		>
			<rect x="3.5" y="5" width="17" height="15.5" rx="3" />
			<path d="M7.5 3.5V7" />
			<path d="M16.5 3.5V7" />
			<path d="M3.5 9H20.5" />
			<path d="M8 12.5H8.01" />
			<path d="M12 12.5H12.01" />
			<path d="M16 12.5H16.01" />
			<path d="M8 16H8.01" />
			<path d="M12 16H12.01" />
		</svg>
	);
}

export function SiteHeader() {
	return (
		<header className="site-header">
			<div className="site-header__inner">
				<div className="site-header__identity">
					<Link
						href="/"
						className="site-header__brand"
						aria-label="Accueil du service public consulaire du Sénégal à Paris"
					>
						<div className="site-header__logo-shell">
							<Image
								src="/brand/logo-senegal-placeholder.jpg"
								alt="Logo du Consulat général du Sénégal à Paris"
								width={35}
								height={42}
								className="site-header__logo"
								priority
							/>
						</div>

						<div className="site-header__brand-copy">
							<span className="site-header__eyebrow">
								Consulat général du Sénégal à Paris
							</span>
							<span className="site-header__title">
								Service public consulaire de suivi de la CIN et de prise de
								rendez-vous
							</span>
						</div>
					</Link>
				</div>

				<Link href="/appointment" className="site-header__cta">
					<CalendarIcon />
					<span>Prendre un rendez-vous</span>
				</Link>
			</div>
		</header>
	);
}
