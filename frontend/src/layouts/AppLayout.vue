<template>
  <div class="flex h-screen overflow-hidden" style="background-color:var(--bg-page)">
    <!-- Sidebar -->
    <aside
      :class="[
        'sidebar fixed inset-y-0 left-0 z-40 flex flex-col transition-all duration-300',
        sidebarOpen ? 'w-60' : 'w-0 overflow-hidden sm:w-16'
      ]"
    >
      <!-- Logo -->
      <div class="flex items-center gap-3 px-4 h-16 shrink-0" style="border-bottom:1px solid var(--border)">
        <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style="background:#1A365D">
          <span class="text-white font-bold text-sm">R</span>
        </div>
        <span v-if="sidebarOpen" class="font-bold text-sm whitespace-nowrap" style="color:#1A365D">RCM Institucional</span>
      </div>

      <!-- Nav -->
      <nav class="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        <RouterLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
          :class="isActive(item.to) ? 'nav-link-active' : 'hover:bg-slate-100'"
          :style="!isActive(item.to) ? `color:var(--text-muted)` : ''"
        >
          <component :is="item.icon" class="w-5 h-5 shrink-0" />
          <span v-if="sidebarOpen" class="whitespace-nowrap">{{ item.label }}</span>
        </RouterLink>
      </nav>

      <!-- User footer -->
      <div v-if="sidebarOpen" class="p-4" style="border-top:1px solid var(--border)">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" style="background:#1A365D">
            {{ initials }}
          </div>
          <div class="min-w-0">
            <p class="text-sm font-medium truncate" style="color:var(--text-main)">{{ auth.user?.nombre_completo ?? auth.user?.nombre }}</p>
            <p class="text-xs capitalize" style="color:var(--text-muted)">{{ auth.user?.rol }}</p>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main area -->
    <div :class="['flex flex-col flex-1 min-w-0 transition-all duration-300', sidebarOpen ? 'sm:ml-60' : 'sm:ml-16']">
      <!-- Topbar -->
      <header class="topbar h-16 flex items-center px-4 gap-4 shrink-0 z-30">
        <button @click="sidebarOpen = !sidebarOpen"
          class="p-2 rounded-lg transition-colors hover:bg-slate-100"
          style="color:var(--text-muted)">
          <MenuIcon class="w-5 h-5" />
        </button>

        <span class="font-semibold hidden sm:block" style="color:var(--text-main)">{{ currentPageTitle }}</span>

        <div class="ml-auto flex items-center gap-2">
          <!-- Bell con SVG -->
          <div class="relative">
            <button @click="showNotifications = !showNotifications"
              class="p-2 rounded-lg transition-colors hover:bg-slate-100 relative"
              style="color:var(--text-muted)"
              aria-label="Notificaciones">
              <!-- SVG campana -->
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
              </svg>
              <!-- Badge contador -->
              <span v-if="alertsStore.unreadCount > 0"
                class="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 leading-none">
                {{ alertsStore.unreadCount > 9 ? '9+' : alertsStore.unreadCount }}
              </span>
            </button>

            <!-- Dropdown notificaciones -->
            <div v-if="showNotifications"
              class="card absolute right-0 top-12 w-80 z-50 overflow-hidden shadow-lg">
              <div class="flex items-center justify-between px-4 py-3" style="border-bottom:1px solid var(--border)">
                <span class="font-semibold text-sm" style="color:var(--text-main)">Alertas Tempranas</span>
                <button @click="alertsStore.markAllRead(); showNotifications = false"
                  class="text-xs text-blue-500 hover:underline">Marcar leídas</button>
              </div>
              <div class="max-h-72 overflow-y-auto divide-y" style="border-color:var(--border)">
                <div v-for="alert in recentAlerts" :key="alert.id"
                  class="px-4 py-3 cursor-pointer hover:bg-slate-50 transition-colors"
                  @click="goToAlert(alert)">
                  <div class="flex gap-2">
                    <span :class="alertDot(alert.tipo_alerta)"
                      class="w-2 h-2 rounded-full mt-1.5 shrink-0"></span>
                    <div>
                      <p class="text-xs leading-snug" style="color:var(--text-main)">
                        <strong>{{ alert.estudiante_nombre }}</strong> — {{ alert.mensaje?.slice(0, 65) }}…
                      </p>
                      <p class="text-[11px] mt-0.5" style="color:var(--text-muted)">
                        {{ formatDate(alert.fecha_envio) }}
                      </p>
                    </div>
                  </div>
                </div>
                <div v-if="recentAlerts.length === 0" class="px-4 py-6 text-center text-sm" style="color:var(--text-muted)">
                  Sin alertas nuevas
                </div>
              </div>
              <div class="px-4 py-2" style="border-top:1px solid var(--border)">
                <RouterLink to="/alertas" @click="showNotifications = false"
                  class="text-xs text-blue-500 hover:underline">Ver todas →</RouterLink>
              </div>
            </div>
          </div>

          <!-- User menu -->
          <div class="relative">
            <button @click="showUserMenu = !showUserMenu"
              class="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-100 transition-colors">
              <div class="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style="background:#1A365D">
                {{ initials }}
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="color:var(--text-muted)">
                <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5"/>
              </svg>
            </button>

            <div v-if="showUserMenu"
              class="card absolute right-0 top-12 w-52 z-50 py-1 shadow-lg overflow-hidden">
              <div class="px-4 py-2" style="border-bottom:1px solid var(--border)">
                <p class="text-sm font-semibold" style="color:var(--text-main)">{{ auth.user?.nombre_completo ?? auth.user?.nombre }}</p>
                <p class="text-xs capitalize" style="color:var(--text-muted)">{{ auth.user?.rol }}</p>
              </div>
              <RouterLink to="/perfil" @click="showUserMenu = false"
                class="flex items-center gap-2 px-4 py-2 text-sm hover:bg-slate-50 transition-colors"
                style="color:var(--text-main)">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"/></svg>
                Mi Perfil
              </RouterLink>
              <RouterLink to="/configuracion" @click="showUserMenu = false"
                class="flex items-center gap-2 px-4 py-2 text-sm hover:bg-slate-50 transition-colors"
                style="color:var(--text-main)">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/></svg>
                Configuración
              </RouterLink>
              <hr style="border-color:var(--border); margin:4px 0" />
              <button @click="auth.logout()"
                class="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"/></svg>
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Page content -->
      <main class="flex-1 overflow-y-auto p-6" style="background-color:var(--bg-page)">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAlertsStore } from '@/stores/alerts'
import router from '@/router'

const MenuIcon = { template: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/></svg>` }
const BellIcon = { template: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"/></svg>` }
const UserIcon = { template: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"/></svg>` }
const CogIcon = { template: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/></svg>` }
const LogOutIcon = { template: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"/></svg>` }
const ChevronDownIcon = { template: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5"/></svg>` }
const DashboardIcon = { template: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"/></svg>` }
const StudentsIcon = { template: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"/></svg>` }
const AlertIcon = { template: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"/></svg>` }
const UploadIcon = { template: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"/></svg>` }

const auth = useAuthStore()
const alertsStore = useAlertsStore()
const route = useRoute()

const sidebarOpen = ref(true)
const showNotifications = ref(false)
const showUserMenu = ref(false)

const navItems = [
  { to: '/',            label: 'Dashboard',     icon: DashboardIcon },
  { to: '/alumnos',     label: 'Mis Alumnos',   icon: StudentsIcon },
  { to: '/alertas',     label: 'Alertas',       icon: AlertIcon },
  { to: '/carga',       label: 'Carga de Datos',icon: UploadIcon },
]

const pageTitles: Record<string, string> = {
  '/': 'Dashboard Institucional',
  '/alumnos': 'Mis Alumnos',
  '/alertas': 'Alertas',
  '/carga': 'Carga de Datos',
  '/perfil': 'Mi Perfil',
  '/configuracion': 'Configuración',
}

const currentPageTitle = computed(() => pageTitles[route.path] ?? 'RCM')
const initials = computed(() => {
  const name = auth.user?.nombre ?? ''
  return name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
})
const recentAlerts = computed(() =>
  alertsStore.alerts.filter((a: any) => a.estado === 'activa').slice(0, 5)
)

function isActive(path: string) {
  return path === '/' ? route.path === '/' : route.path.startsWith(path)
}
function alertDot(tipo: string) {
  return tipo === 'error' ? 'bg-red-500' : tipo === 'warning' ? 'bg-yellow-400' : 'bg-blue-400'
}
function formatDate(iso: string) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
}
function goToAlert(alert: any) {
  showNotifications.value = false
  router.push(`/alumnos/${alert.estudiante_id}`)
}

onMounted(() => alertsStore.fetchAlerts())
</script>
