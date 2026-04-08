<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { Zap, BarChart3, Pencil } from 'lucide-vue-next'
import ShortenForm from '@/components/ShortenForm.vue'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'

const features = [
  {
    icon: Zap,
    title: 'Fast Redirects',
    description: 'Lightning-fast URL resolution with Redis caching for instant redirects.',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Track clicks, referrers, and countries with detailed analytics charts.',
  },
  {
    icon: Pencil,
    title: 'Custom Aliases',
    description: 'Create memorable short URLs with your own custom aliases.',
  },
]
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="mx-auto max-w-4xl px-4 pb-16 pt-20 text-center sm:px-6 sm:pt-28 lg:px-8">
      <h1 class="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
        Shorten Your Links,
        <br />
        <span class="text-muted-foreground">Amplify Your Reach</span>
      </h1>
      <p class="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
        Create short, memorable links in seconds. Track every click with powerful analytics.
      </p>

      <div class="mx-auto mt-10 max-w-xl">
        <ShortenForm />
      </div>
    </section>

    <!-- Features -->
    <section class="mx-auto max-w-5xl px-4 pb-16 sm:px-6 lg:px-8">
      <div class="grid gap-6 sm:grid-cols-3">
        <Card v-for="f in features" :key="f.title" class="p-6 text-center">
          <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <component :is="f.icon" class="h-6 w-6 text-primary" />
          </div>
          <h3 class="text-lg font-semibold">{{ f.title }}</h3>
          <p class="mt-2 text-sm text-muted-foreground">{{ f.description }}</p>
        </Card>
      </div>
    </section>

    <!-- CTA -->
    <section class="border-t border-border bg-muted/30 px-4 py-16 text-center sm:px-6 lg:px-8">
      <h2 class="text-2xl font-bold">Want to manage & track your links?</h2>
      <p class="mt-2 text-muted-foreground">Create a free account to access your dashboard and analytics.</p>
      <RouterLink to="/register" class="mt-6 inline-block">
        <Button size="lg">Create Free Account</Button>
      </RouterLink>
    </section>
  </div>
</template>
