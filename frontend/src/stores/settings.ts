import { defineStore } from 'pinia'
import { ref } from 'vue'
import { settingsApi } from '@/api/settings'

export interface Settings {
  alertas_correo: boolean
  resumen_semanal: boolean
  modo_oscuro: boolean
  umbral_verde: number
  umbral_amarillo: number
}

export const useSettingsStore = defineStore('settings', () => {
  const settings = ref<Settings>({
    alertas_correo: true,
    resumen_semanal: false,
    modo_oscuro: false,
    umbral_verde: 80,
    umbral_amarillo: 60,
  })
  const loading = ref(false)
  const saved = ref(false)

  async function fetchSettings() {
    loading.value = true
    try {
      const { data } = await settingsApi.get()
      settings.value = data
      applyDarkMode(data.modo_oscuro)
    } finally {
      loading.value = false
    }
  }

  async function updateSettings(patch: Partial<Settings>) {
    loading.value = true
    saved.value = false
    try {
      const { data } = await settingsApi.update(patch as Record<string, unknown>)
      settings.value = data
      applyDarkMode(data.modo_oscuro)
      saved.value = true
      setTimeout(() => (saved.value = false), 3000)
    } finally {
      loading.value = false
    }
  }

  function applyDarkMode(dark: boolean) {
    document.documentElement.classList.toggle('dark', dark)
  }

  return { settings, loading, saved, fetchSettings, updateSettings }
})
