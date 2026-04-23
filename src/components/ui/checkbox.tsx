// Expected: Reusable checkbox primitive for consent and boolean form controls.
import type { InputHTMLAttributes } from "react";

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

export function Checkbox(props: CheckboxProps) {
	return <input type="checkbox" {...props} />;
}
