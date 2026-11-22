import type { ComputedRef, InjectionKey } from 'vue'

/** What CsFormField hands its control so label, description and error stay wired up. */
export interface FormFieldContext {
  controlId: string
  describedBy: ComputedRef<string | undefined>
  invalid: ComputedRef<boolean>
}

export const formFieldKey: InjectionKey<FormFieldContext> = Symbol('cs-form-field')
