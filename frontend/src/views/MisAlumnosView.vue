<template>
  <div>
    <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
      <h1 class="text-2xl font-bold text-slate-800">Mis Alumnos</h1>
      <button @click="exportExcel"
        class="flex items-center gap-2 px-4 py-2 text-white text-sm rounded-lg transition-colors"
        style="background:#1A365D">
        ⬇ Generar Reporte Excel
      </button>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap gap-3 mb-4">
      <input v-model="search"
        class="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-800 w-56"
        placeholder="Buscar por nombre…" />
      <select v-model="filterRiesgo"
        class="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-800 w-44">
        <option value="">Todos los niveles</option>
        <option value="verde">Sin Riesgo</option>
        <option value="amarillo">Riesgo Medio</option>
        <option value="rojo">Riesgo Crítico</option>
      </select>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div v-if="students.loading" class="p-12 text-center text-slate-400">
        <div class="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        Cargando estudiantes…
      </div>

      <table v-else class="w-full text-sm">
        <thead class="bg-slate-50 border-b border-slate-200">
          <tr>
            <th class="text-left px-4 py-3 font-semibold text-slate-600">Nombre Completo</th>
            <th class="text-left px-4 py-3 font-semibold text-slate-600 hidden md:table-cell">Grupo</th>
            <th class="text-left px-4 py-3 font-semibold text-slate-600 hidden lg:table-cell">Participación</th>
            <th class="text-left px-4 py-3 font-semibold text-slate-600">Riesgo</th>
            <th class="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="student in filtered" :key="student.id"
            class="hover:bg-slate-50 cursor-pointer transition-colors"
            @click="openDetail(student.id)">
            <td class="px-4 py-3 font-medium text-slate-800">{{ student.nombre_completo }}</td>
            <td class="px-4 py-3 text-slate-600 hidden md:table-cell">{{ student.grupo }}</td>
            <td class="px-4 py-3 hidden lg:table-cell">
              <div class="flex items-center gap-2">
                <div class="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div class="h-full rounded-full" :style="{ width: student.participacion + '%', background: riskColor(student.nivel_riesgo) }"></div>
                </div>
                <span class="text-xs font-medium text-slate-600 w-8 text-right">{{ student.participacion }}%</span>
              </div>
            </td>
            <td class="px-4 py-3">
              <span :style="riskBadgeStyle(student.nivel_riesgo)"
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold">
                {{ riskLabel(student.nivel_riesgo) }}
              </span>
            </td>
            <td class="px-4 py-3 text-right">
              <button @click.stop="openDetail(student.id)"
                class="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                👁
              </button>
            </td>
          </tr>
          <tr v-if="filtered.length === 0">
            <td colspan="5" class="px-4 py-12 text-center text-slate-400">
              No se encontraron estudiantes
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Student Drawer -->
    <StudentDrawer :student-id="selectedId" @close="selectedId = null" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useStudentsStore } from '@/stores/students'
import { reportsApi, triggerDownload } from '@/api/reports'
import StudentDrawer from '@/components/StudentDrawer.vue'

const students = useStudentsStore()
const search = ref('')
const filterRiesgo = ref('')
const selectedId = ref<number | null>(null)

const filtered = computed(() => {
  let list = students.students
  if (search.value) {
    const q = search.value.toLowerCase()
    list = list.filter((s: any) =>
      (s.nombre_completo || s.nombre).toLowerCase().includes(q)
    )
  }
  if (filterRiesgo.value) {
    list = list.filter((s: any) => s.nivel_riesgo === filterRiesgo.value)
  }
  return list
})

function riskColor(nivel: string) {
  return nivel === 'verde' ? '#22C55E' : nivel === 'amarillo' ? '#EAB308' : '#EF4444'
}

function riskLabel(nivel: string) {
  return nivel === 'verde' ? 'Sin Riesgo' : nivel === 'amarillo' ? 'Riesgo Medio' : 'Riesgo Crítico'
}

function riskBadgeStyle(nivel: string) {
  const colors: Record<string, string> = {
    verde:    'background:#dcfce7; color:#166534',
    amarillo: 'background:#fef9c3; color:#854d0e',
    rojo:     'background:#fee2e2; color:#991b1b',
  }
  return colors[nivel] || ''
}

function openDetail(id: number) {
  selectedId.value = id
}

async function exportExcel() {
  try {
    const { data } = await reportsApi.downloadExcel()
    triggerDownload(data, 'mis_alumnos.xlsx')
  } catch (e) {
    console.error(e)
  }
}

onMounted(() => students.fetchStudents())
</script>
