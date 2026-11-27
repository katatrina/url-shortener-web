import { onScopeDispose, readonly, ref, watch, type Ref } from 'vue'

/** Follows `source`, but turns on only after it has been on for `delay` ms. Keeps spinners from flashing on fast requests. */
export function useDelayedFlag(source: Ref<boolean>, delay = 200) {
  const flag = ref(false)
  let timer: ReturnType<typeof setTimeout> | undefined

  watch(
    source,
    (on) => {
      clearTimeout(timer)
      if (on) timer = setTimeout(() => (flag.value = true), delay)
      else flag.value = false
    },
    { immediate: true },
  )

  onScopeDispose(() => clearTimeout(timer))

  return readonly(flag)
}
