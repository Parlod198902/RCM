import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { alertsApi } from '@/api/alerts'
import type { Alert } from '@/types'

export const useAlertsStore = defineStore('alerts', () => {
  const alerts = ref<Alert[]>([])
  const loading = ref(false)

  const unreadCount = computed(() =>
    alerts.value.filter((a) => a.estado === 'activa').length
  )

  async function fetchAlerts() {
    loading.value = true
    try {
      const { data } = await alertsApi.getAll()
      alerts.value = data
    } finally {
      loading.value = false
    }
  }

  async function markAllRead() {
    await alertsApi.markAllRead()
    alerts.value = alerts.value.map((a) => ({ ...a, estado: 'resuelta' as const }))
  }

  async function markOneRead(id: number) {
    await alertsApi.markOneRead(id)
    const alert = alerts.value.find((a) => a.id === id)
    if (alert) alert.estado = 'resuelta'
  }

  function dismiss(id: number) {
    alerts.value = alerts.value.filter((a) => a.id !== id)
  }

  function addAlert(alert: Alert) {
    alerts.value.unshift(alert)
  }

  return { alerts, loading, unreadCount, fetchAlerts, markAllRead, markOneRead, dismiss, addAlert }
})
