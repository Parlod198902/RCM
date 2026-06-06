import { io, Socket } from 'socket.io-client'
import { useAlertsStore } from '@/stores/alerts'
import { useDashboardStore } from '@/stores/dashboard'

let socket: Socket | null = null

export function connectSocket() {
  if (socket?.connected) return

  socket = io('/', { transports: ['websocket', 'polling'] })

  socket.on('connect', () => {
    console.log('[RCM Socket] Conectado:', socket?.id)
    socket?.emit('join', { room: 'general' })
  })

  socket.on('nueva_alerta', (data) => {
    const alertsStore = useAlertsStore()
    alertsStore.addAlert(data)
  })

  socket.on('dashboard_actualizado', () => {
    const dashboardStore = useDashboardStore()
    dashboardStore.fetchStats()
  })

  socket.on('disconnect', () => {
    console.log('[RCM Socket] Desconectado')
  })
}

export function disconnectSocket() {
  socket?.disconnect()
  socket = null
}
