<template>
  <!-- Backdrop -->
  <Transition name="fade">
    <div v-if="studentId !== null"
      class="fixed inset-0 z-40" style="background:rgba(0,0,0,0.3)"
      @click="$emit('close')"></div>
  </Transition>

  <!-- Drawer -->
  <Transition name="slide">
    <div v-if="studentId !== null && student"
      class="fixed right-0 top-0 h-full bg-white shadow-2xl z-50 overflow-y-auto"
      style="width:min(480px,100vw)">
      <div class="p-6">
        <!-- Header -->
        <div class="flex items-start justify-between mb-4">
          <div>
            <h2 class="text-xl font-bold text-slate-800">{{ student.nombre_completo }}</h2>
            <p class="text-sm text-slate-500">ID: {{ student.id }} · Grupo: {{ student.grupo }}</p>
          </div>
          <button @click="$emit('close')"
            class="p-2 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors">✕</button>
        </div>

        <!-- Badge + metrics -->
        <div class="flex flex-wrap items-center gap-3 mb-5">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold"
            :style="badgeStyle">{{ riskLabel }}</span>
          <span class="text-sm text-slate-600">
            Participación: <strong>{{ student.participacion }}%</strong>
          </span>
        </div>

        <hr class="border-slate-200 mb-5" />

        <!-- Support plan -->
        <div class="p-4 bg-blue-50 border border-blue-100 rounded-xl mb-6">
          <div class="flex items-center gap-2 mb-2">
            <span>💡</span>
            <span class="font-semibold text-sm text-blue-900">Plan de Apoyo Sugerido</span>
          </div>
          <p class="text-sm text-blue-800 leading-relaxed">{{ supportPlan }}</p>
        </div>

        <!-- Chart -->
        <h3 class="font-semibold text-slate-700 mb-3">Tendencia de Desempeño</h3>
        <div style="height:180px" class="mb-6">
          <Line :data="lineData" :options="lineOptions" />
        </div>

        <!-- Actions -->
        <RouterLink :to="`/alumnos/${student.id}`"
          class="flex items-center justify-center w-full px-4 py-2 text-white rounded-lg text-sm transition-colors"
          style="background:#1A365D"
          @click="$emit('close')">
          Ver perfil completo →
        </RouterLink>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Filler } from 'chart.js'
import { useStudentsStore } from '@/stores/students'

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Filler)

const props = defineProps<{ studentId: number | null }>()
defineEmits<{ close: [] }>()

const students = useStudentsStore()
const student = computed(() => students.selected)

const riskHex = computed(() => {
  const m: Record<string, string> = { verde: '#22C55E', amarillo: '#EAB308', rojo: '#EF4444' }
  return m[student.value?.nivel_riesgo ?? 'verde']
})

const riskLabel = computed(() => {
  const m: Record<string, string> = { verde: 'Sin Riesgo', amarillo: 'Riesgo Medio', rojo: 'Riesgo Crítico' }
  return m[student.value?.nivel_riesgo ?? 'verde']
})

const badgeStyle = computed(() => {
  const m: Record<string, string> = {
    verde:    'background:#dcfce7; color:#166534',
    amarillo: 'background:#fef9c3; color:#854d0e',
    rojo:     'background:#fee2e2; color:#991b1b',
  }
  return m[student.value?.nivel_riesgo ?? 'verde']
})

const supportPlan = computed(() => {
  const nivel = student.value?.nivel_riesgo
  if (nivel === 'rojo') return 'Alerta Crítica. Generar cita de urgencia con Dirección de Carrera. Planificar recuperación intensiva.'
  if (nivel === 'amarillo') return 'Contactar al alumno para entrevista motivacional. Sugerir tutorías de apoyo.'
  return 'El alumno mantiene un desempeño excelente. Invitar a programas de mentoría avanzada.'
})

const lineData = computed(() => {
  const val = student.value?.participacion ?? 0
  return {
    labels: ['Sep', 'Oct', 'Nov', 'Dic', 'Ene'],
    datasets: [{
      label: 'Participación %',
      data: [val + 10, val + 7, val + 4, val + 2, val],
      borderColor: riskHex.value,
      backgroundColor: riskHex.value + '20',
      fill: true, tension: 0.4,
      pointBackgroundColor: '#fff',
      pointBorderColor: riskHex.value,
      pointBorderWidth: 2, pointRadius: 4,
    }],
  }
})

const lineOptions = {
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    y: { min: 0, max: 100, grid: { color: '#f1f5f9' }, ticks: { color: '#94a3b8', font: { size: 11 } } },
    x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 11 } } },
  },
}

watch(() => props.studentId, (id) => {
  if (id !== null) students.fetchById(id)
  else students.clearSelected()
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.slide-enter-active, .slide-leave-active { transition: transform 0.3s ease; }
.slide-enter-from, .slide-leave-to { transform: translateX(100%); }
</style>
