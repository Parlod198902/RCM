<template>
  <div>
    <button @click="router.back()"
      class="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 mb-6 transition-colors">
      ← Volver
    </button>

    <div v-if="students.loading" class="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400">
      <div class="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
      Cargando…
    </div>

    <div v-else-if="student" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Info card -->
      <div class="lg:col-span-1 space-y-4">
        <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div class="flex items-center gap-4 mb-4">
            <div class="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0"
              style="background:#1A365D">
              {{ initials }}
            </div>
            <div>
              <h1 class="font-bold text-slate-800 text-lg leading-tight">{{ student.nombre_completo }}</h1>
              <p class="text-sm text-slate-500">ID: {{ student.id }}</p>
            </div>
          </div>

          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold mb-4"
            :style="badgeStyle">
            {{ riskLabel }}
          </span>

          <div class="space-y-3 text-sm">
            <div class="flex justify-between">
              <span class="text-slate-500">Grupo</span>
              <span class="font-medium text-slate-800">{{ student.grupo }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-slate-500">Participación promedio</span>
              <span class="font-bold" :style="`color:${riskHex}`">{{ student.participacion }}%</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-slate-500">Registros cargados</span>
              <span class="font-medium text-slate-800">{{ (student as any).total_registros ?? 0 }}</span>
            </div>
          </div>
        </div>

        <!-- Plan de apoyo -->
        <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-5"
          :style="`border-left: 4px solid ${riskHex}`">
          <div class="flex items-center gap-2 mb-2">
            <span>💡</span>
            <span class="font-semibold text-sm text-slate-800">Plan de Apoyo Sugerido</span>
          </div>
          <p class="text-sm text-slate-600 leading-relaxed">{{ supportPlan }}</p>
        </div>
      </div>

      <!-- Charts -->
      <div class="lg:col-span-2 space-y-4">
        <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 class="font-semibold text-slate-700 mb-4">Tendencia de Desempeño</h2>
          <div style="height:200px">
            <Line :data="lineData" :options="lineOptions" />
          </div>
        </div>

        <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 class="font-semibold text-slate-700 mb-4">Métricas Actuales</h2>
          <div class="space-y-4">
            <div>
              <div class="flex justify-between text-sm mb-1">
                <span class="text-slate-600">Participación</span>
                <span class="font-bold">{{ student.participacion }}%</span>
              </div>
              <div class="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div class="h-full rounded-full transition-all"
                  :style="{ width: student.participacion + '%', background: riskHex }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400">
      Estudiante no encontrado.
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Filler } from 'chart.js'
import { useStudentsStore } from '@/stores/students'

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Filler)

const route = useRoute()
const router = useRouter()
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

const initials = computed(() => {
  const n = student.value?.nombre ?? ''
  const ap = student.value?.apellido_paterno ?? ''
  return (n[0] ?? '') + (ap[0] ?? '')
})

const supportPlan = computed(() => {
  const nivel = student.value?.nivel_riesgo
  if (nivel === 'rojo') return 'Alerta Crítica. Generar cita de urgencia con Dirección de Carrera. Planificar recuperación intensiva.'
  if (nivel === 'amarillo') return 'Contactar al alumno para entrevista motivacional. Sugerir tutorías de apoyo.'
  return 'El alumno mantiene un desempeño excelente. Invitar a programas de mentoría avanzada.'
})

const lineData = computed(() => {
  const historial = (student.value as any)?.historial_participaciones ?? []

  if (historial.length > 0) {
    // Usar datos reales del historial
    const labels = historial.map((h: any) => {
      const d = new Date(h.fecha)
      return d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short' })
    })
    const valores = historial.map((h: any) => h.valor)
    return {
      labels,
      datasets: [{
        label: 'Participación %',
        data: valores,
        borderColor: riskHex.value,
        backgroundColor: riskHex.value + '20',
        fill: true, tension: 0.4,
        pointBackgroundColor: '#fff',
        pointBorderColor: riskHex.value,
        pointBorderWidth: 2, pointRadius: 4,
      }],
    }
  }

  // Fallback si no hay historial
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
    y: { min: 0, max: 100, grid: { color: '#f1f5f9' }, ticks: { color: '#94a3b8' } },
    x: { grid: { display: false }, ticks: { color: '#94a3b8' } },
  },
}

onMounted(() => {
  const id = Number(route.params.id)
  students.fetchById(id)
})
</script>
