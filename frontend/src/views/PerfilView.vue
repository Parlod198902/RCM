<template>
  <div class="max-w-2xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-slate-800">Mi Perfil</h1>
      <p class="text-slate-500 text-sm mt-1">Información de solo lectura del sistema institucional.</p>
    </div>

    <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
      <div v-if="loading" class="animate-pulse space-y-4">
        <div class="flex items-center gap-4">
          <div class="w-20 h-20 bg-slate-200 rounded-full"></div>
          <div class="space-y-2">
            <div class="h-5 bg-slate-200 rounded w-40"></div>
            <div class="h-4 bg-slate-200 rounded w-24"></div>
          </div>
        </div>
      </div>

      <div v-else-if="auth.user">
        <!-- Avatar + nombre -->
        <div class="flex items-center gap-5 mb-6">
          <div class="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold shrink-0"
            style="background:#1A365D">
            {{ initials }}
          </div>
          <div>
            <h2 class="text-xl font-bold text-slate-800">
              {{ auth.user.nombre_completo ?? auth.user.nombre }}
            </h2>
            <span class="inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-semibold capitalize"
              :style="rolStyle">
              {{ auth.user.rol }}
            </span>
          </div>
        </div>

        <hr class="border-slate-200 mb-6" />

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <p class="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">ID</p>
            <p class="text-slate-800 font-medium">{{ auth.user.id }}</p>
          </div>
          <div>
            <p class="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Correo Institucional</p>
            <p class="text-slate-800 font-medium">{{ auth.user.correo }}</p>
          </div>
          <div>
            <p class="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Apellido Paterno</p>
            <p class="text-slate-800 font-medium">{{ auth.user.apellido_paterno }}</p>
          </div>
          <div>
            <p class="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Apellido Materno</p>
            <p class="text-slate-800 font-medium">{{ auth.user.apellido_materno ?? '—' }}</p>
          </div>
          <div>
            <p class="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Rol en Sistema RCM</p>
            <p class="text-slate-800 font-medium capitalize">{{ auth.user.rol }}</p>
          </div>
          <div>
            <p class="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Miembro desde</p>
            <p class="text-slate-800 font-medium">{{ formatDate(auth.user.fecha_registro) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const loading = ref(false)

const initials = computed(() => {
  const n = auth.user?.nombre ?? ''
  const ap = auth.user?.apellido_paterno ?? ''
  return (n[0] ?? '') + (ap[0] ?? '')
})

const rolStyle = computed(() =>
  auth.user?.rol === 'directivo'
    ? 'background:#f3e8ff; color:#7e22ce'
    : 'background:#dbeafe; color:#1e40af'
)

function formatDate(iso: string) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' })
}

onMounted(async () => {
  if (!auth.user) {
    loading.value = true
    await auth.fetchProfile()
    loading.value = false
  }
})
</script>
