import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/api/auth'
import router from '@/router'

interface User {
  id: number
  nombre: string
  correo: string
  rol: string
  fecha_creacion: string
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('rcm_token'))
  const user = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value)
  const isDocente = computed(() => user.value?.rol === 'docente')
  const isDirectivo = computed(() => user.value?.rol === 'directivo')

  async function login(correo: string, password: string) {
    loading.value = true
    error.value = null
    try {
      const { data } = await authApi.login(correo, password)
      token.value = data.token
      user.value = data.user
      localStorage.setItem('rcm_token', data.token)
      router.push('/')
    } catch (e: any) {
      error.value = e.response?.data?.error ?? 'Error al iniciar sesión'
    } finally {
      loading.value = false
    }
  }

  async function fetchProfile() {
    if (!token.value) return
    try {
      const { data } = await authApi.profile()
      user.value = data
    } catch {
      logout()
    }
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('rcm_token')
    router.push('/login')
  }

  return { token, user, loading, error, isAuthenticated, isDocente, isDirectivo, login, fetchProfile, logout }
})
