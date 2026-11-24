<script setup lang="ts">
import { BRAND_NAME, BRAND_TAGLINE } from '@/config/brand'
</script>

<template>
  <div class="home">
    <h1 class="home__title">{{ BRAND_NAME }}</h1>
    <p class="home__tagline">{{ BRAND_TAGLINE }}</p>
    <div class="home__actions">
      <RouterLink class="cs-btn cs-btn--primary" :to="{ name: 'signup' }">Đăng ký</RouterLink>
      <RouterLink class="cs-btn" :to="{ name: 'login' }">Đăng nhập</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-scaled-l);
  padding-top: 20vh;
  text-align: center;
}

.home__title {
  margin: 0;
  color: var(--color-text-heading-default);
  font-size: 64px;
  line-height: 72px;
  font-weight: 800;
  letter-spacing: var(--letter-spacing-display-l);
}

.home__tagline {
  margin: 0;
  color: var(--color-text-body-secondary);
  font-size: var(--font-size-heading-m);
  line-height: var(--line-height-heading-m);
}

.home__actions {
  display: flex;
  gap: var(--space-static-xs);
}
</style>
