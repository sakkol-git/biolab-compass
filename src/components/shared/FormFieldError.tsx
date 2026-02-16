/* ═══════════════════════════════════════════════════════════════════════════
 * FormFieldError — Inline form validation error display.
 *
 * Addresses: UI-003 (No form validation messages)
 * ═══════════════════════════════════════════════════════════════════════════ */

interface FormFieldErrorProps {
  error?: string;
}

export function FormFieldError({ error }: FormFieldErrorProps) {
  if (!error) return null;
  return <p className="text-sm text-destructive mt-1">{error}</p>;
}
