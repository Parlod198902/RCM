import api from './axios'

export const studentsApi = {
  getAll: (params?: Record<string, string>) =>
    api.get('/students/', { params }),

  getById: (id: number) => api.get(`/students/${id}`),

  create: (data: Record<string, unknown>) => api.post('/students/', data),

  update: (id: number, data: Record<string, unknown>) =>
    api.put(`/students/${id}`, data),

  delete: (id: number) => api.delete(`/students/${id}`),
}
