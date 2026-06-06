<template>
  <span :class="classes">{{ label }}</span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ nivel: 'verde' | 'amarillo' | 'rojo' }>()

const label = computed(() => {
  const map = { verde: 'Sin Riesgo', amarillo: 'Riesgo Medio', rojo: 'Riesgo Crítico' }
  return map[props.nivel]
})

const classes = computed(() => {
  const base = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold'
  const map = {
    verde:    `${base} bg-green-100 text-green-800`,
    amarillo: `${base} bg-yellow-100 text-yellow-800`,
    rojo:     `${base} bg-red-100 text-red-800`,
  }
  return map[props.nivel]
})
</script>
