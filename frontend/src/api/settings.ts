import api from './axios'

export const settingsApi = {
  get: () => api.get('/settings/'),
  update: (data: Record<string, unknown>) => api.put('/settings/', data),
}
