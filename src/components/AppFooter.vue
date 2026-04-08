<script setup lang="ts">
import { Github } from 'lucide-vue-next'
</script>

<template>
  <footer class="border-t border-border bg-muted/50">
    <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
      <p class="text-sm text-muted-foreground">Built with Go + Vue</p>
      <a
        href="https://github.com/katatrina/url-shortener"
        target="_blank"
        rel="noopener noreferrer"
        class="text-muted-foreground transition-colors hover:text-foreground"
      >
        <Github class="h-5 w-5" />
      </a>
    </div>
  </footer>
</template>
