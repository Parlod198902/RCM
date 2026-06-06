<template>
  <div>
    <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-slate-800">Notificaciones y Alertas</h1>
        <p class="text-slate-500 text-sm mt-1">
          {{ unread }} alerta{{ unread !== 1 ? 's' : '' }} activa{{ unread !== 1 ? 's' : '' }}
        </p>
      </div>
      <button v-if="unread > 0" @click="alertsStore.markAllRead()"
        class="flex items-center gap-2 px-4 py-2 border border-slate-300 bg-white text-slate-700 rounded-lg text-sm hover:bg-slate-50 transition-colors">
        ✓ Marcar todas como leídas
      </button>
    </div>

    <!-- Tabs -->
    <div class="flex gap-1 mb-6 bg-slate-100 p-1 rounded-lg w-fit">
      <button v-for="tab in tabs" :key="tab.key" @click="activeTab = tab.key"
        :class="['px-4 py-1.5 rounded-md text-sm font-medium transition-colors',
          activeTab === tab.key ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700']">
        {{ tab.label }}
        <span v-if="tab.key === 'activa' && unread > 0"
          class="ml-1.5 px-1.5 py-0.5 bg-red-500 text-white text-[10px] rounded-full">
          {{ unread }}
        </span>
      </button>
    </div>

    <!-- Empty -->
    <div v-if="filtered.length === 0" class="bg-white rounded-xl border border-slate-200 p-16 text-center">
      <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <span class="text-3xl">✓</span>
      </div>
      <p class="text-slate-500">No hay alertas en esta categoría</p>
    </div>

    <!-- List -->
    <div v-else class="space-y-3">
      <div v-for="alert in filtered" :key="alert.id"
        class="bg-white rounded-xl border border-slate-200 shadow-sm p-4"
        :style="borderStyle(alert.tipo_alerta)">
        <div class="flex items-start gap-3">
          <!-- Icon -->
          <div class="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
            :style="iconBg(alert.tipo_alerta)">
            <span class="text-sm">{{ alert.tipo_alerta === 'estudiante' ? '⚠️' : 'ℹ️' }}</span>
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <div class="flex flex-wrap items-center gap-2 mb-1">
              <span class="font-semibold text-sm text-slate-800">{{ alert.estudiante_nombre }}</span>
              <span class="text-xs px-2 py-0.5 rounded-full font-medium"
                :style="badgeStyle(alert.tipo_alerta)">
                {{ alert.tipo_alerta === 'estudiante' ? 'Estudiante' : 'Docente' }}
              </span>
              <span v-if="alert.estado === 'activa'"
                class="text-xs px-2 py-0.5 rounded-full font-medium bg-blue-100 text-blue-700">
                Nueva
              </span>
            </div>
            <p class="text-sm text-slate-600 leading-relaxed">{{ alert.mensaje }}</p>
            <div class="flex items-center gap-4 mt-2">
              <span class="text-xs text-slate-400">{{ formatDate(alert.fecha_envio) }}</span>
              <RouterLink :to="`/alumnos/${alert.estudiante_id}`"
                class="text-xs text-blue-600 hover:underline font-medium">
                Ver perfil →
              </RouterLink>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-1 shrink-0">
            <button v-if="alert.estado === 'activa'" @click="alertsStore.markOneRead(alert.id)"
              class="p-1.5 rounded-lg text-slate-400 hover:text-green-600 hover:bg-green-50 transition-colors"
              title="Marcar como leída">✓</button>
            <button @click="alertsStore.dismiss(alert.id)"
              class="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
              title="Descartar">✕</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useAlertsStore } from '@/stores/alerts'

const alertsStore = useAlertsStore()
const activeTab = ref('activa')

const tabs = [
  { key: 'activa',  label: 'Activas' },
  { key: 'todas',   label: 'Todas' },
]

const unread = computed(() =>
  alertsStore.alerts.filter((a: any) => a.estado === 'activa').length
)

const filtered = computed(() => {
  if (activeTab.value === 'activa')
    return alertsStore.alerts.filter((a: any) => a.estado === 'activa')
  return alertsStore.alerts
})

function borderStyle(tipo: string) {
  const color = tipo === 'estudiante' ? '#EF4444' : '#3b82f6'
  return `border-left: 4px solid ${color}`
}
function iconBg(tipo: string) {
  return tipo === 'estudiante' ? 'background:#fee2e2' : 'background:#dbeafe'
}
function badgeStyle(tipo: string) {
  return tipo === 'estudiante'
    ? 'background:#fee2e2; color:#991b1b'
    : 'background:#dbeafe; color:#1e40af'
}
function formatDate(iso: string) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('es-MX', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

onMounted(() => alertsStore.fetchAlerts())
</script>
