// Expected: Show existing appointment and actions (edit/cancel) based on backend permissions.
"use client";

type AppointmentDetailsProps = {
  token: string;
};

export function AppointmentDetails({ token }: AppointmentDetailsProps) {
  return (
    <section>
      <h1>Gestion du rendez-vous</h1>
      <p>Token: {token}</p>
      <button type="button">Modifier</button>
      <button type="button">Annuler</button>
    </section>
  );
}
