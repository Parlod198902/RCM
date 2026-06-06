<template>
  <div class="max-w-2xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-slate-800">Configuración</h1>
      <p class="text-slate-500 text-sm mt-1">Gestiona tus preferencias de alertas y visualización.</p>
    </div>

    <!-- Toast -->
    <Transition name="fade">
      <div v-if="settingsStore.saved"
        class="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
        <span class="text-green-600">✓</span>
        <p class="text-sm text-green-700 font-medium">Preferencias guardadas correctamente.</p>
      </div>
    </Transition>

    <!-- Notificaciones -->
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-4">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">🔔</div>
        <h2 class="font-semibold text-slate-800">Notificaciones y Alertas</h2>
      </div>
      <hr class="border-slate-100 mb-4" />
      <div class="space-y-5">
        <ToggleRow
          label="Alertas por Correo Electrónico"
          description="Recibe notificaciones cuando un alumno pase a estado rojo."
          :value="form.alertas_correo"
          @update="form.alertas_correo = $event; save()" />
        <ToggleRow
          label="Resumen Semanal"
          description="Recibe un reporte semanal del estatus de tus grupos."
          :value="form.resumen_semanal"
          @update="form.resumen_semanal = $event; save()" />
      </div>
    </div>

    <!-- Umbrales -->
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-4">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">⚙️</div>
        <h2 class="font-semibold text-slate-800">Umbrales de Riesgo</h2>
      </div>
      <hr class="border-slate-100 mb-4" />
      <div class="space-y-5">
        <div>
          <div class="flex justify-between mb-1">
            <label class="text-sm font-medium text-slate-700">Umbral Verde (Sin Riesgo)</label>
            <span class="text-sm font-bold" style="color:#22C55E">≥ {{ form.umbral_verde }}%</span>
          </div>
          <input type="range" min="50" max="95" step="5" v-model.number="form.umbral_verde"
            class="w-full" @change="save" />
          <p class="text-xs text-slate-400 mt-1">Promedio ≥ {{ form.umbral_verde }}% → Sin Riesgo</p>
        </div>
        <div>
          <div class="flex justify-between mb-1">
            <label class="text-sm font-medium text-slate-700">Umbral Amarillo (Riesgo Medio)</label>
            <span class="text-sm font-bold" style="color:#EAB308">≥ {{ form.umbral_amarillo }}%</span>
          </div>
          <input type="range" min="30" max="79" step="5" v-model.number="form.umbral_amarillo"
            class="w-full" @change="save" />
          <p class="text-xs text-slate-400 mt-1">Entre {{ form.umbral_amarillo }}% y {{ form.umbral_verde - 1 }}% → Riesgo Medio</p>
        </div>
        <div class="p-3 bg-red-50 rounded-lg border border-red-100">
          <p class="text-xs text-red-700">
            <strong>Riesgo Crítico:</strong> Promedio &lt; {{ form.umbral_amarillo }}% → Rojo
          </p>
        </div>
      </div>
    </div>

    <!-- Apariencia -->
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">🎨</div>
        <h2 class="font-semibold text-slate-800">Apariencia</h2>
      </div>
      <hr class="border-slate-100 mb-4" />
      <ToggleRow
        label="Modo Oscuro"
        description="Cambia el tema visual de la interfaz."
        :value="form.modo_oscuro"
        @update="form.modo_oscuro = $event; save()" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import ToggleRow from '@/components/ToggleRow.vue'

const settingsStore = useSettingsStore()
const form = ref({ ...settingsStore.settings })

async function save() {
  await settingsStore.updateSettings({ ...form.value })
}

onMounted(async () => {
  await settingsStore.fetchSettings()
  form.value = { ...settingsStore.settings }
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
