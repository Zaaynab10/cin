// Expected: Convert raw API errors to a stable AppError consumed by UI.
import { AppError } from "./app-error";

export function mapApiError(error: unknown): AppError {
  const input = (error ?? {}) as {
    code?: string;
    message?: string;
    status?: number;
    fieldErrors?: Record<string, string[]>;
  };

  return new AppError(
    input.code ?? "UNKNOWN_ERROR",
    input.message ?? "Unexpected error",
    input.status ?? 500,
    input.fieldErrors
  );
}
