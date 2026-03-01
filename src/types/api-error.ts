// ═══════════════════════════════════════════════════════════════════════════
// API Error Types — Standard Laravel error shapes
// ═══════════════════════════════════════════════════════════════════════════

export interface ApiValidationError {
  message: string;
  errors: Record<string, string[]>;
}

export interface ApiCustomError {
  error: string;
  message: string;
  details?: Record<string, unknown>;
}

/**
 * Type guard: check if an Axios error response is a validation error (422)
 */
export function isValidationError(
  error: unknown,
): error is { response: { data: ApiValidationError; status: 422 } } {
  if (typeof error !== "object" || error === null) return false;
  const err = error as Record<string, unknown>;
  const response = err.response as Record<string, unknown> | undefined;
  return (
    response?.status === 422 &&
    typeof (response?.data as Record<string, unknown>)?.errors === "object"
  );
}

/**
 * Type guard: check if an Axios error response is a custom business error (400)
 */
export function isCustomError(
  error: unknown,
): error is { response: { data: ApiCustomError; status: number } } {
  if (typeof error !== "object" || error === null) return false;
  const err = error as Record<string, unknown>;
  const response = err.response as Record<string, unknown> | undefined;
  return typeof (response?.data as Record<string, unknown>)?.error === "string";
}

/**
 * Extract a user-friendly message from any API error
 */
export function getErrorMessage(error: unknown): string {
  if (isCustomError(error)) {
    return error.response.data.message;
  }
  if (isValidationError(error)) {
    return error.response.data.message || "Validation failed";
  }
  if (error instanceof Error) return error.message;
  return "An unexpected error occurred";
}
