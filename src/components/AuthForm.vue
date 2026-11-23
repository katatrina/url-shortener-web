<script setup lang="ts">
// Shared frame of the login and signup pages.
import CsContainer from '@/components/cs/CsContainer.vue'
import CsHeader from '@/components/cs/CsHeader.vue'

defineProps<{ title: string }>()
defineEmits<{ submit: [] }>()
</script>

<template>
  <div class="auth">
    <CsHeader variant="h1">{{ title }}</CsHeader>

    <CsContainer>
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
}

.auth__form {
  display: flex;
  flex-direction: column;
  gap: var(--space-scaled-l);
  padding-top: var(--space-scaled-l);
}

.auth__actions {
  display: flex;
  justify-content: flex-end;
}

.auth__footer {
  margin: 0;
  text-align: center;
}
</style>
