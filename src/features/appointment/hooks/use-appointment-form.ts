// Expected: Client hook to orchestrate multi-step appointment form state.
"use client";

import { useMemo, useState } from "react";

export function useAppointmentForm() {
  const [step, setStep] = useState(1);

  const controls = useMemo(
    () => ({
      step,
      next: () => setStep((value) => value + 1),
      previous: () => setStep((value) => Math.max(1, value - 1))
    }),
    [step]
  );

  return controls;
}
