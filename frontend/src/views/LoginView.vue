<template>
  <div class="min-h-screen bg-slate-100 flex items-center justify-center p-4">
    <div class="w-full max-w-sm">
      <!-- Logo -->
      <div class="flex flex-col items-center mb-8">
        <div class="w-16 h-16 rounded-2xl bg-brand flex items-center justify-center shadow-lg mb-4">
          <span class="text-white font-bold text-3xl">R</span>
        </div>
        <h1 class="text-2xl font-bold text-slate-800">Iniciar Sesión</h1>
        <p class="text-slate-500 text-sm mt-1">Ingresa al sistema RCM</p>
      </div>

      <!-- Card -->
      <div class="card p-8">
        <form @submit.prevent="handleLogin" novalidate>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">
                Correo Institucional
              </label>
              <input
                v-model="form.correo"
                type="email"
                class="input"
                placeholder="usuario@escuela.edu"
                autocomplete="email"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">
                Contraseña
              </label>
              <div class="relative">
                <input
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  class="input pr-10"
                  placeholder="••••••••"
                  autocomplete="current-password"
                  required
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
                >
                  <EyeIcon v-if="!showPassword" class="w-4 h-4" />
                  <EyeOffIcon v-else class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <!-- Error -->
          <div v-if="auth.error" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-sm text-red-700">{{ auth.error }}</p>
          </div>

          <button
            type="submit"
            class="btn-primary w-full mt-6 justify-center py-2.5"
            :disabled="auth.loading"
          >
            <span v-if="auth.loading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            <span>{{ auth.loading ? 'Ingresando…' : 'Ingresar al Sistema' }}</span>
          </button>
        </form>

        <!-- Demo hint -->
        <div class="mt-6 p-3 bg-slate-50 rounded-lg border border-slate-200">
          <p class="text-xs text-slate-500 font-medium mb-1">Credenciales de demo:</p>
          <p class="text-xs text-slate-600">📧 docente@escuela.edu</p>
          <p class="text-xs text-slate-600">🔑 password123</p>
        </div>
      </div>

      <p class="text-center text-xs text-slate-400 mt-6">
        RCM — Reporteador de Control y Monitoreo
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const EyeIcon = { template: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/></svg>` }
const EyeOffIcon = { template: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"/></svg>` }

const auth = useAuthStore()
const showPassword = ref(false)
const form = ref({ correo: 'docente@escuela.edu', password: 'password123' })

async function handleLogin() {
  await auth.login(form.value.correo, form.value.password)
}
</script>
