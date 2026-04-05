// Expected: Let user choose appointment type and route to /appointment/form?type=...
import Link from "next/link";

const TYPES = [
  { label: "Retrait CIN", value: "pickup" },
  { label: "Nouvelle demande", value: "new_request" },
  { label: "Renouvellement", value: "renewal" }
];

export function AppointmentTypeSelector() {
  return (
    <section>
      <h1>Choisissez votre type de rendez-vous</h1>
      <div className="grid-stack">
        {TYPES.map((item) => (
          <Link key={item.value} href={`/appointment/form?type=${item.value}`}>
            {item.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
