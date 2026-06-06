# 🎓 RCM — Reporteador de Control y Monitoreo Académico

<div align="center">

![Vue](https://img.shields.io/badge/Vue.js-3.4-brightgreen?logo=vue.js)
![Flask](https://img.shields.io/badge/Flask-3.1-black?logo=flask)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-blue?logo=postgresql)
![Python](https://img.shields.io/badge/Python-3.14-blue?logo=python)
![License](https://img.shields.io/badge/License-MIT-purple)
![Status](https://img.shields.io/badge/Status-En%20Desarrollo-yellow)

**Sistema web de detección temprana de estudiantes en riesgo académico**
Combina análisis de datos desde Excel con semaforización automática y alertas en tiempo real

</div>

---

## 📋 Descripción

RCM es una aplicación web full-stack desarrollada para el **Tecnológico Nacional de México (TECNM)** que permite a docentes y directivos detectar de forma temprana a estudiantes con riesgo de abandono escolar.

El sistema analiza datos de participación y rendimiento cargados desde archivos Excel, clasifica automáticamente a los alumnos en niveles de riesgo (verde / amarillo / rojo) y genera alertas para que los maestros puedan intervenir a tiempo.

La interfaz está diseñada con un estilo **fintech/dashboard institucional** con soporte completo de modo oscuro y claro.

---

## 🎯 Características principales

- **Carga de datos desde Excel** (.xlsx, .csv) con vista previa antes de procesar
- **Semaforización automática** por niveles de riesgo configurable
- **Dashboard institucional** con KPIs y gráficas por grupo
- **Historial de participaciones** — cada carga crea un nuevo registro con timestamp
- **Sistema de alertas** en tiempo real vía Flask-SocketIO
- **Notificaciones por correo** integradas con Resend API
- **Exportación de reportes** en Excel y PDF
- **Modo oscuro / claro** con variables CSS
- **Arquitectura limpia** con Repository Pattern, Services Layer y DTOs
- **Base de datos en la nube** con Supabase (PostgreSQL)

---

## 🧱 Stack Tecnológico

### Frontend

| Tecnología | Versión | Uso |
|-----------|---------|-----|
| Vue.js | 3.4 | Framework principal |
| Vite | 5.4 | Bundler |
| Pinia | 2.1 | Gestión de estado |
| Vue Router | 4.3 | Navegación SPA |
| Axios | 1.6 | Cliente HTTP |
| Chart.js + vue-chartjs | 4.4 | Gráficas (Doughnut, Bar, Line) |
| Tailwind CSS | 3.4 | Estilos utilitarios |
| Socket.IO Client | 4.7 | Tiempo real |

### Backend

| Tecnología | Versión | Uso |
|-----------|---------|-----|
| Python | 3.14 | Lenguaje base |
| Flask | 3.1 | Framework API REST |
| Flask-SQLAlchemy | 3.1 | ORM |
| Flask-JWT-Extended | 4.7 | Autenticación JWT |
| Flask-SocketIO | 5.5 | WebSockets |
| Flask-CORS | 5.0 | Control de origen |
| Pandas | 3.0 | Procesamiento de Excel |
| OpenPyXL | 3.1 | Generación de Excel |
| WeasyPrint | — | Generación de PDF |
| Resend | 2.10 | Envío de correos |
| psycopg (v3) | 3.2 | Driver PostgreSQL |

### Base de datos

| Tecnología | Uso |
|-----------|-----|
| PostgreSQL (Supabase) | Base de datos principal en la nube |
| Flask-Migrate | Migraciones de esquema |

---

## 🗂 Estructura del proyecto

```
RCM/
├── backend/
│   ├── app/
│   │   ├── __init__.py              # Factory de la app Flask
│   │   ├── config/
│   │   │   └── settings.py          # Configuración por entorno
│   │   ├── models/
│   │   │   ├── user.py              # Modelo Maestro
│   │   │   ├── estudiante.py        # Modelo Estudiante
│   │   │   ├── participacion.py     # Historial de participaciones
│   │   │   ├── actividad.py         # Catálogo de actividades
│   │   │   ├── alerta.py            # Alertas de riesgo
│   │   │   ├── plan_apoyo.py        # Planes de intervención
│   │   │   ├── desempeno_docente.py # Métricas del maestro
│   │   │   ├── reporte.py           # Reportes y archivos importados
│   │   │   └── settings.py          # Preferencias por usuario
│   │   ├── repositories/            # Repository Pattern
│   │   │   ├── base_repository.py
│   │   │   ├── user_repository.py
│   │   │   ├── estudiante_repository.py
│   │   │   └── alerta_repository.py
│   │   ├── routes/                  # API REST
│   │   │   ├── auth.py              # POST /login, /register, GET /profile
│   │   │   ├── students.py          # CRUD /students
│   │   │   ├── alerts.py            # GET/PUT /alerts
│   │   │   ├── dashboard.py         # GET /dashboard/stats, /charts
│   │   │   ├── reports.py           # GET /reports/excel, /pdf
│   │   │   ├── upload.py            # POST /upload/excel, /preview
│   │   │   └── settings.py          # GET/PUT /settings
│   │   ├── services/                # Lógica de negocio
│   │   │   ├── auth_service.py
│   │   │   ├── excel_service.py     # Procesamiento de archivos
│   │   │   ├── notification_service.py  # Resend API
│   │   │   └── report_service.py    # Generación Excel/PDF
│   │   └── sockets/
│   │       └── events.py            # Eventos SocketIO
│   ├── run.py                       # Entry point
│   ├── seed.py                      # Datos de demo
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── api/                     # Clientes Axios por recurso
│   │   │   ├── auth.ts
│   │   │   ├── students.ts
│   │   │   ├── alerts.ts
│   │   │   ├── dashboard.ts
│   │   │   ├── upload.ts
│   │   │   ├── reports.ts
│   │   │   └── settings.ts
│   │   ├── stores/                  # Pinia stores
│   │   │   ├── auth.ts
│   │   │   ├── students.ts
│   │   │   ├── alerts.ts
│   │   │   ├── dashboard.ts
│   │   │   └── settings.ts
│   │   ├── layouts/
│   │   │   └── AppLayout.vue        # Sidebar + Topbar + RouterView
│   │   ├── views/
│   │   │   ├── LoginView.vue
│   │   │   ├── DashboardView.vue
│   │   │   ├── MisAlumnosView.vue
│   │   │   ├── AlertasView.vue
│   │   │   ├── CargaDatosView.vue
│   │   │   ├── PerfilView.vue
│   │   │   ├── ConfiguracionView.vue
│   │   │   └── StudentDetailView.vue
│   │   ├── components/
│   │   │   ├── StudentDrawer.vue    # Panel lateral de detalle
│   │   │   ├── RiskBadge.vue        # Badge verde/amarillo/rojo
│   │   │   ├── ProgressBar.vue      # Barra de progreso
│   │   │   └── ToggleRow.vue        # Toggle con descripción
│   │   ├── router/index.ts          # Vue Router con guards
│   │   ├── services/socket.ts       # Cliente Socket.IO
│   │   └── assets/main.css          # Tailwind + variables CSS dark/light
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── package.json
│
├── docker-compose.yml
└── README.md
```

---

## 🚦 Sistema de Semaforización

El motor de clasificación automática evalúa el promedio de participación y rendimiento:

| Color | Condición | Significado |
|-------|-----------|-------------|
| 🟢 **Verde** | Promedio ≥ 80% | Sin Riesgo |
| 🟡 **Amarillo** | Promedio entre 60% y 79% | Riesgo Medio |
| 🔴 **Rojo** | Promedio < 60% | Riesgo Crítico |

> Los umbrales son **configurables** desde la pantalla de Configuración por cada maestro.

---

## 🗄 Modelo de Datos

```
maestros ──────────────────────────────────────────────────┐
  id, nombre, apellido_paterno, apellido_materno            │
  correo (UNIQUE), contrasena_hash                          │
  rol: ENUM(docente, directivo)                             │
  fecha_registro                                            │
      │                                                     │
      ├──< estudiantes                                      │
      │       id, nombre, apellido_paterno, apellido_materno│
      │       grupo, nivel_riesgo: ENUM(verde,amarillo,rojo)│
      │       maestro_id FK → maestros.id                   │
      │           │                                         │
      │           ├──< participaciones                      │
      │           │       id, valor(0-100), fecha_calculo   │
      │           │       estudiante_id FK                  │
      │           │                                         │
      │           ├──< c_actividades                        │
      │           │       id, nombre, tipo_actividad        │
      │           │       ENUM(entrega,asistencia,interaccion)
      │           │                                         │
      │           ├──< alertas ──────────────────────────── ┤
      │           │       id, tipo_alerta, mensaje           │
      │           │       estado: ENUM(activa,resuelta)     │
      │           │       estudiante_id FK, maestro_id FK   │
      │           │                                         │
      │           └──< planes_apoyo                         │
      │                   id, orientacion_academica         │
      │                   canalizacion_soporte              │
      │                   maestro_id FK                     │
      │                                                     │
      ├──< desempeno_docente                                 │
      │       maestro_id FK (UNIQUE)                        │
      │       revision_tareas_count, retroalimentacion_count│
      │                                                     │
      └──< user_settings                                    │
              maestro_id FK (UNIQUE)                        │
              alertas_correo, resumen_semanal, modo_oscuro  │
              umbral_verde, umbral_amarillo                  │
```

---

## ⚙️ Instalación

### Requisitos previos

- Python **3.10 o superior**
- Node.js **18 o superior**
- Cuenta en [Supabase](https://supabase.com) (gratuita)
- Windows / Linux / macOS

---

### Paso 1 — Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/RCM.git
cd RCM
```

### Paso 2 — Configurar el Backend

```bash
cd backend

# Crear entorno virtual
python -m venv venv

# Activar (Windows)
.\venv\Scripts\Activate.ps1

# Activar (Linux / macOS)
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt
```

### Paso 3 — Variables de entorno

Copia el archivo de ejemplo y edítalo:

```bash
copy .env.example .env
```

Edita `.env` con tus credenciales de Supabase:

```env
FLASK_ENV=development
SECRET_KEY=tu-clave-secreta
JWT_SECRET_KEY=tu-clave-jwt

# Supabase → Settings → Database → Connection string → URI
DATABASE_URL=postgresql+psycopg://postgres.[ref]:[password]@aws-0-us-east-1.pooler.supabase.com:5432/postgres

# Resend (opcional para correos)
RESEND_API_KEY=re_xxxxxxxxxx
RESEND_FROM_EMAIL=noreply@tuescuela.edu

FRONTEND_URL=http://localhost:5173
```

### Paso 4 — Crear tablas y cargar datos de demo

```bash
python -c "from app import create_app, db; from app.models import *; app = create_app(); app.app_context().push(); db.create_all(); print('OK')"
python seed.py
```

### Paso 5 — Configurar el Frontend

```bash
cd ../frontend
npm install
```

---

## 🚀 Ejecución

Necesitas **dos terminales abiertas al mismo tiempo**:

### Terminal 1 — Backend

```bash
cd backend
.\venv\Scripts\Activate.ps1   # Windows
python run.py
```

> Escucha en `http://localhost:5001`

### Terminal 2 — Frontend

```bash
cd frontend
npm run dev
```

> Escucha en `http://localhost:5173`

### Abre el navegador en:

```
http://localhost:5173](https://rcm-weld.vercel.app/login
```

---



---

## 📊 Formato del Excel para Carga de Datos

El sistema acepta archivos `.xlsx`, `.xls` y `.csv` con las siguientes columnas:

| Columna | Requerida | Descripción |
|---------|-----------|-------------|
| `nombre` | ✅ | Nombre del estudiante |
| `apellido_paterno` | — | Apellido paterno |
| `apellido_materno` | — | Apellido materno |
| `grupo` | — | Clave del grupo (ej: 6A) |
| `participacion` | ✅ | Porcentaje 0-100 |
| `rendimiento` | — | Porcentaje 0-100 |
| `tipo_actividad` | — | entrega / asistencia / interaccion |
| `actividad` | — | Nombre de la actividad |

> Cada vez que se sube el mismo archivo se **agrega un nuevo registro histórico** con la fecha y hora de la carga — el historial no se sobreescribe.

---

## 🌐 API REST

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/login` | Iniciar sesión → retorna JWT |
| POST | `/api/auth/register` | Registrar maestro |
| GET | `/api/auth/profile` | Perfil del maestro autenticado |
| GET | `/api/students/` | Listar estudiantes (filtros: grupo, nivel_riesgo) |
| GET | `/api/students/:id` | Detalle con historial de participaciones |
| POST | `/api/students/` | Crear estudiante |
| PUT | `/api/students/:id` | Actualizar estudiante |
| DELETE | `/api/students/:id` | Eliminar estudiante |
| GET | `/api/alerts/` | Listar alertas |
| PUT | `/api/alerts/read` | Marcar todas como leídas |
| GET | `/api/dashboard/stats` | KPIs globales |
| GET | `/api/dashboard/charts` | Datos para gráficas |
| GET | `/api/reports/excel` | Descargar reporte Excel |
| GET | `/api/reports/pdf` | Descargar reporte PDF |
| POST | `/api/upload/excel` | Subir y procesar archivo |
| POST | `/api/upload/preview` | Vista previa sin procesar |
| GET | `/api/settings/` | Obtener preferencias |
| PUT | `/api/settings/` | Actualizar preferencias |

---

## 👥 Autores

Proyecto desarrollado para el **Tecnológico Nacional de México (TECNM)**
Materia: Desarrollo de Aplicaciones Web


## 👥 Integrantes del Equipo RCM

| No. | Nombre Completo                 |
| --- | ------------------------------- |
| 1   | **Gamboa Bernal Ivan Alexei**   |
| 2   | Madrigal García Jade            |
| 3   | Domínguez Domínguez Victor Hugo |
| 4   | Balam López Jennifer Vanessa    |
| 5   | Jorge Uriel Ortiz Antonio       |
| 6   | Mariana Hernández               |
| 7   | Gilbert Said Domínguez De La O  |
| 8   | Hernandez Anastacio Yahir       |
| 9   | Florentino Martinez Diego       |
| 10  | Sarmiento-Ramírez Anthony       |
| 11  | Alvarez Castro Logan Daniel     |

---

### 📌 Equipo 2 - RCM

**Sistema Inteligente de Monitoreo y Gestión Académica**

Desarrollado como proyecto académico para la implementación de tecnologías web, análisis de datos y monitoreo inteligente de indicadores académicos.
  

## 📝 Licencia

MIT License — libre para uso académico y educativo.
