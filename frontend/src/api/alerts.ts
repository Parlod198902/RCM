import api from './axios'

export const alertsApi = {
  getAll: () => api.get('/alerts/'),
  create: (data: Record<string, unknown>) => api.post('/alerts/', data),
  markAllRead: () => api.put('/alerts/read'),
  markOneRead: (id: number) => api.put(`/alerts/${id}/read`),
}
