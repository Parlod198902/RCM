import { defineStore } from 'pinia'
import { ref } from 'vue'
import { studentsApi } from '@/api/students'
import type { Student } from '@/types'

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
