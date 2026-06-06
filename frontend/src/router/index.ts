import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/LoginView.vue'),
      meta: { public: true },
    },
    {
      path: '/',
      component: () => import('@/layouts/AppLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'Dashboard',
          component: () => import('@/views/DashboardView.vue'),
        },
        {
          path: 'alumnos',
          name: 'MisAlumnos',
          component: () => import('@/views/MisAlumnosView.vue'),
        },
        {
          path: 'alumnos/:id',
          name: 'StudentDetail',
          component: () => import('@/views/StudentDetailView.vue'),
        },
        {
          path: 'alertas',
          name: 'Alertas',
          component: () => import('@/views/AlertasView.vue'),
        },
        {
          path: 'carga',
          name: 'CargaDatos',
          component: () => import('@/views/CargaDatosView.vue'),
        },
        {
          path: 'perfil',
          name: 'Perfil',
          component: () => import('@/views/PerfilView.vue'),
        },
        {
          path: 'configuracion',
          name: 'Configuracion',
          component: () => import('@/views/ConfiguracionView.vue'),
        },
      ],
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

// Navigation guard
router.beforeEach(async (to) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return '/login'
  }
  if (to.meta.public && auth.isAuthenticated) {
    return '/'
  }

  // Load profile once if authenticated but user not loaded
  if (auth.isAuthenticated && !auth.user) {
    await auth.fetchProfile()
  }
})

export default router
