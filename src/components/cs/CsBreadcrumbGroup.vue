<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'
import CsIcon from './CsIcon.vue'

/** The last item is the current page; it needs no `to`. */
defineProps<{ items: { text: string; to?: RouteLocationRaw }[] }>()
</script>

<template>
  <nav class="cs-breadcrumbs" aria-label="Đường dẫn trang">
    <ol>
      <li v-for="(item, index) in items" :key="index">
        <RouterLink v-if="item.to" :to="item.to">{{ item.text }}</RouterLink>
        <span v-else aria-current="page">{{ item.text }}</span>
        <CsIcon v-if="index < items.length - 1" name="angle-right" />
      </li>
    </ol>
  </nav>
</template>

<style scoped>
.cs-breadcrumbs li {
  min-width: 0;
  overflow-wrap: anywhere;
}
</style>
