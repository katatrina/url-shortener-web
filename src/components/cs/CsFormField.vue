<script setup lang="ts">
// Passes its ids to the control in the slot (CsInput reads them).
import { computed, provide, useId } from 'vue'
import CsIcon from './CsIcon.vue'
import { formFieldKey } from './formField'

const props = defineProps<{
  label?: string
  description?: string
  constraintText?: string
  errorText?: string
  /** Adds a red "*" after the label. */
  required?: boolean
}>()

const id = useId()
const controlId = `${id}-control`
const descriptionId = `${id}-description`
const errorId = `${id}-error`
const constraintId = `${id}-constraint`

const describedBy = computed(() => {
  const ids = [
    props.description && descriptionId,
    props.errorText && errorId,
    props.constraintText && constraintId,
  ].filter(Boolean)
  return ids.length ? ids.join(' ') : undefined
})

provide(formFieldKey, {
  controlId,
  describedBy,
  invalid: computed(() => Boolean(props.errorText)),
})
</script>

<template>
  <div class="cs-field">
    <label v-if="label" class="cs-field__label" :for="controlId">
      {{ label }}<span v-if="required" class="cs-field__required" aria-hidden="true"> *</span>
      <span v-if="$slots.info" class="cs-field__info"><slot name="info" /></span>
    </label>
    <div v-if="description" :id="descriptionId" class="cs-field__description">{{ description }}</div>
    <div class="cs-field__controls"><slot /></div>
    <div v-if="errorText" :id="errorId" class="cs-field__error">
      <CsIcon name="status-warning" />
      <span>{{ errorText }}</span>
    </div>
    <div v-if="constraintText" :id="constraintId" class="cs-field__constraint">{{ constraintText }}</div>
  </div>
</template>

<style scoped>
.cs-field__required {
  color: var(--color-text-status-error);
}
</style>
