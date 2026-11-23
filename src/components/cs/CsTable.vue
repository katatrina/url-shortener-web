<script setup lang="ts" generic="T">
// A column renders `cell(item)` as text, or the `cell-<id>` slot when given.
import CsContainer from './CsContainer.vue'
import CsIcon from './CsIcon.vue'

export interface TableColumn<Item> {
  id: string
  header: string
  /** Header text for screen readers only, e.g. an actions column. */
  headerHidden?: boolean
  cell?: (item: Item) => string | number
  width?: number
  minWidth?: number
  align?: 'start' | 'end'
}

const props = withDefaults(
  defineProps<{
    items: T[]
    columns: TableColumn<T>[]
    /** Property used as the row key. Falls back to the row index. */
    trackBy?: keyof T & string
    loading?: boolean
    loadingText?: string
    /** Makes rows clickable (pointer cursor) and emits `row-click`. */
    clickableRows?: boolean
    rowClass?: (item: T) => string | undefined
  }>(),
  { loadingText: 'Đang tải' },
)

const emit = defineEmits<{ 'row-click': [item: T, event: MouseEvent] }>()

defineSlots<
  {
    header?: () => unknown
    empty?: () => unknown
  } & Record<`cell-${string}`, (props: { item: T }) => unknown>
>()

function rowKey(item: T, index: number): PropertyKey {
  return props.trackBy ? (item[props.trackBy] as PropertyKey) : index
}

function onRowClick(item: T, event: MouseEvent) {
  if (!props.clickableRows) return
  // Links and buttons inside the row handle their own click.
  if ((event.target as HTMLElement).closest('a, button')) return
  emit('row-click', item, event)
}
</script>

<template>
  <CsContainer>
    <template v-if="$slots.header" #header><slot name="header" /></template>
    <div class="cs-table-wrap">
      <table class="cs-table" :aria-busy="loading || undefined">
        <thead>
          <tr>
            <th
              v-for="column in columns"
              :key="column.id"
              :style="{ width: column.width && `${column.width}px`, minWidth: column.minWidth && `${column.minWidth}px` }"
              :class="column.align === 'end' && 'cs-table__cell--end'"
            >
              <span><span :class="column.headerHidden && 'cs-sr-only'">{{ column.header }}</span></span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td :colspan="columns.length" class="cs-table-empty">
              <span class="cs-table__loading">
                <CsIcon name="status-in-progress" class="cs-table__spinner" />
                {{ loadingText }}
              </span>
            </td>
          </tr>
          <tr v-else-if="!items.length">
            <td :colspan="columns.length" class="cs-table-empty"><slot name="empty" /></td>
          </tr>
          <template v-else>
            <tr
              v-for="(item, index) in items"
              :key="rowKey(item, index)"
              :class="[clickableRows && 'cs-table__row--clickable', rowClass?.(item)]"
              @click="onRowClick(item, $event)"
            >
              <td v-for="column in columns" :key="column.id" :class="column.align === 'end' && 'cs-table__cell--end'">
                <slot :name="`cell-${column.id}`" :item="item">{{ column.cell?.(item) }}</slot>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </CsContainer>
</template>

<style scoped>
/* Header row runs edge to edge. */
.cs-container :deep(.cs-container__content) {
  padding-bottom: 0;
}

.cs-table__row--clickable {
  cursor: pointer;
}

.cs-table__cell--end {
  text-align: end;
}

.cs-table__loading {
  display: inline-flex;
  align-items: center;
  gap: var(--space-static-xs);
}

.cs-table__spinner {
  animation: cs-table-spin 0.7s linear infinite;
}

@keyframes cs-table-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
