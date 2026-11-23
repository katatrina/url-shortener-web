import { defineStore } from 'pinia'
import { ref } from 'vue'

const SUCCESS_TIMEOUT_MS = 10_000

export interface FlashItem {
  id: number
  type: 'success' | 'error' | 'warning' | 'info'
  header?: string
  content?: string
  /** Shows the text with a copy button, e.g. a new short link. */
  copyText?: string
}

/** Notifications shown under the top navigation. Success ones hide after 10s; errors stay until dismissed. */
export const useFlashStore = defineStore('flash', () => {
  const items = ref<FlashItem[]>([])
  const timers = new Map<number, ReturnType<typeof setTimeout>>()
  let nextId = 1

  function push(item: Omit<FlashItem, 'id'>): number {
    const id = nextId++
    items.value = [{ ...item, id }, ...items.value]
    if (item.type === 'success') timers.set(id, setTimeout(() => dismiss(id), SUCCESS_TIMEOUT_MS))
    return id
  }

  function dismiss(id: number): void {
    clearTimeout(timers.get(id))
    timers.delete(id)
    items.value = items.value.filter((item) => item.id !== id)
  }

  function clear(): void {
    for (const timer of timers.values()) clearTimeout(timer)
    timers.clear()
    items.value = []
  }

  return { items, push, dismiss, clear }
})
