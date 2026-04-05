// Expected: Global runtime error UI for app router segment failures.
"use client";

export default function GlobalError({
  error,
  reset
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <main className="container-page">
      <h1>Une erreur est survenue</h1>
      <p>{error.message}</p>
      <button onClick={reset}>Reessayer</button>
    </main>
  );
}
