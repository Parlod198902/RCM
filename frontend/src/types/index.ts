// ── Maestro (usuario autenticado) ────────────────────────────────
export interface User {
  id: number
  nombre: string
  apellido_paterno: string
  apellido_materno: string | null
  nombre_completo: string
  correo: string
  rol: 'docente' | 'directivo'
  fecha_registro: string
}

// ── Estudiante ────────────────────────────────────────────────────
export interface Student {
  id: number
  nombre: string
  apellido_paterno: string
  apellido_materno: string | null
  nombre_completo: string
  grupo: string
  participacion: number
  nivel_riesgo: 'verde' | 'amarillo' | 'rojo'
  maestro_id: number | null
  fecha_actualizacion: string | null
  historial_participaciones: { valor: number; fecha: string }[]
  total_registros: number
}

// ── Alerta ────────────────────────────────────────────────────────
export interface Alert {
  id: number
  estudiante_id: number
  estudiante_nombre: string | null
  tipo_alerta: 'estudiante' | 'docente'
  mensaje: string
  fecha_envio: string
  estado: 'activa' | 'resuelta' | 'ignorada'
  maestro_id: number
}

// ── Settings ──────────────────────────────────────────────────────
export interface Settings {
  alertas_correo: boolean
  resumen_semanal: boolean
  modo_oscuro: boolean
  umbral_verde: number
  umbral_amarillo: number
}

// ── Dashboard ─────────────────────────────────────────────────────
export interface DashboardStats {
  total: number
  verde: number
  amarillo: number
  rojo: number
  alertas_sin_leer: number
}

export interface GrupoStat {
  grupo: string
  verde: number
  amarillo: number
  rojo: number
}
