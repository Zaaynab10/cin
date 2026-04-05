// Expected: Not-found UI for unknown routes.
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="container-page">
      <h1>Page introuvable</h1>
      <Link href="/">Retour a l'accueil</Link>
    </main>
  );
}
