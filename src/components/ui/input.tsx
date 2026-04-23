// Expected: Reusable input primitive with default className and passthrough props.
import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input(props: InputProps) {
	return (
		<input {...props} className={`input ${props.className ?? ""}`.trim()} />
	);
}
