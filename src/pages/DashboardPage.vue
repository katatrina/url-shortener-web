<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { toast } from 'vue-sonner'
import { listUrls, deleteUrl, shortenUrl } from '@/api/urls'
import { isValidUrl } from '@/lib/validators'
import UrlCard from '@/components/UrlCard.vue'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Label from '@/components/ui/Label.vue'
import Dialog from '@/components/ui/Dialog.vue'
import Skeleton from '@/components/ui/Skeleton.vue'
import { Plus, ChevronLeft, ChevronRight, Link2 } from 'lucide-vue-next'
import type { UrlResponse, Pagination, FieldError } from '@/types'

const urls = ref<UrlResponse[]>([])
const pagination = ref<Pagination | null>(null)
const currentPage = ref(1)
const loading = ref(true)

// Create dialog
const createOpen = ref(false)
const createUrl = ref('')
const createAlias = ref('')
const createLoading = ref(false)
const createError = ref('')
const createFieldErrors = ref<FieldError[]>([])

// Delete dialog
const deleteOpen = ref(false)
const deleteCode = ref('')
const deleteLoading = ref(false)

const totalPages = computed(() => pagination.value?.totalPages ?? 1)

async function fetchUrls() {
  loading.value = true
  try {
    const res = await listUrls(currentPage.value, 10)
    urls.value = res.data.data
    pagination.value = res.data.meta.pagination ?? null
  } catch {
    toast.error('Failed to load URLs')
  } finally {
    loading.value = false
  }
}

function goToPage(page: number) {
  currentPage.value = page
  fetchUrls()
}

async function handleCreate() {
  createError.value = ''
  createFieldErrors.value = []

  if (!createUrl.value.trim()) {
    createError.value = 'Please enter a URL'
    return
  }
  if (!isValidUrl(createUrl.value.trim())) {
    createError.value = 'Please enter a valid HTTP or HTTPS URL'
    return
  }

  createLoading.value = true
  try {
    const res = await shortenUrl({
      longUrl: createUrl.value.trim(),
      customAlias: createAlias.value.trim() || undefined,
    })
    urls.value.unshift(res.data.data)
    if (pagination.value) pagination.value.total++
    createOpen.value = false
    createUrl.value = ''
    createAlias.value = ''
    toast.success('Link created successfully!')
  } catch (err: unknown) {
    const axiosErr = err as { response?: { data?: { message?: string; errors?: FieldError[] } } }
    if (axiosErr.response?.data?.errors) {
      createFieldErrors.value = axiosErr.response.data.errors
    }
    createError.value = axiosErr.response?.data?.message || 'Failed to create link'
  } finally {
    createLoading.value = false
  }
}

function confirmDelete(code: string) {
  deleteCode.value = code
  deleteOpen.value = true
}

async function handleDelete() {
  deleteLoading.value = true
  const code = deleteCode.value
  // Optimistic removal
  const idx = urls.value.findIndex((u) => u.shortCode === code)
  const removed = idx !== -1 ? urls.value.splice(idx, 1)[0] : null

  try {
    await deleteUrl(code)
    deleteOpen.value = false
    toast.success('Link deleted')
    if (pagination.value) pagination.value.total--
  } catch {
    // Rollback
    if (removed && idx !== -1) urls.value.splice(idx, 0, removed)
    toast.error('Failed to delete link')
  } finally {
    deleteLoading.value = false
  }
}

onMounted(fetchUrls)
</script>

<template>
  <div>
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">My Links</h1>
        <p v-if="pagination" class="text-sm text-muted-foreground">
          {{ pagination.total }} total
        </p>
      </div>
      <Button @click="createOpen = true">
        <Plus class="mr-2 h-4 w-4" />
        Create Link
      </Button>
    </div>

    <!-- Loading skeletons -->
    <div v-if="loading" class="space-y-4">
      <Skeleton v-for="i in 5" :key="i" class="h-20 w-full" />
    </div>

    <!-- Empty state -->
    <div v-else-if="urls.length === 0" class="flex flex-col items-center justify-center py-16 text-center">
      <Link2 class="mb-4 h-12 w-12 text-muted-foreground" />
      <h2 class="text-lg font-semibold">No links yet</h2>
      <p class="mt-1 text-sm text-muted-foreground">Create your first short link to get started.</p>
      <Button class="mt-4" @click="createOpen = true">
        <Plus class="mr-2 h-4 w-4" />
        Create Link
      </Button>
    </div>

    <!-- URL list -->
    <div v-else class="space-y-3">
      <UrlCard
        v-for="url in urls"
        :key="url.shortCode"
        :url="url"
        @delete="confirmDelete"
      />
    </div>

    <!-- Pagination -->
    <div v-if="!loading && totalPages > 1" class="mt-6 flex items-center justify-center gap-4">
      <Button variant="outline" size="sm" :disabled="currentPage <= 1" @click="goToPage(currentPage - 1)">
        <ChevronLeft class="mr-1 h-4 w-4" />
        Prev
      </Button>
      <span class="text-sm text-muted-foreground">
        Page {{ currentPage }} of {{ totalPages }}
      </span>
      <Button variant="outline" size="sm" :disabled="currentPage >= totalPages" @click="goToPage(currentPage + 1)">
        Next
        <ChevronRight class="ml-1 h-4 w-4" />
      </Button>
    </div>

    <!-- Create Dialog -->
    <Dialog :open="createOpen" @close="createOpen = false">
      <h2 class="mb-4 text-lg font-semibold">Create New Link</h2>
      <form @submit.prevent="handleCreate" class="space-y-4">
        <div class="space-y-2">
          <Label>Original URL</Label>
          <Input v-model="createUrl" type="url" placeholder="https://example.com/very/long/url" />
        </div>
        <div class="space-y-2">
          <Label>Custom Alias (optional)</Label>
          <Input v-model="createAlias" placeholder="my-custom-alias" />
        </div>

        <p v-if="createError" class="text-sm text-destructive">{{ createError }}</p>
        <p v-for="fe in createFieldErrors" :key="fe.field" class="text-sm text-destructive">{{ fe.message }}</p>

        <div class="flex justify-end gap-2">
          <Button variant="outline" type="button" @click="createOpen = false">Cancel</Button>
          <Button :loading="createLoading">Create</Button>
        </div>
      </form>
    </Dialog>

    <!-- Delete Confirmation Dialog -->
    <Dialog :open="deleteOpen" @close="deleteOpen = false">
      <h2 class="mb-2 text-lg font-semibold">Delete Link</h2>
      <p class="mb-4 text-sm text-muted-foreground">
        Are you sure you want to delete <span class="font-mono font-medium">/{{ deleteCode }}</span>?
        This action cannot be undone.
      </p>
      <div class="flex justify-end gap-2">
        <Button variant="outline" @click="deleteOpen = false">Cancel</Button>
        <Button variant="destructive" :loading="deleteLoading" @click="handleDelete">Delete</Button>
      </div>
    </Dialog>
  </div>
</template>
