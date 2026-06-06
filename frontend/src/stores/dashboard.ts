import { defineStore } from 'pinia'
import { ref } from 'vue'
import { dashboardApi } from '@/api/dashboard'

interface Stats {
  total: number
  verde: number
  amarillo: number
  rojo: number
  alertas_sin_leer: number
}

interface CarreraData {
  carrera: string
  verde: number
  amarillo: number
  rojo: number
}

export const useDashboardStore = defineStore('dashboard', () => {
  const stats = ref<Stats>({ total: 0, verde: 0, amarillo: 0, rojo: 0, alertas_sin_leer: 0 })
  const chartData = ref<CarreraData[]>([])
  const loading = ref(false)

  async function fetchStats() {
    loading.value = true
    try {
      const [statsRes, chartsRes] = await Promise.all([
        dashboardApi.getStats(),
        dashboardApi.getCharts(),
      ])
      stats.value = statsRes.data
      chartData.value = chartsRes.data.por_grupo
    } finally {
      loading.value = false
    }
  }

  return { stats, chartData, loading, fetchStats }
})
