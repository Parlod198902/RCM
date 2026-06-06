import { defineStore } from 'pinia'
import { ref } from 'vue'
import { studentsApi } from '@/api/students'

export interface Student {
  id: number
  matricula: string
  nombre: string
  carrera: string
  grupo: string
  participacion: number
  rendimiento: number
  nivel_riesgo: 'verde' | 'amarillo' | 'rojo'
  docente_id: number | null
  fecha_actualizacion: string
}

export const useStudentsStore = defineStore('students', () => {
  const students = ref<Student[]>([])
  const selected = ref<Student | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchStudents(params?: Record<string, string>) {
    loading.value = true
    error.value = null
    try {
      const { data } = await studentsApi.getAll(params)
      students.value = data
    } catch (e: any) {
      error.value = e.response?.data?.error ?? 'Error cargando estudiantes'
    } finally {
      loading.value = false
    }
  }

  async function fetchById(id: number) {
    try {
      const { data } = await studentsApi.getById(id)
      selected.value = data
    } catch {
      selected.value = null
    }
  }

  async function deleteStudent(id: number) {
    await studentsApi.delete(id)
    students.value = students.value.filter((s) => s.id !== id)
  }

  function clearSelected() {
    selected.value = null
  }

  return { students, selected, loading, error, fetchStudents, fetchById, deleteStudent, clearSelected }
})
