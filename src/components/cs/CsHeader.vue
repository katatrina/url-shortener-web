<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'h1' | 'h2' | 'h3'
    counter?: string
    description?: string
  }>(),
  { variant: 'h2' },
)
</script>

<template>
  <div class="cs-header" :class="`cs-header--${variant}`">
    <div class="cs-header__main">
      <component :is="variant" class="cs-header__title">
        <slot />
        <span v-if="counter" class="cs-header__counter">{{ counter }}</span>
      </component>
      <p v-if="description" class="cs-header__description">{{ description }}</p>
    </div>
    <div v-if="$slots.actions" class="cs-header__actions">
      <slot name="actions" />
    </div>
  </div>
</template>
