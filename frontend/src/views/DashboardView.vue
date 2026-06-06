<template>
  <div>
    <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-slate-800">Dashboard Institucional</h1>
        <p class="text-slate-500 text-sm mt-1">Resumen general del estado académico</p>
      </div>
      <button @click="exportExcel" class="flex items-center gap-2 px-4 py-2 border border-slate-300 bg-white text-slate-700 rounded-lg text-sm hover:bg-slate-50 transition-colors">
        ⬇ Exportar Excel
      </button>
    </div>

    <!-- Stat cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <p class="text-sm text-slate-500 mb-1">Total Estudiantes</p>
        <p class="text-3xl font-bold text-slate-800">
          <span v-if="dashboard.loading" class="animate-pulse text-slate-300">…</span>
          <span v-else>{{ dashboard.stats.total }}</span>
        </p>
      </div>
      <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-5" style="border-bottom: 4px solid #22C55E">
        <p class="text-sm text-slate-500 mb-1">Sin Riesgo</p>
        <p class="text-3xl font-bold" style="color:#22C55E">{{ dashboard.stats.verde }}</p>
      </div>
      <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-5" style="border-bottom: 4px solid #EAB308">
        <p class="text-sm text-slate-500 mb-1">Riesgo Medio</p>
        <p class="text-3xl font-bold" style="color:#EAB308">{{ dashboard.stats.amarillo }}</p>
      </div>
      <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-5" style="border-bottom: 4px solid #EF4444">
        <p class="text-sm text-slate-500 mb-1">Riesgo Crítico</p>
        <p class="text-3xl font-bold" style="color:#EF4444">{{ dashboard.stats.rojo }}</p>
      </div>
    </div>

    <!-- Charts -->
    <div class="grid grid-cols-1 lg:grid-cols-5 gap-4">
      <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-5 lg:col-span-2">
        <h2 class="font-semibold text-slate-700 mb-4">Distribución Global</h2>
        <div style="height:260px">
          <Doughnut v-if="!dashboard.loading && pieReady" :data="pieData" :options="pieOptions" />
          <div v-else class="h-full flex items-center justify-center text-slate-400 text-sm">
            {{ dashboard.loading ? 'Cargando…' : 'Sin datos' }}
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-5 lg:col-span-3">
        <h2 class="font-semibold text-slate-700 mb-4">Niveles de Riesgo por Grupo</h2>
        <div style="height:260px">
          <Bar v-if="!dashboard.loading && barReady" :data="barData" :options="barOptions" />
          <div v-else class="h-full flex items-center justify-center text-slate-400 text-sm">
            {{ dashboard.loading ? 'Cargando…' : 'Sin datos' }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { Doughnut, Bar } from 'vue-chartjs'
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale, BarElement, Title
} from 'chart.js'
import { useDashboardStore } from '@/stores/dashboard'
import { reportsApi, triggerDownload } from '@/api/reports'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title)

const dashboard = useDashboardStore()

const pieReady = computed(() =>
  dashboard.stats.total > 0
)

const barReady = computed(() =>
  dashboard.chartData.length > 0
)

const pieData = computed(() => ({
  labels: ['Sin Riesgo', 'Riesgo Medio', 'Riesgo Crítico'],
  datasets: [{
    data: [dashboard.stats.verde, dashboard.stats.amarillo, dashboard.stats.rojo],
    backgroundColor: ['#22C55E', '#EAB308', '#EF4444'],
    borderWidth: 0,
    hoverOffset: 8,
  }],
}))

const pieOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: 'bottom' as const } },
  cutout: '65%',
}

const barData = computed(() => ({
  labels: dashboard.chartData.map((d: any) => d.grupo),
  datasets: [
    { label: 'Sin Riesgo',     data: dashboard.chartData.map((d: any) => d.verde),    backgroundColor: '#22C55E', borderRadius: 4 },
    { label: 'Riesgo Medio',   data: dashboard.chartData.map((d: any) => d.amarillo), backgroundColor: '#EAB308', borderRadius: 4 },
    { label: 'Riesgo Crítico', data: dashboard.chartData.map((d: any) => d.rojo),     backgroundColor: '#EF4444', borderRadius: 4 },
  ],
}))

const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: 'bottom' as const } },
  scales: {
    x: { stacked: true, grid: { display: false } },
    y: { stacked: true, grid: { color: '#f1f5f9' } },
  },
}

async function exportExcel() {
  try {
    const { data } = await reportsApi.downloadExcel()
    triggerDownload(data, 'reporte_rcm.xlsx')
  } catch (e) {
    console.error('Error exportando:', e)
  }
}

onMounted(() => dashboard.fetchStats())
</script>
