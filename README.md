<<<<<<< HEAD
# RCM — Reporteador de Control y Monitoreo

Sistema web para detección temprana de estudiantes en riesgo académico.

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | Vue 3 + Vite + Pinia + Tailwind CSS + Chart.js |
| Backend | Flask + Flask-JWT-Extended + Flask-SocketIO |
| Base de datos | PostgreSQL |
| Notificaciones | Resend API |
| Reportes | OpenPyXL (Excel) + WeasyPrint (PDF) |

## Inicio rápido

### Con Docker (recomendado)

```bash
docker-compose up --build
```

Luego abre http://localhost:5173

### Manual

**Backend**
```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
pip install -r requirements.txt
cp .env.example .env           # edita DATABASE_URL y claves
flask db upgrade
python seed.py                 # carga datos de demo
python run.py
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

## Credenciales de demo

| Rol | Correo | Contraseña |
|-----|--------|-----------|
| Docente | docente@escuela.edu | password123 |
| Directivo | directivo@escuela.edu | password123 |

## Estructura del proyecto

```
RCM/
├── backend/
│   ├── app/
│   │   ├── config/        # Configuración Flask
│   │   ├── models/        # SQLAlchemy models
│   │   ├── repositories/  # Repository pattern
│   │   ├── routes/        # API REST endpoints
│   │   ├── services/      # Lógica de negocio
│   │   └── sockets/       # Flask-SocketIO events
│   ├── run.py
│   └── seed.py
├── frontend/
│   └── src/
│       ├── api/           # Axios clients
│       ├── components/    # Componentes reutilizables
│       ├── layouts/       # AppLayout
│       ├── router/        # Vue Router
│       ├── services/      # Socket.IO client
│       ├── stores/        # Pinia stores
│       └── views/         # Páginas Vue
├── docker-compose.yml
└── README.md
```

## API REST

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | /api/auth/login | Iniciar sesión |
| POST | /api/auth/register | Registrar usuario |
| GET | /api/auth/profile | Perfil del usuario |
| GET | /api/students/ | Listar estudiantes |
| GET | /api/students/:id | Detalle estudiante |
| POST | /api/students/ | Crear estudiante |
| PUT | /api/students/:id | Actualizar estudiante |
| DELETE | /api/students/:id | Eliminar estudiante |
| GET | /api/alerts/ | Listar alertas |
| PUT | /api/alerts/read | Marcar todas leídas |
| GET | /api/dashboard/stats | Estadísticas |
| GET | /api/dashboard/charts | Datos para gráficas |
| GET | /api/reports/excel | Descargar Excel |
| GET | /api/reports/pdf | Descargar PDF |
| POST | /api/upload/excel | Subir archivo |
| POST | /api/upload/preview | Vista previa |
| GET | /api/settings/ | Obtener configuración |
| PUT | /api/settings/ | Actualizar configuración |

## Sistema de semaforización

| Color | Condición |
|-------|-----------|
| 🟢 Verde | Promedio ≥ 80% |
| 🟡 Amarillo | Promedio entre 60% y 79% |
| 🔴 Rojo | Promedio < 60% |

Los umbrales son configurables desde la pantalla de Configuración.
=======
# RCM
Reporteador en tiempo real para ayudar a escuela
>>>>>>> 25f863f5a5a9995311b98bea0a5f7235f53a3b7b
