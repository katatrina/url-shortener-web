<script setup lang="ts">
// Inside a CsFormField it takes the field's id, aria-describedby and invalid state.
import { computed, inject, onMounted, ref } from 'vue'
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
    /** Gets focus on mount, and when a CsModal opens. */
    autofocus?: boolean
  }>(),
  { type: 'text' },
)

const model = defineModel<string>({ required: true })
const emit = defineEmits<{ blur: [event: FocusEvent] }>()

const field = inject(formFieldKey, null)
const inputEl = ref<HTMLInputElement | null>(null)

// Password inputs get an eye button to show what was typed. It's out of the tab order, so Tab goes
// straight to the next field, and clicking it keeps focus in the input.
const revealed = ref(false)
const inputType = computed(() => (props.type === 'password' && revealed.value ? 'text' : props.type))

const isInvalid = computed(() => props.invalid || field?.invalid.value === true)
const describedBy = computed(
  () => [field?.describedBy.value, props.ariaDescribedby].filter(Boolean).join(' ') || undefined,
)

onMounted(() => {
  if (props.autofocus) inputEl.value?.focus()
})
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
      ref="inputEl"
      v-model="model"
      :type="inputType"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readOnly"
      :autocomplete="autocomplete"
      :data-autofocus="autofocus || undefined"
      :aria-label="ariaLabel"
      :aria-describedby="describedBy"
      :aria-invalid="isInvalid || undefined"
      @blur="emit('blur', $event)"
    />
    <button
      v-if="type === 'password'"
      class="cs-input__reveal"
      type="button"
      tabindex="-1"
      :disabled="disabled"
      :aria-label="revealed ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'"
      @mousedown.prevent
      @click="revealed = !revealed"
    >
      <CsIcon :name="revealed ? 'eye-off' : 'eye'" />
    </button>
  </div>
</template>

<style scoped>
/* The focus ring is drawn inside the border instead of outside: an outer 1px box-shadow can leave
   a faint trace after blur at fractional zoom levels. */
.cs-input:focus-within {
  box-shadow: inset 0 0 0 1px var(--color-border-input-focused);
}

.cs-input--invalid:focus-within {
  box-shadow: inset 0 0 0 1px var(--color-text-status-error);
}

/* Edge adds its own reveal (eye) and clear buttons to inputs; we have our own reveal button. */
.cs-input > input::-ms-reveal,
.cs-input > input::-ms-clear {
  display: none;
}

.cs-input__reveal {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  padding: 0 var(--space-field-horizontal);
  border: 0;
  background: none;
  color: var(--color-text-interactive-default);
  cursor: pointer;
}

.cs-input__reveal:hover {
  color: var(--color-text-interactive-hover);
}

.cs-input__reveal:disabled {
  color: var(--color-text-input-disabled);
  cursor: default;
}
</style>
