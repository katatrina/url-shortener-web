<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { Link2, LogOut, LayoutDashboard, Menu, X } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'
import { ref } from 'vue'

const authStore = useAuthStore()
const router = useRouter()
const mobileMenuOpen = ref(false)

function handleLogout() {
  authStore.logout()
  router.push('/')
  mobileMenuOpen.value = false
}
</script>

<template>
  <header class="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
      <RouterLink to="/" class="flex items-center gap-2 font-bold text-xl">
        <Link2 class="h-6 w-6" />
        <span class="hidden sm:inline">URL Shortener</span>
      </RouterLink>

      <!-- Desktop nav -->
      <nav class="hidden items-center gap-4 md:flex">
        <template v-if="authStore.isAuthenticated">
          <RouterLink to="/dashboard">
            <Button variant="ghost" size="sm">
              <LayoutDashboard class="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </RouterLink>
          <span class="text-sm text-muted-foreground">{{ authStore.user?.fullName }}</span>
          <Button variant="outline" size="sm" @click="handleLogout">
            <LogOut class="mr-2 h-4 w-4" />
            Logout
          </Button>
        </template>
        <template v-else>
          <RouterLink to="/login">
            <Button variant="ghost" size="sm">Login</Button>
          </RouterLink>
          <RouterLink to="/register">
            <Button size="sm">Get Started</Button>
          </RouterLink>
        </template>
      </nav>

      <!-- Mobile hamburger -->
      <button class="md:hidden" @click="mobileMenuOpen = !mobileMenuOpen">
        <X v-if="mobileMenuOpen" class="h-6 w-6" />
        <Menu v-else class="h-6 w-6" />
      </button>
    </div>

    <!-- Mobile menu -->
    <div v-if="mobileMenuOpen" class="border-t border-border px-4 pb-4 pt-2 md:hidden">
      <template v-if="authStore.isAuthenticated">
        <p class="mb-2 text-sm text-muted-foreground">{{ authStore.user?.fullName }}</p>
        <RouterLink to="/dashboard" class="block py-2 text-sm" @click="mobileMenuOpen = false">Dashboard</RouterLink>
        <button class="block py-2 text-sm text-destructive" @click="handleLogout">Logout</button>
      </template>
      <template v-else>
        <RouterLink to="/login" class="block py-2 text-sm" @click="mobileMenuOpen = false">Login</RouterLink>
        <RouterLink to="/register" class="block py-2 text-sm font-medium" @click="mobileMenuOpen = false">Get Started</RouterLink>
      </template>
    </div>
  </header>
</template>
