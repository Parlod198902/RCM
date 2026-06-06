<template>
  <div class="flex items-center gap-2">
    <div class="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
      <div
        class="h-full rounded-full transition-all"
        :style="{ width: value + '%', background: color }"
      ></div>
    </div>
    <span class="text-xs font-medium text-slate-600 w-8 text-right">{{ value }}%</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ value: number }>()

const color = computed(() => {
  if (props.value >= 80) return '#22C55E'
  if (props.value >= 60) return '#EAB308'
  return '#EF4444'
})
</script>
