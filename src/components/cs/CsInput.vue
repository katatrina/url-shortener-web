<script setup lang="ts">
// Inside a CsFormField it takes the field's id, aria-describedby and invalid state.
import { computed, inject } from 'vue'
import CsIcon from './CsIcon.vue'
import { formFieldKey } from './formField'

const props = withDefaults(
  defineProps<{
    type?: 'text' | 'search' | 'number' | 'email' | 'password' | 'url'
    placeholder?: string
    disabled?: boolean
    readOnly?: boolean
    invalid?: boolean
    warning?: boolean
    iconName?: string
    ariaLabel?: string
    ariaDescribedby?: string
    autocomplete?: string
  }>(),
  { type: 'text' },
)

const model = defineModel<string>({ required: true })

const field = inject(formFieldKey, null)

const isInvalid = computed(() => props.invalid || field?.invalid.value === true)
const describedBy = computed(
  () => [field?.describedBy.value, props.ariaDescribedby].filter(Boolean).join(' ') || undefined,
)
</script>

<template>
  <div
    class="cs-input"
    :class="{
      'cs-input--invalid': isInvalid,
      'cs-input--warning': warning && !isInvalid,
      'cs-input--disabled': disabled,
    }"
  >
    <CsIcon v-if="iconName" :name="iconName" />
    <input
      :id="field?.controlId"
      v-model="model"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readOnly"
      :autocomplete="autocomplete"
      :aria-label="ariaLabel"
      :aria-describedby="describedBy"
      :aria-invalid="isInvalid || undefined"
    />
  </div>
</template>
