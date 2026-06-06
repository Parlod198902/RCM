import React from 'react';
import { Drawer, Box, Typography, IconButton, Chip, Divider, Paper, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { 
  Close as CloseIcon, 
  Lightbulb as LightbulbIcon, 
  Timeline as TimelineIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useSearchParams } from 'react-router';

const mockStudents = {
  1: { 
    id: 1, name: "Ana Silva", matricula: "A01123456", status: "verde", score: 92, participation: 95,
    history: [{ month: 'Sep', score: 85 }, { month: 'Oct', score: 88 }, { month: 'Nov', score: 90 }, { month: 'Dic', score: 91 }, { month: 'Ene', score: 92 }],
    recentActivity: [
      { date: '12 Ene', action: 'Entregó Proyecto Final', type: 'positive' },
      { date: '10 Ene', action: 'Participación en Foro', type: 'positive' }
    ],
    supportPlan: "El alumno mantiene un desempeño excelente. Se sugiere invitarlo a programas de mentoría avanzada."
  },
  2: { 
    id: 2, name: "Carlos Ruiz", matricula: "A01123457", status: "amarillo", score: 75, participation: 60,
    history: [{ month: 'Sep', score: 82 }, { month: 'Oct', score: 80 }, { month: 'Nov', score: 78 }, { month: 'Dic', score: 77 }, { month: 'Ene', score: 75 }],
    recentActivity: [
      { date: '14 Ene', action: 'Faltó a sesión síncrona', type: 'negative' },
      { date: '08 Ene', action: 'Entregó Tarea 4 (Tarde)', type: 'warning' }
    ],
    supportPlan: "Contactar al alumno para entrevista motivacional. Sugerir tutorías de apoyo en materias cuantitativas."
  },
  3: { 
    id: 3, name: "Miguel López", matricula: "A01123458", status: "rojo", score: 58, participation: 30,
    history: [{ month: 'Sep', score: 75 }, { month: 'Oct', score: 70 }, { month: 'Nov', score: 65 }, { month: 'Dic', score: 60 }, { month: 'Ene', score: 58 }],
    recentActivity: [
      { date: '15 Ene', action: 'No entregó Ensayo Final', type: 'negative' },
      { date: '10 Ene', action: 'Faltó a sesión síncrona', type: 'negative' }
    ],
    supportPlan: "Alerta Crítica. Generar cita de urgencia con Dirección de Carrera y enviar aviso oficial de riesgo de abandono. Planificar recuperación intensiva."
  },
  4: { 
    id: 4, name: "Lucía Gómez", matricula: "A01123459", status: "verde", score: 88, participation: 90,
    history: [{ month: 'Sep', score: 85 }, { month: 'Oct', score: 86 }, { month: 'Nov', score: 87 }, { month: 'Dic', score: 85 }, { month: 'Ene', score: 88 }],
    recentActivity: [
      { date: '15 Ene', action: 'Entregó Ensayo Final', type: 'positive' }
    ],
    supportPlan: "Continuar con el seguimiento regular."
  },
};

export function StudentDrawer() {
  const [searchParams, setSearchParams] = useSearchParams();
  const studentId = searchParams.get('studentId');
  const open = Boolean(studentId);
  const student = studentId ? mockStudents[parseInt(studentId) as keyof typeof mockStudents] : null;

  const handleClose = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('studentId');
    setSearchParams(newParams);
  };

  if (!student && open) {
    return null;
  }

  const getColor = (status: string) => {
    switch (status) {
      case 'verde': return 'success.main';
      case 'amarillo': return 'warning.main';
      case 'rojo': return 'error.main';
      default: return 'grey.500';
    }
  };

  const getLabel = (status: string) => {
    switch (status) {
      case 'verde': return 'Sin Riesgo';
      case 'amarillo': return 'Riesgo Medio';
      case 'rojo': return 'Riesgo Crítico';
      default: return 'Desconocido';
    }
  };

  const getActivityIcon = (type: string) => {
    if (type === 'positive') return <CheckCircleIcon color="success" fontSize="small" />;
    if (type === 'negative') return <CancelIcon color="error" fontSize="small" />;
    return <TimelineIcon color="warning" fontSize="small" />;
  };

  return (
    <Drawer 
      anchor="right" 
      open={open} 
      onClose={handleClose} 
      PaperProps={{ sx: { width: { xs: '100%', sm: 480 } } }}
    >
      {student && (
        <Box p={4}>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
            <Box>
              <Typography variant="h5" fontWeight="bold">{student.name}</Typography>
              <Typography variant="body2" color="text.secondary">{student.matricula}</Typography>
            </Box>
            <IconButton onClick={handleClose} edge="end"><CloseIcon /></IconButton>
          </Box>
          
          <Box mb={3} display="flex" alignItems="center" gap={2} flexWrap="wrap">
            <Chip 
              label={getLabel(student.status)} 
              sx={{ 
                bgcolor: getColor(student.status), 
                color: student.status === 'amarillo' ? 'black' : 'white',
                fontWeight: 'bold',
                px: 1
              }} 
            />
            <Typography variant="body2" fontWeight="medium">
              Rendimiento: <strong>{student.score}%</strong>
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              Participación: <strong>{student.participation}%</strong>
            </Typography>
          </Box>
          
          <Divider sx={{ mb: 3 }} />

          <Paper elevation={0} sx={{ p: 2, mb: 4, bgcolor: 'primary.50', border: '1px solid', borderColor: 'primary.100', borderRadius: 2 }}>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <LightbulbIcon color="primary" />
              <Typography variant="subtitle1" fontWeight="bold" color="primary.900">
                Plan de Apoyo Sugerido
              </Typography>
            </Box>
            <Typography variant="body2" color="primary.900">
              {student.supportPlan}
            </Typography>
          </Paper>
          
          <Typography variant="h6" fontWeight="bold" gutterBottom>Tendencia de Desempeño</Typography>
          <Box height={220} width="100%" sx={{ ml: -2, mb: 4 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={student.history}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} dy={10} />
                <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} dx={-10} />
                <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="score" stroke={student.status === 'rojo' ? '#EF4444' : student.status === 'amarillo' ? '#EAB308' : '#22C55E'} strokeWidth={3} dot={{ r: 4, fill: '#fff', strokeWidth: 2 }} activeDot={{ r: 6 }} name="Rendimiento %" />
              </LineChart>
            </ResponsiveContainer>
          </Box>

          <Typography variant="h6" fontWeight="bold" gutterBottom>Historial de Actividad</Typography>
          <List disablePadding>
            {student.recentActivity.map((activity, i) => (
              <ListItem key={i} disablePadding sx={{ mb: 1.5 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  {getActivityIcon(activity.type)}
                </ListItemIcon>
                <ListItemText 
                  primary={activity.action} 
                  secondary={activity.date}
                  primaryTypographyProps={{ variant: 'body2', fontWeight: 'medium' }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Drawer>
  );
}