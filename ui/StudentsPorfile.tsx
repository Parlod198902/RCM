import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  Chip,
  Card,
  CardContent,
  LinearProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  Avatar
} from '@mui/material';
import {
  ArrowBack,
  Email,
  Phone,
  CalendarToday,
  TrendingDown,
  CheckCircle,
  Warning
} from '@mui/icons-material';
import { StatusBadge } from './StatusBadge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

const studentDetail = {
  1: {
    nombre: 'Ana Patricia Martínez López',
    matricula: 'A00123456',
    email: 'ana.martinez@estudiante.edu.mx',
    telefono: '+52 81 1234 5678',
    carrera: 'Ingeniería en Sistemas Computacionales',
    grupo: '6A',
    semestre: 6,
    status: 'active' as const,
    participacion: 95,
    promedio: 9.2,
    asistencia: 98
  },
  2: {
    nombre: 'Carlos Eduardo Rodríguez Sánchez',
    matricula: 'A00123457',
    email: 'carlos.rodriguez@estudiante.edu.mx',
    telefono: '+52 81 8765 4321',
    carrera: 'Ingeniería en Sistemas Computacionales',
    grupo: '6A',
    semestre: 6,
    status: 'critical' as const,
    participacion: 45,
    promedio: 6.8,
    asistencia: 65
  }
};

const participationHistory = [
  { semana: 'S1', participacion: 92 },
  { semana: 'S2', participacion: 90 },
  { semana: 'S3', participacion: 88 },
  { semana: 'S4', participacion: 85 },
  { semana: 'S5', participacion: 80 },
  { semana: 'S6', participacion: 72 },
  { semana: 'S7', participacion: 68 },
  { semana: 'S8', participacion: 65 }
];

const tasksCompletion = [
  { materia: 'Programación', completadas: 8, totales: 10 },
  { materia: 'Base de Datos', completadas: 6, totales: 10 },
  { materia: 'Redes', completadas: 9, totales: 10 },
  { materia: 'Algoritmos', completadas: 5, totales: 10 }
];

const supportPlan = [
  {
    tipo: 'Asesoría Académica',
    descripcion: 'Sesiones de tutoría en materias con bajo rendimiento',
    status: 'pending',
    prioridad: 'alta'
  },
  {
    tipo: 'Seguimiento Psicopedagógico',
    descripcion: 'Evaluación de factores externos que afectan el rendimiento',
    status: 'in_progress',
    prioridad: 'media'
  },
  {
    tipo: 'Plan de Recuperación',
    descripcion: 'Actividades complementarias para mejorar calificaciones',
    status: 'pending',
    prioridad: 'alta'
  }
];

export function StudentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const student = studentDetail[id as keyof typeof studentDetail] || studentDetail[1];

  return (
    <Box>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/docente/alumnos')}
        sx={{ mb: 3 }}
      >
        Volver a Mis Alumnos
      </Button>

      {/* Student Header */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
          <Avatar
            sx={{
              width: 100,
              height: 100,
              bgcolor: student.status === 'active' ? '#4caf50' :
                       student.status === 'warning' ? '#ff9800' : '#f44336',
              fontSize: 40
            }}
          >
            {student.nombre.split(' ').map(n => n[0]).join('').substring(0, 2)}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" fontWeight="bold">{student.nombre}</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
              {student.matricula} • {student.carrera}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
              <StatusBadge status={student.status} />
              <Chip icon={<Email />} label={student.email} variant="outlined" size="small" />
              <Chip icon={<Phone />} label={student.telefono} variant="outlined" size="small" />
            </Box>
          </Box>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {/* KPIs */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', borderLeft: '4px solid #4caf50' }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">Participación Actual</Typography>
              <Typography variant="h3" fontWeight="bold" color={
                student.participacion >= 80 ? '#4caf50' :
                student.participacion >= 60 ? '#ff9800' : '#f44336'
              }>
                {student.participacion}%
              </Typography>
              <LinearProgress
                variant="determinate"
                value={student.participacion}
                sx={{
                  mt: 2,
                  height: 8,
                  borderRadius: 4,
                  '& .MuiLinearProgress-bar': {
                    bgcolor: student.participacion >= 80 ? '#4caf50' :
                             student.participacion >= 60 ? '#ff9800' : '#f44336'
                  }
                }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', borderLeft: '4px solid #2196f3' }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">Promedio General</Typography>
              <Typography variant="h3" fontWeight="bold" color="#2196f3">
                {student.promedio}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                Escala de 0 a 10
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', borderLeft: '4px solid #9c27b0' }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">Asistencia</Typography>
              <Typography variant="h3" fontWeight="bold" color="#9c27b0">
                {student.asistencia}%
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                {student.asistencia >= 80 ? 'Excelente asistencia' : 'Requiere mejora'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Participation Trend */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
              Historial de Participación (8 semanas)
            </Typography>
            {student.status !== 'active' && (
              <Box sx={{ mb: 2, p: 2, bgcolor: '#ffebee', borderRadius: 1, borderLeft: '4px solid #f44336', display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingDown sx={{ color: '#f44336' }} />
                <Typography variant="body2" color="#c62828">
                  <strong>Alerta:</strong> Se detectó una disminución del 30% en la participación en las últimas 6 semanas
                </Typography>
              </Box>
            )}
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={participationHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="semana" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="participacion"
                  stroke={student.status === 'active' ? '#4caf50' : '#f44336'}
                  strokeWidth={3}
                  dot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Tasks by Subject */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
              Tareas por Materia
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={tasksCompletion} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 10]} />
                <YAxis dataKey="materia" type="category" width={80} />
                <Tooltip />
                <Legend />
                <Bar dataKey="completadas" fill="#4caf50" name="Completadas" />
                <Bar dataKey="totales" fill="#e0e0e0" name="Totales" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Support Plan */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
              Plan de Apoyo Personalizado
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <List>
              {supportPlan.map((plan, index) => (
                <ListItem
                  key={index}
                  sx={{
                    mb: 2,
                    bgcolor: '#f9f9f9',
                    borderRadius: 1,
                    border: '1px solid #e0e0e0',
                    borderLeft: `4px solid ${plan.prioridad === 'alta' ? '#f44336' : '#ff9800'}`
                  }}
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        {plan.status === 'pending' ? (
                          <Warning sx={{ color: '#ff9800' }} />
                        ) : (
                          <CheckCircle sx={{ color: '#4caf50' }} />
                        )}
                        <Typography fontWeight="bold">{plan.tipo}</Typography>
                        <Chip
                          label={plan.prioridad === 'alta' ? 'Prioridad Alta' : 'Prioridad Media'}
                          size="small"
                          color={plan.prioridad === 'alta' ? 'error' : 'warning'}
                        />
                        <Chip
                          label={plan.status === 'pending' ? 'Pendiente' : 'En Progreso'}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                    }
                    secondary={plan.descripcion}
                  />
                </ListItem>
              ))}
            </List>
            <Box sx={{ mt: 3, p: 2, bgcolor: '#e3f2fd', borderRadius: 1 }}>
              <Typography variant="body2" color="#1565c0">
                <CalendarToday sx={{ fontSize: 16, verticalAlign: 'middle', mr: 1 }} />
                <strong>Próxima revisión:</strong> 20 de Mayo, 2026 • Cita con tutor académico programada
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
