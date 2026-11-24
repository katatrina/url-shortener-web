<script setup lang="ts">
// Shared frame of the login and signup pages.
import CsContainer from '@/components/cs/CsContainer.vue'
import CsHeader from '@/components/cs/CsHeader.vue'
import { BRAND_NAME, BRAND_TAGLINE } from '@/config/brand'

defineProps<{ title: string }>()
defineEmits<{ submit: [] }>()
</script>

<template>
  <div class="auth">
    <div class="auth__brand">
      <RouterLink class="auth__wordmark" :to="{ name: 'home' }">{{ BRAND_NAME }}</RouterLink>
      <p class="auth__tagline">{{ BRAND_TAGLINE }}</p>
    </div>

    <CsContainer>
      <template #header><CsHeader variant="h1">{{ title }}</CsHeader></template>
      <form class="auth__form" novalidate @submit.prevent="$emit('submit')">
        <slot />
        <div class="auth__actions"><slot name="actions" /></div>
      </form>
    </CsContainer>

    <p v-if="$slots.footer" class="auth__footer"><slot name="footer" /></p>
  </div>
</template>

<style scoped>
.auth {
  display: flex;
  flex-direction: column;
  gap: var(--space-scaled-l);
  max-width: 400px;
  margin: 0 auto;
  padding-top: var(--space-scaled-xxxl);
}

.auth__brand {
  text-align: center;
}

.auth__wordmark {
  color: var(--color-text-heading-default);
  font-size: var(--font-size-display-l);
  line-height: var(--line-height-display-l);
  font-weight: 800;
  letter-spacing: var(--letter-spacing-display-l);
  text-decoration: none;
}

.auth__wordmark:focus-visible {
  outline: 2px solid var(--color-border-item-focused);
  outline-offset: 2px;
}

.auth__tagline {
  margin: 0;
  color: var(--color-text-body-secondary);
}

.auth__form {
  display: flex;
  flex-direction: column;
  gap: var(--space-scaled-l);
  padding-top: var(--space-scaled-xs);
}

.auth__actions :deep(.cs-btn) {
  justify-content: center;
  width: 100%;
}

.auth__footer {
  margin: 0;
  text-align: center;
}
</style>
