import { onScopeDispose, ref } from 'vue'

const COPIED_MS = 2000

/** `copiedText` holds the last copied text for a moment, to show a tick next to it. Failures show a toast. */
export function useCopy() {
  const toast = useToast()
  const copiedText = ref<string | null>(null)
  let timer: ReturnType<typeof setTimeout> | undefined

  async function copy(text: string) {
    clearTimeout(timer)
    try {
      await navigator.clipboard.writeText(text)
      copiedText.value = text
      timer = setTimeout(() => (copiedText.value = null), COPIED_MS)
    } catch {
      copiedText.value = null
      toast.add({ id: 'copy', title: 'Không copy được link', icon: 'i-lucide-circle-alert', color: 'error', duration: 5000 })
    }
  }

  onScopeDispose(() => clearTimeout(timer))

  return { copiedText, copy }
}
