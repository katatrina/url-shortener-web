import { computed, type Ref } from 'vue'
import { formatDistanceToNow, fromUnixTime } from 'date-fns'

export function useTimeAgo(timestamp: Ref<number>) {
  return computed(() =>
    formatDistanceToNow(fromUnixTime(timestamp.value), { addSuffix: true })
  )
}
