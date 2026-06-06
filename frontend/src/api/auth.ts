import api from './axios'

export const authApi = {
  login: (correo: string, password: string) =>
    api.post('/auth/login', { correo, password }),

  register: (nombre: string, correo: string, password: string, rol = 'docente') =>
    api.post('/auth/register', { nombre, correo, password, rol }),

  profile: () => api.get('/auth/profile'),
}
