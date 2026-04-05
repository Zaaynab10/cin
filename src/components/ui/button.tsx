// Expected: Reusable button primitive with consistent styling and props.
import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function Button(props: ButtonProps) {
  return <button {...props} className={`btn ${props.className ?? ""}`.trim()} />;
}
