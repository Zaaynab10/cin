// Expected: Stepper indicator for multi-step appointment flow.
type StepperProps = {
  current: number;
  total: number;
};

export function Stepper({ current, total }: StepperProps) {
  return (
    <p>
      Etape {current} / {total}
    </p>
  );
}
