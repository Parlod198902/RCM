<template>
  <div class="max-w-2xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-slate-800">Carga de Datos</h1>
      <p class="text-slate-500 text-sm mt-1">
        Sube archivos Excel (.xlsx, .csv) con la actividad de los estudiantes.
      </p>
    </div>

    <!-- Drop zone -->
    <div
      class="bg-white rounded-xl border-2 border-dashed p-12 text-center transition-all cursor-pointer"
      :style="dropStyle"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="onDrop"
      @click="fileInput?.click()">
      <input ref="fileInput" type="file" class="hidden" accept=".xlsx,.xls,.csv" @change="onFileChange" />

      <div v-if="!file">
        <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="text-3xl">📤</span>
        </div>
        <p class="font-semibold text-slate-700 mb-1">Arrastra y suelta tu archivo aquí</p>
        <p class="text-sm text-slate-400 mb-4">o haz clic para buscar en tu computadora</p>
        <span class="text-xs text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
          .xlsx · .xls · .csv · Máx. 10 MB
        </span>
      </div>

      <div v-else>
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="text-3xl">📄</span>
        </div>
        <p class="font-semibold text-slate-800">{{ file.name }}</p>
        <p class="text-sm text-slate-500 mt-1">{{ (file.size / 1024 / 1024).toFixed(2) }} MB</p>
      </div>
    </div>

    <!-- Preview -->
    <div v-if="preview.length > 0" class="mt-6">
      <h2 class="font-semibold text-slate-700 mb-3">Vista previa (primeras 5 filas)</h2>
      <div class="bg-white rounded-xl border border-slate-200 overflow-x-auto">
        <table class="w-full text-xs">
          <thead class="bg-slate-50 border-b border-slate-200">
            <tr>
              <th v-for="col in previewCols" :key="col"
                class="px-3 py-2 text-left font-semibold text-slate-600 capitalize">{{ col }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="(row, i) in preview" :key="i">
              <td v-for="col in previewCols" :key="col" class="px-3 py-2 text-slate-700">
                {{ row[col] }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Result -->
    <div v-if="result" class="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
      <p class="font-semibold text-green-800 mb-1">✅ Procesamiento completado</p>
      <p class="text-sm text-green-700">
        {{ result.procesados }} registros · {{ result.errores }} errores · {{ result.alertas }} alertas generadas
      </p>
    </div>

    <div v-if="uploadError" class="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
      <p class="font-semibold text-red-800 mb-1">Error al procesar</p>
      <p class="text-sm text-red-700">{{ uploadError }}</p>
    </div>

    <!-- Actions -->
    <div v-if="file" class="flex gap-3 mt-6">
      <button @click="reset"
        class="flex-1 px-4 py-2 border border-slate-300 bg-white text-slate-700 rounded-lg text-sm hover:bg-slate-50 transition-colors">
        Cancelar
      </button>
      <button @click="processFile" :disabled="uploading"
        class="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-white rounded-lg text-sm transition-colors disabled:opacity-50"
        style="background:#1A365D">
        <span v-if="uploading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
        {{ uploading ? 'Procesando…' : 'Procesar Datos' }}
      </button>
    </div>

    <!-- Format guide -->
    <div class="mt-8 bg-white rounded-xl border border-slate-200 p-5">
      <h3 class="font-semibold text-slate-700 mb-3">Formato esperado del archivo</h3>
      <div class="overflow-x-auto">
        <table class="w-full text-xs">
          <thead class="bg-slate-50">
            <tr>
              <th v-for="col in ['nombre','apellido_paterno','apellido_materno','grupo','participacion','rendimiento']"
                :key="col" class="px-3 py-2 text-left font-semibold text-slate-600 border border-slate-200">
                {{ col }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr class="text-slate-500">
              <td class="px-3 py-2 border border-slate-200">Ana</td>
              <td class="px-3 py-2 border border-slate-200">Silva</td>
              <td class="px-3 py-2 border border-slate-200">Ramos</td>
              <td class="px-3 py-2 border border-slate-200">6A</td>
              <td class="px-3 py-2 border border-slate-200">95</td>
              <td class="px-3 py-2 border border-slate-200">92</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { uploadApi } from '@/api/upload'

const fileInput = ref<HTMLInputElement | null>(null)
const file = ref<File | null>(null)
const isDragging = ref(false)
const preview = ref<Record<string, unknown>[]>([])
const uploading = ref(false)
const result = ref<{ procesados: number; errores: number; alertas: number } | null>(null)
const uploadError = ref<string | null>(null)

const dropStyle = computed(() => {
  if (file.value) return 'border-color:#22C55E; background:#f0fdf4'
  if (isDragging.value) return 'border-color:#3b82f6; background:#eff6ff'
  return 'border-color:#cbd5e1; background:#f8fafc'
})

const previewCols = computed(() =>
  preview.value.length > 0 ? Object.keys(preview.value[0]) : []
)

function onDrop(e: DragEvent) {
  isDragging.value = false
  const f = e.dataTransfer?.files[0]
  if (f) setFile(f)
}

function onFileChange(e: Event) {
  const f = (e.target as HTMLInputElement).files?.[0]
  if (f) setFile(f)
}

async function setFile(f: File) {
  file.value = f
  result.value = null
  uploadError.value = null
  preview.value = []
  try {
    const { data } = await uploadApi.previewExcel(f)
    preview.value = data.preview
  } catch { /* preview opcional */ }
}

async function processFile() {
  if (!file.value) return
  uploading.value = true
  result.value = null
  uploadError.value = null
  try {
    const { data } = await uploadApi.uploadExcel(file.value)
    result.value = data
    file.value = null
    preview.value = []
  } catch (e: any) {
    uploadError.value = e.response?.data?.error ?? 'Error al procesar el archivo'
  } finally {
    uploading.value = false
  }
}

function reset() {
  file.value = null
  preview.value = []
  result.value = null
  uploadError.value = null
  if (fileInput.value) fileInput.value.value = ''
}
</script>
