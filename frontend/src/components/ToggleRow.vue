<template>
  <div class="flex items-center justify-between gap-4">
    <div>
      <p class="text-sm font-medium text-slate-800">{{ label }}</p>
      <p class="text-xs text-slate-500 mt-0.5">{{ description }}</p>
    </div>
    <button
      type="button"
      role="switch"
      :aria-checked="value"
      @click="$emit('update', !value)"
      :class="[
        'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
        value ? 'bg-brand' : 'bg-slate-200'
      ]"
    >
      <span
        :class="[
          'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform',
          value ? 'translate-x-5' : 'translate-x-0'
        ]"
      ></span>
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{ label: string; description: string; value: boolean }>()
defineEmits<{ update: [value: boolean] }>()
</script>
