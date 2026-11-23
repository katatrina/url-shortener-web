import { ref, watch, type Ref } from 'vue'

export interface FieldValidationOptions<F extends string> {
  fields: readonly F[]
  /** The value as it will be validated (e.g. trimmed). */
  value: (field: F) => string
  /** Error message, or null when valid. */
  check: (field: F, value: string) => string | null
}

/**
 * Shows errors late and clears them early:
 * - on blur, a field is checked only if it has a value (no "required" error for tabbing past);
 * - once a field shows an error, it's re-checked on every change, so the error goes away as soon as it's fixed;
 * - on submit, every field is checked.
 */
export function useFieldValidation<F extends string>({ fields, value, check }: FieldValidationOptions<F>) {
  const errors = ref({}) as Ref<Partial<Record<F, string>>>

  function set(field: F, message: string | null) {
    const next = { ...errors.value }
    if (message) next[field] = message
    else delete next[field]
    errors.value = next
  }

  for (const field of fields) {
    watch(
      () => value(field),
      (current) => {
        if (errors.value[field]) set(field, check(field, current))
      },
    )
  }

  function onBlur(field: F) {
    const current = value(field)
    if (current) set(field, check(field, current))
  }

  /**
   * Checks every field; returns true when all are valid. When valid, errors from the last response stay
   * until the next response replaces them, so the form doesn't collapse and grow again on resubmit.
   */
  function validateAll(): boolean {
    const next: Partial<Record<F, string>> = {}
    for (const field of fields) {
      const message = check(field, value(field))
      if (message) next[field] = message
    }
    if (Object.keys(next).length === 0) return true
    errors.value = next
    return false
  }

  function setErrors(next: Partial<Record<F, string>>) {
    errors.value = next
  }

  function reset() {
    errors.value = {}
  }

  return { errors, onBlur, validateAll, setErrors, reset }
}
