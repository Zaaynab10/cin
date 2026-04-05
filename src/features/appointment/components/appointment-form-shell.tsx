// Expected: Orchestrate the full multi-step form and render each step component.
"use client";

import { ConfirmationStep } from "./confirmation-step";
import { PersonalInfoStep } from "./personal-info-step";
import { RequiredDocumentsStep } from "./required-documents-step";
import { ScheduleStep } from "./schedule-step";
import { SuccessStep } from "./success-step";
import { useAppointmentForm } from "../hooks/use-appointment-form";

type AppointmentFormShellProps = {
  initialType?: string;
};

export function AppointmentFormShell({ initialType }: AppointmentFormShellProps) {
  const { step, next, previous } = useAppointmentForm();

  return (
    <section>
      <h1>Formulaire de rendez-vous</h1>
      <p>Type: {initialType ?? "non defini"}</p>
      {step === 1 && <PersonalInfoStep onNext={next} />}
      {step === 2 && <ScheduleStep onNext={next} onPrevious={previous} />}
      {step === 3 && <ConfirmationStep onNext={next} onPrevious={previous} />}
      {step === 4 && <SuccessStep onNext={next} />}
      {step === 5 && <RequiredDocumentsStep onPrevious={previous} />}
    </section>
  );
}
