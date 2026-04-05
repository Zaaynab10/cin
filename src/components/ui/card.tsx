// Expected: Generic card container for grouped content blocks.
import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
};

export function Card({ children }: CardProps) {
  return <section className="card">{children}</section>;
}
